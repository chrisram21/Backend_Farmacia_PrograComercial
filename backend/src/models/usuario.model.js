import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Usuario = sequelize.define('Usuario', {
  id_usuario:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user:             { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password:         { type: DataTypes.STRING(255), allowNull: false },
  nombre_usuario:   { type: DataTypes.STRING(255), allowNull: false },
  telefono_usuario: { type: DataTypes.STRING(255) },
  correo_usuario:   { type: DataTypes.STRING(255) },
  dpi_usuario:      { type: DataTypes.STRING(255) },
  estado_usuario:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  id_rol:           { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'usuario',
  defaultScope: { attributes: { exclude: ['password'] } }, // nunca exponer el hash por defecto
  scopes: { withPassword: { attributes: {} } },            // scope explícito para login
});

export default Usuario;
