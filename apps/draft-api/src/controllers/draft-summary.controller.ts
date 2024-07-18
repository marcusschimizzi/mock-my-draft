import { Request, Response } from 'express';
import { DraftSummaryService } from '../services/draft-summary.service';

export class DraftSummaryController {
  private draftSummaryService: DraftSummaryService;

  constructor() {
    this.draftSummaryService = new DraftSummaryService();
    this.getDraftSummary = this.getDraftSummary.bind(this);
    this.getTeamDraftSummary = this.getTeamDraftSummary.bind(this);
  }

  async getDraftSummary(req: Request, res: Response) {
    try {
      const year = Number(req.params.year);
      const summary = await this.draftSummaryService.getDraftSummary(year);
      res.status(200).json(summary);
    } catch (error) {
      console.error('Error getting draft summary:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getTeamDraftSummary(req: Request, res: Response) {
    try {
      const year = Number(req.params.year);
      const teamId = req.params.teamId;
      const summary = await this.draftSummaryService.getTeamDraftSummary(
        year,
        teamId,
      );
      res.status(200).json(summary);
    } catch (error) {
      console.error('Error getting team draft summary:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
