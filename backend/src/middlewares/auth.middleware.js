import jwt from 'jsonwebtoken';

/**
 * Verifica el token JWT enviado en el header Authorization: Bearer <token>.
 * Si es válido adjunta el payload en req.user.
 */
export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
