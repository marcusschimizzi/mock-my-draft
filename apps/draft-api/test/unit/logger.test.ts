import logger from '../../src/middleware/logger';
import { Request, Response, NextFunction } from 'express';

jest.useFakeTimers().setSystemTime(new Date('2021-01-01T00:00:00Z'));

describe('logger middleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    next = jest.fn();
  });

  it('should log the request details', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const date = new Date().toISOString();
    req = {
      method: 'GET',
      path: '/api/users',
    } as Request;

    logger(req, res, next);

    expect(consoleSpy).toHaveBeenCalledWith(`${date} GET /api/users`);
    expect(next).toHaveBeenCalled();
  });

  it('should call the next function', () => {
    logger(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
