import { Router } from 'express';
import { DraftPicksController } from '../controllers/draft-picks.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const draftPicksController = new DraftPicksController();

router.get('/', draftPicksController.getAllDraftPicks);
router.get('/:id', draftPicksController.getDraftPickById);
router.get(
  '/:year/:round/:pickNumber',
  draftPicksController.getDraftPickByYearRoundAndPickNumber,
);
router.post(
  '/bulk',
  authenticate,
  requireAdmin,
  draftPicksController.bulkCreateDraftPicks,
);
router.post(
  '/',
  authenticate,
  requireAdmin,
  draftPicksController.createDraftPick,
);
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  draftPicksController.updateDraftPick,
);
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  draftPicksController.deleteDraftPick,
);

export default router;
