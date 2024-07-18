import { Router } from 'express';
import { DraftClassGradesController } from '../controllers/draft-class-grades.controller';
import { validateQuery } from '../middleware/validate-query.middleware';
import { DraftClassGradeQueryDto } from '../dtos/draft-class-grade.dto';

const router = Router();
const draftClassGradesController = new DraftClassGradesController();

router.get(
  '/',
  validateQuery(DraftClassGradeQueryDto),
  draftClassGradesController.getAllDraftClassGrades,
);
router.get('/:id', draftClassGradesController.getDraftClassGradeById);
router.post('/', draftClassGradesController.createDraftClassGrade);
router.put('/:id', draftClassGradesController.updateDraftClassGrade);
router.delete('/:id', draftClassGradesController.deleteDraftClassGrade);

export default router;
