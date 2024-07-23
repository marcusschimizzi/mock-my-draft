import { Router } from 'express';
import { DraftClassGradesController } from '../controllers/draft-class-grades.controller';
import { validateQuery } from '../middleware/validate-query.middleware';
import { DraftClassGradeQueryDto } from '../dtos/draft-class-grade.dto';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const draftClassGradesController = new DraftClassGradesController();

router.get(
  '/',
  validateQuery(DraftClassGradeQueryDto),
  draftClassGradesController.getAllDraftClassGrades,
);
router.get('/:id', draftClassGradesController.getDraftClassGradeById);
router.post(
  '/',
  authenticate,
  requireAdmin,
  draftClassGradesController.createDraftClassGrade,
);
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  draftClassGradesController.updateDraftClassGrade,
);
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  draftClassGradesController.deleteDraftClassGrade,
);

export default router;
