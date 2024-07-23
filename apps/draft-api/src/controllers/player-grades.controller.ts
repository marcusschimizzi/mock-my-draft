import { NextFunction, Request, Response } from 'express';
import { WithValidatedQuery } from '../decorators/with-validated-query';
import {
  CreatePlayerGradeDto,
  PlayerGradeQueryDto,
  UpdatePlayerGradeDto,
} from '../dtos/player-grade.dto';
import { RequestWithValidatedQuery } from '../middleware/validate-query.middleware';
import { PlayerGradesService } from '../services/player-grades.service';

export class PlayerGradesController {
  private playerGradesService: PlayerGradesService;

  constructor() {
    this.playerGradesService = new PlayerGradesService();
    this.getAllPlayerGrades = this.getAllPlayerGrades.bind(this);
    this.getPlayerGradeById = this.getPlayerGradeById.bind(this);
    this.createPlayerGrade = this.createPlayerGrade.bind(this);
    this.updatePlayerGrade = this.updatePlayerGrade.bind(this);
    this.deletePlayerGrade = this.deletePlayerGrade.bind(this);
  }

  @WithValidatedQuery<PlayerGradeQueryDto>()
  async getAllPlayerGrades(
    req: RequestWithValidatedQuery<PlayerGradeQueryDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const grades = await this.playerGradesService.getAllPlayerGrades(
        req.validatedQuery,
      );
      res.status(200).json(grades);
    } catch (error) {
      console.error('Error getting all player grades:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getPlayerGradeById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const grade = await this.playerGradesService.getPlayerGradeById(id);
      res.status(200).json(grade);
    } catch (error) {
      console.error('Error getting player grade by id:', error);
      res.status(404).json({ message: 'Player grade not found' });
    }
  }

  async createPlayerGrade(req: Request, res: Response) {
    try {
      const createDto = req.body as CreatePlayerGradeDto;
      const grade = await this.playerGradesService.createPlayerGrade(createDto);
      res.status(201).json(grade);
    } catch (error) {
      console.error('Error creating player grade:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updatePlayerGrade(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateDto = req.body as UpdatePlayerGradeDto;
      const grade = await this.playerGradesService.updatePlayerGrade(
        id,
        updateDto,
      );
      res.status(200).json(grade);
    } catch (error) {
      console.error('Error updating player grade:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deletePlayerGrade(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.playerGradesService.deletePlayerGrade(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting player grade:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
