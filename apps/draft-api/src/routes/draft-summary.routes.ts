import { Router } from 'express';
import { DraftSummaryController } from '../controllers/draft-summary.controller';

const router = Router();
const controller = new DraftSummaryController();

router.get('/:year', controller.getDraftSummary);
router.get('/years', controller.getYears);
router.get('/:year/team/:teamId', controller.getTeamDraftSummary);

export default router;
