import { Request, Response } from 'express';
import { SourcesService } from '../services/sources-service';

export class SourcesController {
  private sourcesService: SourcesService;

  constructor() {
    this.sourcesService = new SourcesService();
  }

  public async getAllSources(req: Request, res: Response): Promise<void> {
    try {
      const sources = await this.sourcesService.getAllSources();
      res.status(200).json(sources);
    } catch (error) {
      console.error('Error getting all sources:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async getSourceByIdOrSlug(req: Request, res: Response): Promise<void> {
    try {
      const source = await this.sourcesService.getSourceByIdOrSlug(
        req.params.idOrSlug
      );

      if (!source) {
        res.status(404).json({ message: 'Source not found' });
        return;
      }

      res.status(200).json(source);
    } catch (error) {
      console.error('Error getting source by id or slug:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async createSource(req: Request, res: Response): Promise<void> {
    try {
      const source = await this.sourcesService.createSource(req.body);
      res.status(201).json(source);
    } catch (error) {
      console.error('Error creating source:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async updateSource(req: Request, res: Response): Promise<void> {
    try {
      const source = await this.sourcesService.updateSource(
        req.params.id,
        req.body
      );

      if (!source) {
        res.status(404).json({ message: 'Source not found' });
        return;
      }

      res.json(source);
    } catch (error) {
      console.error('Error updating source:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async deleteSource(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.sourcesService.deleteSource(req.params.id);

      if (!deleted) {
        res.status(404).json({ message: 'Source not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting source:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
