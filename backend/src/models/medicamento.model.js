import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Medicamento = sequelize.define('Medicamento', {
  id_medicamento:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  codigo_medicamento:        { type: DataTypes.STRING(255), allowNull: false },
  nombre_medicamento:        { type: DataTypes.STRING(255), allowNull: false },
  cantidad_por_presentacion: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  precio_mayorista:          { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  precio_minimo:             { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  precio_venta:              { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  componente:                { type: DataTypes.STRING(255) },
  estado_medicamento:        { type: DataTypes.ENUM('disponible', 'agotado', 'vencido'), allowNull: false, defaultValue: 'disponible' },
  venta_libre:               { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  existencia_total:          { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  id_presentacion:           { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'medicamento' });

export default Medicamento;
