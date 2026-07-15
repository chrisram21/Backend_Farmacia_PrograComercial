/**
 * Manejador central de errores.
 * Traduce los errores más comunes de Sequelize a respuestas claras.
 */
export const errorHandler = (err, req, res, next) => { // eslint-disable-line
  console.error('[ERROR]', err.message);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Error de validación',
      detalles: err.errors?.map((e) => e.message),
    });
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ message: 'Referencia inválida: la llave foránea no existe' });
  }

  res.status(500).json({ message: 'Error interno del servidor' });
};

export const notFound = (req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};
