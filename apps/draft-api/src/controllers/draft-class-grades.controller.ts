import { NextFunction, Request, Response } from 'express';
import { WithValidatedQuery } from '../decorators/with-validated-query';
import {
  CreateDraftClassGradeDto,
  DraftClassGradeQueryDto,
  UpdateDraftClassGradeDto,
} from '../dtos/draft-class-grade.dto';
import { RequestWithValidatedQuery } from '../middleware/validate-query.middleware';
import { DraftClassGradesService } from '../services/draft-class-grades-service';

export class DraftClassGradesController {
  private draftClassGradesService: DraftClassGradesService;

  constructor() {
    this.draftClassGradesService = new DraftClassGradesService();
    this.getAllDraftClassGrades = this.getAllDraftClassGrades.bind(this);
    this.getDraftClassGradeById = this.getDraftClassGradeById.bind(this);
    this.createDraftClassGrade = this.createDraftClassGrade.bind(this);
    this.updateDraftClassGrade = this.updateDraftClassGrade.bind(this);
    this.deleteDraftClassGrade = this.deleteDraftClassGrade.bind(this);
  }

  @WithValidatedQuery<DraftClassGradeQueryDto>()
  async getAllDraftClassGrades(
    req: RequestWithValidatedQuery<DraftClassGradeQueryDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const grades = await this.draftClassGradesService.getAllDraftClassGrades(
        req.validatedQuery,
      );
      res.status(200).json(grades);
    } catch (error) {
      console.error('Error getting all draft class grades:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getDraftClassGradeById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const grade = await this.draftClassGradesService.getDraftClassGradeById(
        id,
      );
      res.status(200).json(grade);
    } catch (error) {
      console.error('Error getting draft class grade by id:', error);
      res.status(404).json({ message: 'Draft class grade not found' });
    }
  }

  async createDraftClassGrade(req: Request, res: Response) {
    try {
      const createDto = req.body as CreateDraftClassGradeDto;
      const grade = await this.draftClassGradesService.createDraftClassGrade(
        createDto,
      );
      res.status(201).json(grade);
    } catch (error) {
      console.error('Error creating draft class grade:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateDraftClassGrade(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateDto = req.body as UpdateDraftClassGradeDto;
      const grade = await this.draftClassGradesService.updateDraftClassGrade(
        id,
        updateDto,
      );
      res.status(200).json(grade);
    } catch (error) {
      console.error('Error updating draft class grade:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteDraftClassGrade(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.draftClassGradesService.deleteDraftClassGrade(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting draft class grade:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
