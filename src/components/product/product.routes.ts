import { Router } from 'express';
import { authenticate, requireRole } from '../../middlewares/auth.middleware';
import * as productController from './product.controller';

const router = Router();

// Lectura: abierta
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Crear y modificar: hay que estar logueado
router.post('/', authenticate, productController.create);
router.put('/:id', authenticate, productController.update);

// Eliminar: solo el encargado
router.delete('/:id', authenticate, requireRole('shopper'), productController.remove);

export default router;
