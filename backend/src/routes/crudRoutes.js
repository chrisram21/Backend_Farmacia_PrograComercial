import { Router } from 'express';

/**
 * Genera un router con las rutas REST estándar apuntando a un controlador CRUD.
 *   GET    /        -> getAll
 *   GET    /:id     -> getById
 *   POST   /        -> create
 *   PUT    /:id     -> update
 *   DELETE /:id     -> remove
 */
export const crudRoutes = (controller) => {
  const router = Router();
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);
  return router;
};
