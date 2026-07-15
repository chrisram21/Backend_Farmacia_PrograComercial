import { Router } from 'express';
import ventaController from '../controllers/venta.controller.js';

const router = Router();
router.get('/', ventaController.getAll);
router.get('/:id', ventaController.getById);
router.post('/', ventaController.create);
router.delete('/:id', ventaController.remove); // anulación lógica

export default router;
