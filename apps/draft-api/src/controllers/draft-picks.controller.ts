import { Request, Response } from 'express';
import { DraftPicksService } from '../services/draft-picks.service';

export class DraftPicksController {
  private draftPicksService: DraftPicksService;

  constructor() {
    this.draftPicksService = new DraftPicksService();
  }

  public getAllDraftPicks = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const picks = await this.draftPicksService.getAllDraftPicks();
      res.status(200).json(picks);
    } catch (error) {
      console.error('Error getting all draft picks:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getDraftPickById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const pick = await this.draftPicksService.getDraftPickById(req.params.id);

      if (!pick) {
        res.status(404).json({ message: 'Draft pick not found' });
        return;
      }

      res.status(200).json(pick);
    } catch (error) {
      console.error('Error getting draft pick by id:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getDraftPicksByYearAndTeamId = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const picks = await this.draftPicksService.getDraftPicksByYearAndTeamId(
        parseInt(req.params.year),
        req.params.teamId,
      );

      res.status(200).json(picks);
    } catch (error) {
      console.error('Error getting draft picks by year and team id:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getDraftPickByYearRoundAndPickNumber = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const pick =
        await this.draftPicksService.getDraftPickByYearRoundAndPickNumber(
          parseInt(req.params.year),
          parseInt(req.params.round),
          parseInt(req.params.pickNumber),
        );

      if (!pick) {
        res.status(404).json({ message: 'Draft pick not found' });
        return;
      }

      res.status(200).json(pick);
    } catch (error) {
      console.error(
        'Error getting draft pick by year, round, and pick number:',
        error,
      );
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getYears = async (req: Request, res: Response): Promise<void> => {
    try {
      const years = await this.draftPicksService.getYears();
      res.status(200).json(years);
    } catch (error) {
      console.error('Error getting years:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public createDraftPick = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const pick = await this.draftPicksService.createDraftPick(req.body);
      res.status(201).json(pick);
    } catch (error) {
      console.error('Error creating draft pick:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public bulkCreateDraftPicks = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const picks = await this.draftPicksService.createBulkDraftPicks(req.body);
      res.status(207).json(picks);
    } catch (error) {
      console.error('Error bulk creating draft picks:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateDraftPick = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const pick = await this.draftPicksService.updateDraftPick(
        req.params.id,
        req.body,
      );

      if (!pick) {
        res.status(404).json({ message: 'Draft pick not found' });
        return;
      }

      res.json(pick);
    } catch (error) {
      console.error('Error updating draft pick:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public deleteDraftPick = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const deleted = await this.draftPicksService.deleteDraftPick(
        req.params.id,
      );

      if (!deleted) {
        res.status(404).json({ message: 'Draft pick not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting draft pick:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
