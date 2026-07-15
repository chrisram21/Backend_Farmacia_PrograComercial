import sequelize from '../config/database.js';

import Rol from './rol.model.js';
import Presentacion from './presentacion.model.js';
import MetodoPago from './metodoPago.model.js';
import Proveedor from './proveedor.model.js';
import Cliente from './cliente.model.js';
import Usuario from './usuario.model.js';
import Medicamento from './medicamento.model.js';
import DetalleProveedor from './detalleProveedor.model.js';
import DetalleMetodoPago from './detalleMetodoPago.model.js';
import Venta from './venta.model.js';
import DetalleVenta from './detalleVenta.model.js';

/* =========================================================
 *  ASOCIACIONES — todas de tipo 1:M (uno a muchos)
 *  Se definen con alias explícitos para poder incluirlas
 *  fácilmente en los controladores.
 * ========================================================= */

// Rol (1) -> (M) Usuario
Rol.hasMany(Usuario, { foreignKey: 'id_rol', as: 'usuarios' });
Usuario.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' });

// Presentacion (1) -> (M) Medicamento
Presentacion.hasMany(Medicamento, { foreignKey: 'id_presentacion', as: 'medicamentos' });
Medicamento.belongsTo(Presentacion, { foreignKey: 'id_presentacion', as: 'presentacion' });

// Proveedor (1) -> (M) DetalleProveedor
Proveedor.hasMany(DetalleProveedor, { foreignKey: 'id_proveedor', as: 'detalles' });
DetalleProveedor.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });

// Medicamento (1) -> (M) DetalleProveedor
Medicamento.hasMany(DetalleProveedor, { foreignKey: 'id_medicamento', as: 'proveedores' });
DetalleProveedor.belongsTo(Medicamento, { foreignKey: 'id_medicamento', as: 'medicamento' });

// MetodoPago (1) -> (M) DetalleMetodoPago
MetodoPago.hasMany(DetalleMetodoPago, { foreignKey: 'id_metodo_pago', as: 'detalles' });
DetalleMetodoPago.belongsTo(MetodoPago, { foreignKey: 'id_metodo_pago', as: 'metodoPago' });

// Usuario (1) -> (M) Venta
Usuario.hasMany(Venta, { foreignKey: 'id_usuario', as: 'ventas' });
Venta.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// Cliente (1) -> (M) Venta
Cliente.hasMany(Venta, { foreignKey: 'id_cliente', as: 'ventas' });
Venta.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

// DetalleMetodoPago (1) -> (M) Venta
DetalleMetodoPago.hasMany(Venta, { foreignKey: 'id_detalle_metodo_pago', as: 'ventas' });
Venta.belongsTo(DetalleMetodoPago, { foreignKey: 'id_detalle_metodo_pago', as: 'detalleMetodoPago' });

// Venta (1) -> (M) DetalleVenta
Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta', as: 'detalles' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta', as: 'venta' });

// Medicamento (1) -> (M) DetalleVenta
Medicamento.hasMany(DetalleVenta, { foreignKey: 'id_medicamento', as: 'detallesVenta' });
DetalleVenta.belongsTo(Medicamento, { foreignKey: 'id_medicamento', as: 'medicamento' });

const db = {
  sequelize,
  Rol,
  Presentacion,
  MetodoPago,
  Proveedor,
  Cliente,
  Usuario,
  Medicamento,
  DetalleProveedor,
  DetalleMetodoPago,
  Venta,
  DetalleVenta,
};

export default db;
