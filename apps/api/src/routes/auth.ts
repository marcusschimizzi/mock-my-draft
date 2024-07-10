import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { authenticate } from '../middleware/auth-middleware';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.getCurrentUser);

router.post('/register', authController.register);

export default router;
