import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Rol = sequelize.define('Rol', {
  id_rol:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_rol: { type: DataTypes.STRING(255), allowNull: false },
  estado_rol: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'rol' });

export default Rol;
