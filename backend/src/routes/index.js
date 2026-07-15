import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import authRoutes from './auth.routes.js';
import rolRoutes from './rol.routes.js';
import presentacionRoutes from './presentacion.routes.js';
import metodoPagoRoutes from './metodoPago.routes.js';
import proveedorRoutes from './proveedor.routes.js';
import clienteRoutes from './cliente.routes.js';
import usuarioRoutes from './usuario.routes.js';
import medicamentoRoutes from './medicamento.routes.js';
import detalleProveedorRoutes from './detalleProveedor.routes.js';
import detalleMetodoPagoRoutes from './detalleMetodoPago.routes.js';
import ventaRoutes from './venta.routes.js';
import detalleVentaRoutes from './detalleVenta.routes.js';

const router = Router();

// Público
router.use('/auth', authRoutes);

// Protegido con JWT. Comenta la siguiente línea si quieres desactivar la
// autenticación durante el desarrollo.
router.use(verifyToken);

router.use('/roles', rolRoutes);
router.use('/presentaciones', presentacionRoutes);
router.use('/metodos-pago', metodoPagoRoutes);
router.use('/proveedores', proveedorRoutes);
router.use('/clientes', clienteRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/medicamentos', medicamentoRoutes);
router.use('/detalle-proveedores', detalleProveedorRoutes);
router.use('/detalle-metodo-pago', detalleMetodoPagoRoutes);
router.use('/ventas', ventaRoutes);
router.use('/detalle-ventas', detalleVentaRoutes);

export default router;
