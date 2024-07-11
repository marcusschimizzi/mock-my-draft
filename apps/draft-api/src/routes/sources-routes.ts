import { Router } from 'express';
import { SourcesController } from '../controllers/sources-controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const sourcesController = new SourcesController();

router.get('/', sourcesController.getAllSources);
router.get('/:idOrSlug', sourcesController.getSourceByIdOrSlug);
router.post('/', authenticate, requireAdmin, sourcesController.createSource);
router.put('/:id', authenticate, requireAdmin, sourcesController.updateSource);
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  sourcesController.deleteSource
);

export default router;
