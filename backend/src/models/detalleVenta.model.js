import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DetalleVenta = sequelize.define('DetalleVenta', {
  id_detalle_venta:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_venta:               { type: DataTypes.INTEGER, allowNull: false },
  id_medicamento:         { type: DataTypes.INTEGER, allowNull: false },
  cantidad_detalle_venta: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  subtotal_venta:         { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  estado_detalle_venta:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'detalle_venta' });

export default DetalleVenta;
