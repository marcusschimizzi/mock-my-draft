import { Router } from 'express';
import { PlayerRankingsController } from '../controllers/player-rankings.controller';
import { validateQuery } from '../middleware/validate-query.middleware';
import { PlayerRankingQueryDto } from '../dtos/player-ranking.dto';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const playerRankingsController = new PlayerRankingsController();

router.get(
  '/',
  validateQuery(PlayerRankingQueryDto),
  playerRankingsController.getAllPlayerRankings,
);
router.get('/:id', playerRankingsController.getPlayerRankingById);
router.post(
  '/',
  authenticate,
  requireAdmin,
  playerRankingsController.createPlayerRanking,
);
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  playerRankingsController.updatePlayerRanking,
);
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  playerRankingsController.deletePlayerRanking,
);

export default router;
