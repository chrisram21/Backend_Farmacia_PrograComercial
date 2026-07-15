/**
 * Fábrica de controladores CRUD.
 * Genera las 5 operaciones estándar para cualquier modelo de Sequelize,
 * evitando repetir el mismo código en cada entidad.
 *
 * @param {import('sequelize').Model} Model  Modelo Sequelize
 * @param {object} options
 * @param {string} options.pk        Nombre de la llave primaria
 * @param {string} [options.estado]  Nombre del campo de estado (para borrado lógico)
 * @param {Array}  [options.include] Asociaciones a incluir en las consultas
 */
export const crudController = (Model, { pk, estado = null, include = [] } = {}) => ({
  // GET /  -> lista todos
  getAll: async (req, res, next) => {
    try {
      const data = await Model.findAll({ include, order: [[pk, 'ASC']] });
      res.json(data);
    } catch (err) { next(err); }
  },

  // GET /:id -> obtiene uno
  getById: async (req, res, next) => {
    try {
      const item = await Model.findByPk(req.params.id, { include });
      if (!item) return res.status(404).json({ message: 'Registro no encontrado' });
      res.json(item);
    } catch (err) { next(err); }
  },

  // POST / -> crea
  create: async (req, res, next) => {
    try {
      const nuevo = await Model.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) { next(err); }
  },

  // PUT /:id -> actualiza
  update: async (req, res, next) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Registro no encontrado' });
      await item.update(req.body);
      res.json(item);
    } catch (err) { next(err); }
  },

  // DELETE /:id -> borrado lógico si existe campo estado, físico en caso contrario
  remove: async (req, res, next) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Registro no encontrado' });

      if (estado) {
        await item.update({ [estado]: false });
        return res.json({ message: 'Registro desactivado', [pk]: item[pk] });
      }
      await item.destroy();
      res.json({ message: 'Registro eliminado', [pk]: item[pk] });
    } catch (err) { next(err); }
  },
});
