import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const authController = {
  /**
   * POST /auth/login
   * Body: { user, password }
   * Devuelve un token JWT y los datos del usuario (sin password).
   */
  login: async (req, res, next) => {
    try {
      const { user, password } = req.body;
      if (!user || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
      }

      // Usamos el scope withPassword para poder comparar el hash.
      const usuario = await db.Usuario.scope('withPassword').findOne({
        where: { user },
        include: [{ model: db.Rol, as: 'rol' }],
      });

      if (!usuario || !usuario.estado_usuario) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const ok = await bcrypt.compare(password, usuario.password);
      if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

      const token = jwt.sign(
        { id_usuario: usuario.id_usuario, id_rol: usuario.id_rol, user: usuario.user },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      );

      const datos = usuario.toJSON();
      delete datos.password;

      res.json({ token, usuario: datos });
    } catch (err) { next(err); }
  },

  /**
   * GET /auth/me  -> datos del usuario autenticado (requiere token).
   */
  me: async (req, res, next) => {
    try {
      const usuario = await db.Usuario.findByPk(req.user.id_usuario, {
        include: [{ model: db.Rol, as: 'rol' }],
      });
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (err) { next(err); }
  },
};

export default authController;
