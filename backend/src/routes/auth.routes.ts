import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', authController.login);
router.get('/verify', requireAdmin, authController.verify);

export default router;
