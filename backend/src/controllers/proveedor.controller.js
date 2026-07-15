import db from '../models/index.js';
import { crudController } from '../utils/crudController.js';

const base = crudController(db.Proveedor, { pk: 'id_proveedor', estado: 'estado_proveedor' });
export default base;
