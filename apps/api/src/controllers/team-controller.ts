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
}
