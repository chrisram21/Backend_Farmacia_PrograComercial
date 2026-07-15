import db from '../models/index.js';
import { crudController } from '../utils/crudController.js';

const include = [{ model: db.Presentacion, as: 'presentacion' }];
const base = crudController(db.Medicamento, {
  pk: 'id_medicamento',
  include,
});
export default base;
