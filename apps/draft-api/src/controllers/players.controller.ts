import { Request, Response } from 'express';
import { PlayersService } from '../services/players-service';

export class PlayersController {
  private playersService: PlayersService;

  constructor() {
    this.playersService = new PlayersService();
  }

  public getAllPlayers = async (req: Request, res: Response): Promise<void> => {
    try {
      const players = await this.playersService.getAllPlayers();
      res.status(200).json(players);
    } catch (error) {
      console.error('Error getting all players:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getPlayerById = async (req: Request, res: Response): Promise<void> => {
    try {
      const player = await this.playersService.getPlayerById(req.params.id);

      if (!player) {
        res.status(404).json({ message: 'Player not found' });
        return;
      }

      res.status(200).json(player);
    } catch (error) {
      console.error('Error getting player by id:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public createPlayer = async (req: Request, res: Response): Promise<void> => {
    try {
      const player = await this.playersService.createPlayer(req.body);
      res.status(201).json(player);
    } catch (error) {
      console.error('Error creating player:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updatePlayer = async (req: Request, res: Response): Promise<void> => {
    try {
      const player = await this.playersService.updatePlayer(
        req.params.id,
        req.body,
      );

      if (!player) {
        res.status(404).json({ message: 'Player not found' });
        return;
      }

      res.status(200).json(player);
    } catch (error) {
      console.error('Error updating player:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public deletePlayer = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await this.playersService.deletePlayer(req.params.id);

      if (!deleted) {
        res.status(404).json({ message: 'Player not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting player:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
