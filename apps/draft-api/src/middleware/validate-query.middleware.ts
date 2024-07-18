import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export interface RequestWithValidatedQuery<T> extends Request {
  validatedQuery?: T;
}

export const isRequestWithValidatedQuery = <T>(
  req: Request,
): req is RequestWithValidatedQuery<T> => {
  return 'validatedQuery' in req;
};

export function validateQuery<T extends object>(type: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const query = plainToClass(type, req.query);
    const errors = await validate(query);
    if (errors.length > 0) {
      const errorMessages = errors.map((error) =>
        Object.values(error.constraints || {}).join(', '),
      );
      return res.status(400).json({ errorMessages });
    }
    (req as RequestWithValidatedQuery<T>).validatedQuery = query;
    next();
  };
}
