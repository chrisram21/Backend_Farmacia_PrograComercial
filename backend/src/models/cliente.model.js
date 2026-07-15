import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cliente = sequelize.define('Cliente', {
  id_cliente:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_cliente: { type: DataTypes.STRING(255), allowNull: false },
  nit_cliente:    { type: DataTypes.STRING(255) },
}, { tableName: 'cliente' });

export default Cliente;
