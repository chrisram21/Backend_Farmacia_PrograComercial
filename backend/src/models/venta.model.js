import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Venta = sequelize.define('Venta', {
  id_venta:               { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha_venta:            { type: DataTypes.DATEONLY, allowNull: false },
  estado_venta:           { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  total_venta:            { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  id_usuario:             { type: DataTypes.INTEGER, allowNull: false },
  id_detalle_metodo_pago: { type: DataTypes.INTEGER, allowNull: false },
  id_cliente:             { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'venta' });

export default Venta;
