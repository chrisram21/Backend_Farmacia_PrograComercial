import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MetodoPago = sequelize.define('MetodoPago', {
  id_metodo_pago:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_metodo_pago: { type: DataTypes.STRING(255), allowNull: false },
  estado_metodo_pago: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'metodos_pago' });

export default MetodoPago;
