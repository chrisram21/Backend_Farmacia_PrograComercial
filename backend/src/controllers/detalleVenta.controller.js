import db from '../models/index.js';
import { crudController } from '../utils/crudController.js';

const include = [
  { model: db.Venta, as: 'venta' },
  { model: db.Medicamento, as: 'medicamento' },
];
const base = crudController(db.DetalleVenta, {
  pk: 'id_detalle_venta',
  estado: 'estado_detalle_venta',
  include,
});
export default base;
