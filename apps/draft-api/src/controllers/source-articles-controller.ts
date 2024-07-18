import { NextFunction, Request, Response } from 'express';
import { SourceArticlesService } from '../services/source-articles-service';
import {
  CreateSourceArticleDto,
  SourceArticleQueryDto,
  UpdateSourceArticleDto,
} from '../dtos/source-article.dto';
import { WithValidatedQuery } from '../decorators/with-validated-query';
import { RequestWithValidatedQuery } from '../middleware/validate-query.middleware';

export class SourceArticlesController {
  private sourceArticlesService: SourceArticlesService;

  constructor() {
    this.sourceArticlesService = new SourceArticlesService();
    this.getAllSourceArticles = this.getAllSourceArticles.bind(this);
    this.getSourceArticleById = this.getSourceArticleById.bind(this);
    this.createSourceArticle = this.createSourceArticle.bind(this);
    this.updateSourceArticle = this.updateSourceArticle.bind(this);
    this.deleteSourceArticle = this.deleteSourceArticle.bind(this);
    this.getArticlesBySource = this.getArticlesBySource.bind(this);
    this.getArticlesByYear = this.getArticlesByYear.bind(this);
  }

  @WithValidatedQuery<SourceArticleQueryDto>()
  async getAllSourceArticles(
    req: RequestWithValidatedQuery<SourceArticleQueryDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const articles = await this.sourceArticlesService.getAllSourceArticles(
        req.validatedQuery,
      );
      res.status(200).json(articles);
    } catch (error) {
      console.error('Error getting all source articles:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getSourceArticleById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const article = await this.sourceArticlesService.getSourceArticleById(id);
      res.status(200).json(article);
    } catch (error) {
      console.error('Error getting source article by id:', error);
      res.status(404).json({ message: 'Source article not found' });
    }
  }

  async createSourceArticle(req: Request, res: Response) {
    try {
      const createDto = req.body as CreateSourceArticleDto;
      const article = await this.sourceArticlesService.createSourceArticle(
        createDto,
      );
      res.status(201).json(article);
    } catch (error) {
      console.error('Error creating source article:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateSourceArticle(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateDto = req.body as UpdateSourceArticleDto;
      const article = await this.sourceArticlesService.updateSourceArticle(
        id,
        updateDto,
      );
      res.status(200).json(article);
    } catch (error) {
      console.error('Error updating source article:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteSourceArticle(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.sourceArticlesService.deleteSourceArticle(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting source article:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getArticlesBySource(req: Request, res: Response) {
    try {
      const sourceId = req.params.id;
      const articles =
        await this.sourceArticlesService.findSourceArticlesBySource(sourceId);
      res.status(200).json(articles);
    } catch (error) {
      console.error('Error getting articles by source:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getArticlesByYear(req: Request, res: Response) {
    try {
      const year = parseInt(req.params.year);
      const articles =
        await this.sourceArticlesService.findSourceArticlesByYear(year);
      res.status(200).json(articles);
    } catch (error) {
      console.error('Error getting articles by year:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
