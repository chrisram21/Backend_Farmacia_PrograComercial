import db from '../models/index.js';
import { crudController } from '../utils/crudController.js';

const include = [
  { model: db.Proveedor, as: 'proveedor' },
  { model: db.Medicamento, as: 'medicamento' },
];
const base = crudController(db.DetalleProveedor, {
  pk: 'id_detalle_proveedor',
  estado: 'estado_detalle_proveedor',
  include,
});
export default base;
