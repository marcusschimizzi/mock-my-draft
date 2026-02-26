import { Router } from 'express';
import { DataImportsController } from '../controllers/data-imports.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const dataImportsController = new DataImportsController();

router.get('/status', dataImportsController.getStatus);
router.post(
  '/manual',
  authenticate,
  requireAdmin,
  dataImportsController.runManualImport,
);

export default router;
