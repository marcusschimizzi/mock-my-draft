import { Router } from 'express';
import { PlayersController } from '../controllers/players.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const playersController = new PlayersController();

router.get('/', playersController.getAllPlayers);
router.get('/:id', playersController.getPlayerById);
router.post('/', authenticate, requireAdmin, playersController.createPlayer);
router.put('/:id', authenticate, requireAdmin, playersController.updatePlayer);
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  playersController.deletePlayer,
);

export default router;
