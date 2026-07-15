import db from '../models/index.js';
import { crudController } from '../utils/crudController.js';

const base = crudController(db.Presentacion, { pk: 'id_presentacion', estado: 'estado_presentacion' });
export default base;
