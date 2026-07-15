import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { crudController } from '../utils/crudController.js';

const include = [{ model: db.Rol, as: 'rol' }];
const base = crudController(db.Usuario, { pk: 'id_usuario', estado: 'estado_usuario', include });

// Sobrescribimos create y update para hashear el password.
base.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    const nuevo = await db.Usuario.create(data);
    const limpio = await db.Usuario.findByPk(nuevo.id_usuario, { include });
    res.status(201).json(limpio);
  } catch (err) { next(err); }
};

base.update = async (req, res, next) => {
  try {
    const item = await db.Usuario.scope('withPassword').findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Registro no encontrado' });
    const data = { ...req.body };
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    else delete data.password; // no sobreescribir con vacío
    await item.update(data);
    const limpio = await db.Usuario.findByPk(item.id_usuario, { include });
    res.json(limpio);
  } catch (err) { next(err); }
};

export default base;
