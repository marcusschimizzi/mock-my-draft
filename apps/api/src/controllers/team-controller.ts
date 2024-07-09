import { Request, Response } from 'express';
import { TeamService } from '../services/team-service';

export class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  public getAllTeams = async (req: Request, res: Response): Promise<void> => {
    try {
      const teams = await this.teamService.getAllTeams();
      res.json(teams);
    } catch (error) {
      console.error('Error getting teams', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getTeamByIdOrSlug = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const identifier = req.params.identifier;
      const team = await this.teamService.getTeamByIdOrSlug(identifier);

      if (!team) {
        res.status(404).json({ message: 'Team not found' });
        return;
      }

      res.json(team);
    } catch (error) {
      console.error('Error getting team by id', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public createTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const team = await this.teamService.createTeam(req.body);
      res.status(201).json(team);
    } catch (error) {
      console.error('Error creating team', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const team = await this.teamService.updateTeam(id, req.body);

      if (!team) {
        res.status(404).json({ message: 'Team not found' });
        return;
      }

      res.json(team);
    } catch (error) {
      console.error('Error updating team', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public deleteTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const result = await this.teamService.deleteTeam(id);

      if (!result) {
        res.status(404).json({ message: 'Team not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting team', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
