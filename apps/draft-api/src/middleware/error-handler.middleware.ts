import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/custom-errors';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, status: 'error' });
  }

  console.error(error);
  res.status(500).json({ message: 'Internal server error', status: 'error' });
}
