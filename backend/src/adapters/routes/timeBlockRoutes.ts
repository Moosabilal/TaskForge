import { Router } from 'express';
import { getWeekly, toggleBlock } from '../controllers/TimeBlockController';
import { protect } from '../../infrastructure/middleware/authMiddleware';

const router = Router();

router.get('/', protect, getWeekly);
router.post('/toggle', protect, toggleBlock);

export default router;
