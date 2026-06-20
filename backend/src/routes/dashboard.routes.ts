import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/summary', requireAdmin, dashboardController.getSummary);

export default router;
