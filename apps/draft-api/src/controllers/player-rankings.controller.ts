import { NextFunction, Request, Response } from 'express';
import { PlayerRankingsService } from '../services/player-rankings.service';
import { WithValidatedQuery } from '../decorators/with-validated-query';
import {
  CreatePlayerRankingDto,
  PlayerRankingQueryDto,
  UpdatePlayerRankingDto,
} from '../dtos/player-ranking.dto';
import { RequestWithValidatedQuery } from '../middleware/validate-query.middleware';

export class PlayerRankingsController {
  private playerRankingsService: PlayerRankingsService;

  constructor() {
    this.playerRankingsService = new PlayerRankingsService();
    this.getAllPlayerRankings = this.getAllPlayerRankings.bind(this);
    this.getPlayerRankingById = this.getPlayerRankingById.bind(this);
    this.createPlayerRanking = this.createPlayerRanking.bind(this);
    this.updatePlayerRanking = this.updatePlayerRanking.bind(this);
    this.deletePlayerRanking = this.deletePlayerRanking.bind(this);
  }

  @WithValidatedQuery<PlayerRankingQueryDto>()
  async getAllPlayerRankings(
    req: RequestWithValidatedQuery<PlayerRankingQueryDto>,
    res: Response,
    _next: NextFunction,
  ) {
    try {
      const playerRankings =
        await this.playerRankingsService.getAllPlayerRankings(
          req.validatedQuery,
        );
      res.status(200).json(playerRankings);
    } catch (error) {
      console.error('Error getting all player rankings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getPlayerRankingById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const playerRanking =
        await this.playerRankingsService.getPlayerRankingById(id);
      res.status(200).json(playerRanking);
    } catch (error) {
      console.error('Error getting player ranking by id:', error);
      res.status(404).json({ message: 'Player ranking not found' });
    }
  }

  async createPlayerRanking(req: Request, res: Response) {
    try {
      const createDto = req.body as CreatePlayerRankingDto;
      const playerRanking =
        await this.playerRankingsService.createPlayerRanking(createDto);
      res.status(201).json(playerRanking);
    } catch (error) {
      console.error('Error creating player ranking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updatePlayerRanking(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateDto = req.body as UpdatePlayerRankingDto;
      const playerRanking =
        await this.playerRankingsService.updatePlayerRanking(id, updateDto);
      res.status(200).json(playerRanking);
    } catch (error) {
      console.error('Error updating player ranking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deletePlayerRanking(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.playerRankingsService.deletePlayerRanking(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting player ranking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
