import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Presentacion = sequelize.define('Presentacion', {
  id_presentacion:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_presentacion: { type: DataTypes.STRING(255), allowNull: false },
  estado_presentacion: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'presentacion' });

export default Presentacion;
