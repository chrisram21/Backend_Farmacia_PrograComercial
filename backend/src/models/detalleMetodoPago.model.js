import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DetalleMetodoPago = sequelize.define('DetalleMetodoPago', {
  id_detalle_metodo_pago:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_metodo_pago:               { type: DataTypes.INTEGER, allowNull: false },
  cantidad_detalle_metodo_pago: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  estado_detalle_metodo_pago:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'detalle_metodo_pago' });

export default DetalleMetodoPago;
