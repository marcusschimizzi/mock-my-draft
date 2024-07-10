import { Request, Response } from 'express';
import { SourceService } from '../services/source-service';

export class SourceController {
  private sourceService: SourceService;

  constructor() {
    this.sourceService = new SourceService();
  }

  public getAllSources = async (req: Request, res: Response): Promise<void> => {
    try {
      const sources = await this.sourceService.getAllSources();
      res.json(sources);
    } catch (error) {
      console.error('Error getting sources', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getSourceByIdOrSlug = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const identifier = req.params.identifier;
      const source = await this.sourceService.getSourceByIdOrSlug(identifier);

      if (!source) {
        res.status(404).json({ message: 'Source not found' });
        return;
      }

      res.json(source);
    } catch (error) {
      console.error('Error getting source by id', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public createSource = async (req: Request, res: Response): Promise<void> => {
    try {
      const source = await this.sourceService.createSource(req.body);
      res.status(201).json(source);
    } catch (error) {
      console.error('Error creating source', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateSource = async (req: Request, res: Response): Promise<void> => {
    try {
      const identifier = req.params.identifier;
      const source = await this.sourceService.updateSource(
        identifier,
        req.body,
      );

      if (!source) {
        res.status(404).json({ message: 'Source not found' });
        return;
      }

      res.json(source);
    } catch (error) {
      console.error('Error updating source', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public deleteSource = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.identifier;
      const result = await this.sourceService.deleteSource(id);

      if (!result) {
        res.status(404).json({ message: 'Source not found' });
        return;
      }

      res.status(204).json({ message: 'Source deleted' });
    } catch (error) {
      console.error('Error deleting source', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
