import { Router } from 'express';
import { PlayerGradesController } from '../controllers/player-grades.controller';
import { validateQuery } from '../middleware/validate-query.middleware';
import { PlayerGradeQueryDto } from '../dtos/player-grade.dto';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const playerGradesController = new PlayerGradesController();

router.get(
  '/',
  validateQuery(PlayerGradeQueryDto),
  playerGradesController.getAllPlayerGrades,
);
router.get('/:id', playerGradesController.getPlayerGradeById);
router.post(
  '/',
  authenticate,
  requireAdmin,
  playerGradesController.createPlayerGrade,
);
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  playerGradesController.updatePlayerGrade,
);
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  playerGradesController.deletePlayerGrade,
);

export default router;
