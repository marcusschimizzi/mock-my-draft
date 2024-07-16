import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ParsedUrlQuery } from 'querystring';

export function validateQuery<T extends ParsedUrlQuery>(type: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const query = plainToClass(type, req.query);
    const errors = await validate(query);
    if (errors.length > 0) {
      const errorMessages = errors.map((error) =>
        Object.values(error.constraints || {}).join(', '),
      );
      return res.status(400).json({ errorMessages });
    }
    req.query = query;
    next();
  };
}
