import { Request, Response } from 'express';
import { TeamsService } from '../services/teams-service';

export class TeamsController {
  private teamsService: TeamsService;

  constructor() {
    this.teamsService = new TeamsService();
  }

  public getAllTeams = async (req: Request, res: Response): Promise<void> => {
    try {
      const teams = await this.teamsService.getAllTeams();
      res.status(200).json(teams);
    } catch (error) {
      console.error('Error getting all teams:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getTeamByIdOrSlug = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const team = await this.teamsService.getTeamByIdOrSlug(
        req.params.idOrSlug
      );

      if (!team) {
        res.status(404).json({ message: 'Team not found' });
        return;
      }

      res.status(200).json(team);
    } catch (error) {
      console.error('Error getting team by id or slug:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public createTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const team = await this.teamsService.createTeam(req.body);
      res.status(201).json(team);
    } catch (error) {
      console.error('Error creating team:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const team = await this.teamsService.updateTeam(req.params.id, req.body);

      if (!team) {
        res.status(404).json({ message: 'Team not found' });
        return;
      }

      res.json(team);
    } catch (error) {
      console.error('Error updating team:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public deleteTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await this.teamsService.deleteTeam(req.params.id);

      if (!deleted) {
        res.status(404).json({ message: 'Team not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting team:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
