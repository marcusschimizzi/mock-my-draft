import { Router } from 'express';
import { SourceController } from '../controllers/source-controller';
import { validateIdentifier } from '../middleware/team-validation';
import { authenticate, requireAdmin } from '../middleware/auth-middleware';

const router = Router();
const sourceController = new SourceController();

router.get('/', sourceController.getAllSources);
router.get(
  '/:identifier',
  validateIdentifier,
  sourceController.getSourceByIdOrSlug,
);
router.post('/', authenticate, requireAdmin, sourceController.createSource);
router.put(
  '/:identifier',
  validateIdentifier,
  authenticate,
  requireAdmin,
  sourceController.updateSource,
);
router.delete(
  '/:identifier',
  validateIdentifier,
  authenticate,
  requireAdmin,
  sourceController.deleteSource,
);

export default router;
