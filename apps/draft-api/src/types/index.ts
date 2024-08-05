import { Request } from 'express';
import { User } from '../database/models/user';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export enum Position {
  Quarterback = 'QB',
  RunningBack = 'RB',
  FullBack = 'FB',
  WideReceiver = 'WR',
  TightEnd = 'TE',
  Center = 'C',
  Guard = 'G',
  Tackle = 'T',
  DefensiveInterior = 'DI',
  EdgeDefender = 'ED',
  Linebacker = 'LB',
  Cornerback = 'CB',
  Safety = 'S',
  Kicker = 'K',
  Punter = 'P',
}

export enum Conference {
  NFC = 'nfc',
  AFC = 'afc',
}

export enum Division {
  North = 'north',
  South = 'south',
  East = 'east',
  West = 'west',
}
