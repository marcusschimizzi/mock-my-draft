import { Request, Response } from 'express';
import { DraftSummaryService } from '../services/draft-summary.service';

export class DraftSummaryController {
  private draftSummaryService: DraftSummaryService;

  constructor() {
    this.draftSummaryService = new DraftSummaryService();
    this.getDraftSummary = this.getDraftSummary.bind(this);
    this.getTeamDraftSummary = this.getTeamDraftSummary.bind(this);
    this.getYears = this.getYears.bind(this);
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

  async getYears(req: Request, res: Response) {
    try {
      const { start, end } = req.query;

      // If start/end query params provided, return multi-year summary
      if (start && end) {
        const startYear = parseInt(start as string, 10);
        const endYear = parseInt(end as string, 10);

        if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
          res.status(400).json({ message: 'Invalid year range' });
          return;
        }

        if (endYear - startYear > 10) {
          res.status(400).json({ message: 'Year range cannot exceed 10 years' });
          return;
        }

        const summary = await this.draftSummaryService.getMultiYearSummary(
          startYear,
          endYear,
        );
        res.status(200).json(summary);
        return;
      }

      // Otherwise return list of available years
      const years = await this.draftSummaryService.getYears();
      res.status(200).json(years);
    } catch (error) {
      console.error('Error getting years:', error);
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
