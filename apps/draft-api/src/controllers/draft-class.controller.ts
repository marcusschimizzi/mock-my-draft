import { Request, Response } from 'express';
import { DraftClassService } from '../services/draft-class.service';

export class DraftClassController {
  private draftClassService: DraftClassService;

  constructor() {
    this.draftClassService = new DraftClassService();
  }

  public getDraftClassByYearAndTeamId = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const draftClass =
        await this.draftClassService.getDraftClassByYearAndTeamId(
          parseInt(req.params.year),
          req.params.teamId,
        );

      res.status(200).json(draftClass);
    } catch (error) {
      console.error('Error getting draft class by year and team id:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getDraftClassesByYear = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const draftClass = await this.draftClassService.getDraftClassesByYear(
        parseInt(req.params.year),
      );

      res.status(200).json(draftClass);
    } catch (error) {
      console.error('Error getting draft class by year:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public createDraftClass = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const draftClass = await this.draftClassService.createDraftClass(
        req.body,
      );
      res.status(201).json(draftClass);
    } catch (error) {
      console.error('Error creating draft class:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateDraftClass = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const year = parseInt(req.params.year);
      const teamId = req.params.teamId;
      const draftClass = await this.draftClassService.updateDraftClass(
        year,
        teamId,
        req.body,
      );
      res.status(200).json(draftClass);
    } catch (error) {
      console.error('Error updating draft class:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
