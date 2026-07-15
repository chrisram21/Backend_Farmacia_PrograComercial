import db from '../models/index.js';
import { crudController } from '../utils/crudController.js';

const base = crudController(db.MetodoPago, { pk: 'id_metodo_pago', estado: 'estado_metodo_pago' });
export default base;
