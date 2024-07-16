import { Request, Response, NextFunction } from 'express';
import {
  isRequestWithValidatedQuery,
  RequestWithValidatedQuery,
} from '../middleware/validate-query.middleware';

type ControllerMethod<T> = (
  req: RequestWithValidatedQuery<T>,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export function WithValidatedQuery<T>() {
  return function (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<ControllerMethod<T>>,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      if (isRequestWithValidatedQuery<T>(req)) {
        return originalMethod(req, res, next);
      } else {
        next(
          new Error(
            'Request does not have validated query. Ensure that the validateQuery middleware is applied before this handler.',
          ),
        );
      }
    };

    return descriptor;
  };
}
