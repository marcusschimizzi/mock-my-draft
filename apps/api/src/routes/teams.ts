import { Router } from 'express';
import { TeamController } from '../controllers/team-controller';

const router = Router();
const teamController = new TeamController();

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.get('/:slug', teamController.getTeamBySlug);
router.post('/', teamController.createTeam);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

export default router;
