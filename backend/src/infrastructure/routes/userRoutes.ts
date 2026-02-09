import { Router } from 'express';
import { register, login } from '../../adapters/controllers/AuthController';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
