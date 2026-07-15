import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Proveedor = sequelize.define('Proveedor', {
  id_proveedor:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_proveedor:   { type: DataTypes.STRING(255), allowNull: false },
  nit_proveedor:      { type: DataTypes.STRING(255) },
  telefono_proveedor: { type: DataTypes.STRING(255) },
  estado_proveedor:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'proveedores' });

export default Proveedor;
