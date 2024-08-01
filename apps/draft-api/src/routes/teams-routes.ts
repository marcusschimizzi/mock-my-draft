import { Router } from 'express';
import { TeamsController } from '../controllers/teams-controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const teamsController = new TeamsController();

router.get('/', teamsController.getAllTeams);
router.get('/:idOrSlug', teamsController.getTeamByIdOrSlug);
router.post('/', authenticate, requireAdmin, teamsController.createTeam);
router.post(
  '/bulk',
  authenticate,
  requireAdmin,
  teamsController.bulkCreateTeams,
);
router.put('/:id', authenticate, requireAdmin, teamsController.updateTeam);
router.delete('/:id', authenticate, requireAdmin, teamsController.deleteTeam);

export default router;
