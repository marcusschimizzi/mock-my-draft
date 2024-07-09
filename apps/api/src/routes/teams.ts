import { Router } from 'express';
import { TeamController } from '../controllers/team-controller';
import { validateTeamIdentifier } from '../middleware/team-validation';
import { authenticate, requireAdmin } from '../middleware/auth-middleware';

const router = Router();
const teamController = new TeamController();

router.get('/', teamController.getAllTeams);
router.get(
  '/:identifier',
  validateTeamIdentifier,
  teamController.getTeamByIdOrSlug,
);
router.post('/', authenticate, requireAdmin, teamController.createTeam);
router.put(
  '/:identifier',
  validateTeamIdentifier,
  authenticate,
  requireAdmin,
  teamController.updateTeam,
);
router.delete(
  '/:identifier',
  validateTeamIdentifier,
  authenticate,
  requireAdmin,
  teamController.deleteTeam,
);

export default router;
