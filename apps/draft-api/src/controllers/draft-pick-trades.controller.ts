import { NextFunction, Request, Response } from 'express';
import { DraftPickTradesService } from '../services/draft-pick-trades.service';
import { WithValidatedQuery } from '../decorators/with-validated-query';
import { RequestWithValidatedQuery } from '../middleware/validate-query.middleware';
import {
  CreateDraftPickTradeDto,
  DraftPickTradeQueryDto,
} from '../dtos/draft-pick-trade.dto';

export class DraftPickTradesController {
  private draftPickTradesService: DraftPickTradesService;

  constructor() {
    this.draftPickTradesService = new DraftPickTradesService();
    this.getAllDraftPickTrades = this.getAllDraftPickTrades.bind(this);
    this.getDraftPickTradeById = this.getDraftPickTradeById.bind(this);
    this.createDraftPickTrade = this.createDraftPickTrade.bind(this);
    this.updateDraftPickTrade = this.updateDraftPickTrade.bind(this);
    this.deleteDraftPickTrade = this.deleteDraftPickTrade.bind(this);
  }

  @WithValidatedQuery<DraftPickTradeQueryDto>()
  async getAllDraftPickTrades(
    req: RequestWithValidatedQuery<DraftPickTradeQueryDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const trades = await this.draftPickTradesService.getAllDraftPickTrades(
        req.validatedQuery,
      );
      res.status(200).json(trades);
    } catch (error) {
      console.error('Error getting all draft pick trades:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getDraftPickTradeById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const trade = await this.draftPickTradesService.getDraftPickTradeById(id);
      res.status(200).json(trade);
    } catch (error) {
      console.error('Error getting draft pick trade by id:', error);
      res.status(404).json({ message: 'Draft pick trade not found' });
    }
  }

  async createDraftPickTrade(req: Request, res: Response) {
    try {
      const createDto = req.body as CreateDraftPickTradeDto;
      const trade = await this.draftPickTradesService.createDraftPickTrade(
        createDto,
      );
      res.status(201).json(trade);
    } catch (error) {
      console.error('Error creating draft pick trade:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateDraftPickTrade(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateDto = req.body as CreateDraftPickTradeDto;
      const trade = await this.draftPickTradesService.updateDraftPickTrade(
        id,
        updateDto,
      );

      if (!trade) {
        res.status(404).json({ message: 'Draft pick trade not found' });
        return;
      }

      res.status(200).json(trade);
    } catch (error) {
      console.error('Error updating draft pick trade:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteDraftPickTrade(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.draftPickTradesService.deleteDraftPickTrade(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting draft pick trade:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
