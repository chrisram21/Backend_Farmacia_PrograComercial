import db from '../models/index.js';
import { crudController } from '../utils/crudController.js';

const base = crudController(db.Rol, { pk: 'id_rol', estado: 'estado_rol' });
export default base;
