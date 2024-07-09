import { Router } from 'express';
import { TeamController } from '../controllers/team-controller';
import { validateTeamIdentifier } from '../middleware/team-validation';

const router = Router();
const teamController = new TeamController();

router.get('/', teamController.getAllTeams);
router.get(
  '/:identifier',
  validateTeamIdentifier,
  teamController.getTeamByIdOrSlug,
);
router.post('/', teamController.createTeam);
router.put('/:identifier', validateTeamIdentifier, teamController.updateTeam);
router.delete(
  '/:identifier',
  validateTeamIdentifier,
  teamController.deleteTeam,
);

export default router;
