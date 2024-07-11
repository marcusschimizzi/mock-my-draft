import { Request } from 'express';
import { User } from '../database/models/user';

export interface AuthenticatedRequest extends Request {
  user?: User;
}
