import db from '../models/index.js';

const includeCompleto = [
  { model: db.Usuario, as: 'usuario' },
  { model: db.Cliente, as: 'cliente' },
  {
    model: db.DetalleMetodoPago,
    as: 'detalleMetodoPago',
    include: [{ model: db.MetodoPago, as: 'metodoPago' }],
  },
  {
    model: db.DetalleVenta,
    as: 'detalles',
    include: [{ model: db.Medicamento, as: 'medicamento' }],
  },
];

const ventaController = {
  // GET /ventas
  getAll: async (req, res, next) => {
    try {
      const ventas = await db.Venta.findAll({
        include: includeCompleto,
        order: [['id_venta', 'DESC']],
      });
      res.json(ventas);
    } catch (err) { next(err); }
  },

  // GET /ventas/:id
  getById: async (req, res, next) => {
    try {
      const venta = await db.Venta.findByPk(req.params.id, { include: includeCompleto });
      if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });
      res.json(venta);
    } catch (err) { next(err); }
  },

  /**
   * POST /ventas
   * Crea una venta completa en una sola transacción:
   *   1. Registra el detalle de método de pago.
   *   2. Calcula subtotales y total a partir del precio_venta de cada medicamento.
   *   3. Crea la venta y sus detalles.
   *   4. Descuenta la existencia de cada medicamento.
   *
   * Body esperado:
   * {
   *   "id_usuario": 1,
   *   "id_cliente": 1,
   *   "id_metodo_pago": 1,
   *   "fecha_venta": "2026-07-15",          // opcional, por defecto hoy
   *   "detalles": [ { "id_medicamento": 1, "cantidad_detalle_venta": 2 } ]
   * }
   */
  create: async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
      const { id_usuario, id_cliente, id_metodo_pago, detalles } = req.body;
      const fecha_venta = req.body.fecha_venta || new Date().toISOString().slice(0, 10);

      if (!Array.isArray(detalles) || detalles.length === 0) {
        await t.rollback();
        return res.status(400).json({ message: 'La venta debe incluir al menos un detalle' });
      }

      // 1. Calcular subtotales validando existencia
      let total = 0;
      const lineas = [];
      for (const d of detalles) {
        const med = await db.Medicamento.findByPk(d.id_medicamento, { transaction: t });
        if (!med) {
          await t.rollback();
          return res.status(400).json({ message: `Medicamento ${d.id_medicamento} no existe` });
        }
        const cantidad = Number(d.cantidad_detalle_venta) || 0;
        if (cantidad <= 0) {
          await t.rollback();
          return res.status(400).json({ message: `Cantidad inválida para ${med.nombre_medicamento}` });
        }
        if (med.existencia_total < cantidad) {
          await t.rollback();
          return res.status(400).json({
            message: `Existencia insuficiente para ${med.nombre_medicamento} (disponible: ${med.existencia_total})`,
          });
        }
        const subtotal = Number(med.precio_venta) * cantidad;
        total += subtotal;
        lineas.push({ med, cantidad, subtotal });
      }

      // 2. Detalle de método de pago (monto = total de la venta)
      const detMetodo = await db.DetalleMetodoPago.create(
        { id_metodo_pago, cantidad_detalle_metodo_pago: total },
        { transaction: t }
      );

      // 3. Cabecera de la venta
      const venta = await db.Venta.create(
        {
          fecha_venta,
          estado_venta: true,
          total_venta: total,
          id_usuario,
          id_cliente,
          id_detalle_metodo_pago: detMetodo.id_detalle_metodo_pago,
        },
        { transaction: t }
      );

      // 4. Detalles + descuento de existencia
      for (const l of lineas) {
        await db.DetalleVenta.create(
          {
            id_venta: venta.id_venta,
            id_medicamento: l.med.id_medicamento,
            cantidad_detalle_venta: l.cantidad,
            subtotal_venta: l.subtotal,
          },
          { transaction: t }
        );
        const nuevaExistencia = l.med.existencia_total - l.cantidad;
        await l.med.update(
          {
            existencia_total: nuevaExistencia,
            estado_medicamento: nuevaExistencia === 0 ? 'agotado' : l.med.estado_medicamento,
          },
          { transaction: t }
        );
      }

      await t.commit();
      const completa = await db.Venta.findByPk(venta.id_venta, { include: includeCompleto });
      res.status(201).json(completa);
    } catch (err) {
      await t.rollback();
      next(err);
    }
  },

  /**
   * DELETE /ventas/:id  -> anulación lógica.
   * Marca la venta como inactiva y reintegra la existencia de los medicamentos.
   */
  remove: async (req, res, next) => {
    const t = await db.sequelize.transaction();
    try {
      const venta = await db.Venta.findByPk(req.params.id, {
        include: [{ model: db.DetalleVenta, as: 'detalles' }],
        transaction: t,
      });
      if (!venta) {
        await t.rollback();
        return res.status(404).json({ message: 'Venta no encontrada' });
      }

      // Reintegrar existencia
      for (const det of venta.detalles) {
        const med = await db.Medicamento.findByPk(det.id_medicamento, { transaction: t });
        if (med) {
          await med.update(
            { existencia_total: med.existencia_total + det.cantidad_detalle_venta },
            { transaction: t }
          );
        }
      }

      await venta.update({ estado_venta: false }, { transaction: t });
      await t.commit();
      res.json({ message: 'Venta anulada', id_venta: venta.id_venta });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  },
};

export default ventaController;
