import db from '../models/index.js';
import { crudController } from '../utils/crudController.js';

const base = crudController(db.Cliente, { pk: 'id_cliente' });
export default base;
