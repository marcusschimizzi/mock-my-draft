import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);
// Admin-only: there is no public self-signup. New accounts are created by an
// authenticated admin (or seeded via initAdmin on startup).
router.post('/register', authenticate, requireAdmin, authController.register);

export default router;
