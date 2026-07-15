import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import db from './src/models/index.js';
import apiRoutes from './src/routes/index.js';
import { errorHandler, notFound } from './src/middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ ok: true, servicio: 'API Sistema de Farmacia' }));

// API
app.use('/api', apiRoutes);

// 404 + manejador de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);

// Arranque: verifica la conexión con MySQL antes de escuchar.
const start = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida.');

    // Sincroniza los modelos con la BD (sin alterar tablas existentes).
    // Usa la BD creada con el script SQL; aquí solo validamos que exista.
    await db.sequelize.sync();

    app.listen(PORT, () => console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ No se pudo conectar a la base de datos:', err.message);
    process.exit(1);
  }
};

start();
