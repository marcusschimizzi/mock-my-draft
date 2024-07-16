import { Router } from 'express';
import { SourceArticlesController } from '../controllers/source-articles-controller';

const router = Router();
const sourceArticlesController = new SourceArticlesController();

router.get('/', sourceArticlesController.getAllSourceArticles);
router.get('/:id', sourceArticlesController.getSourceArticleById);
router.post('/', sourceArticlesController.createSourceArticle);
router.put('/:id', sourceArticlesController.updateSourceArticle);
router.delete('/:id', sourceArticlesController.deleteSourceArticle);

export default router;
