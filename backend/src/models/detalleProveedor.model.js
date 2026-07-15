import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DetalleProveedor = sequelize.define('DetalleProveedor', {
  id_detalle_proveedor:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_proveedor:             { type: DataTypes.INTEGER, allowNull: false },
  id_medicamento:           { type: DataTypes.INTEGER, allowNull: false },
  precio_compra:            { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  estado_detalle_proveedor: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'detalle_proveedores' });

export default DetalleProveedor;
