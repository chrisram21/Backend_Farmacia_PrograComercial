import db from '../models/index.js';
import { crudController } from '../utils/crudController.js';

const include = [{ model: db.MetodoPago, as: 'metodoPago' }];
const base = crudController(db.DetalleMetodoPago, {
  pk: 'id_detalle_metodo_pago',
  estado: 'estado_detalle_metodo_pago',
  include,
});
export default base;
