import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Instancia central de Sequelize.
 * Todas las conexiones a MySQL pasan por aquí.
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      // El diagrama usa una sola columna `timestamp` por tabla.
      // Mapeamos el createdAt de Sequelize a esa columna y desactivamos updatedAt.
      timestamps: true,
      createdAt: 'timestamp',
      updatedAt: false,
      freezeTableName: true,
    },
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  }
);

export default sequelize;
