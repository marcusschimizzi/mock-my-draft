import { NextFunction, Request, Response } from 'express';

export const validateIdentifier = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { identifier } = req.params;

  if (
    /^\d+$/.test(identifier) ||
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(identifier)
  ) {
    next();
  } else {
    res.status(400).json({ message: 'Invalid identifier' });
  }
};
