import { Router } from 'express';
import { DraftPickTradesController } from '../controllers/draft-pick-trades.controller';
import { validateQuery } from '../middleware/validate-query.middleware';
import { DraftPickTradeQueryDto } from '../dtos/draft-pick-trade.dto';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const draftPickTradesController = new DraftPickTradesController();

router.get(
  '/',
  validateQuery(DraftPickTradeQueryDto),
  draftPickTradesController.getAllDraftPickTrades,
);
router.get('/:id', draftPickTradesController.getDraftPickTradeById);
router.post(
  '/',
  authenticate,
  requireAdmin,
  draftPickTradesController.createDraftPickTrade,
);
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  draftPickTradesController.updateDraftPickTrade,
);
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  draftPickTradesController.deleteDraftPickTrade,
);

export default router;
