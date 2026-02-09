import { Router } from 'express';
import { create, getAll, update, remove } from '../../adapters/controllers/TodoController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
    .post(protect, create)
    .get(protect, getAll);

router.route('/:id')
    .put(protect, update)
    .delete(protect, remove);

export default router;
