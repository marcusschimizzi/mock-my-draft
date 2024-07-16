import { Router } from 'express';
import { SourceArticlesController } from '../controllers/source-articles-controller';
import { validateQuery } from '../middleware/validate-query.middleware';
import { SourceArticleQueryDto } from '../dtos/source-article.dto';

const router = Router();
const sourceArticlesController = new SourceArticlesController();

router.get(
  '/',
  validateQuery(SourceArticleQueryDto),
  sourceArticlesController.getAllSourceArticles,
);
router.get('/:id', sourceArticlesController.getSourceArticleById);
router.post('/', sourceArticlesController.createSourceArticle);
router.put('/:id', sourceArticlesController.updateSourceArticle);
router.delete('/:id', sourceArticlesController.deleteSourceArticle);

export default router;
