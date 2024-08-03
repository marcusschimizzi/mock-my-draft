export type Entity = {
  id: string;
  createdAt?: string;
};

export type AuthUser = Entity & {
  email: string;
  username: string;
  token: string;
  isAdmin?: boolean;
};

export type LoginData = {
  username: string;
  password: string;
};

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

export enum Position {
  Quarterback = 'QB',
  RunningBack = 'RB',
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

export type Team = Entity & {
  name: string;
  location: string;
  nickname: string;
  conference: Conference;
  division: Division;
  abbreviation: string;
  slug: string;
  logo?: string;
  colors?: string[];
};

export const defaultTeam: Partial<Team> = {
  name: '',
  location: '',
  nickname: '',
  abbreviation: '',
  slug: '',
};

export type Player = Entity & {
  name: string;
  position: string;
  dateOfBirth?: string;
  college?: string;
  height?: number;
  weight?: number;
  armLength?: number;
  handSize?: number;
  fortyYardDash?: number;
  tenYardSplit?: number;
  twentyYardSplit?: number;
  twentyYardShuttle?: number;
  threeConeDrill?: number;
  verticalJump?: number;
  broadJump?: number;
  benchPress?: number;
  hometown?: string;
};

export type CreatePlayerDto = Omit<Player, 'id'>;

export const defaultPlayer: Partial<Player> = {
  name: '',
  position: '',
};

export type Source = Entity & {
  name: string;
  slug: string;
  baseUrl: string;
  sourceArticles?: SourceArticle[];
};

export const defaultSource: Partial<Source> = {
  name: '',
  slug: '',
  baseUrl: '',
};

export type DraftGradeTeam = Pick<Team, 'id' | 'name' | 'abbreviation'>;
export type DraftGradeSource = Pick<Source, 'id' | 'name' | 'slug'>;
export type SourceArticleSource = Pick<Source, 'id' | 'name' | 'slug'>;

export type DraftGrade = Entity & {
  grade: string;
  gradeNumeric: number;
  year: number;
  text?: string;
  team: DraftGradeTeam;
  sourceArticle: {
    id: string;
    title: string;
    url: string;
    source: DraftGradeSource;
  };
};

export const defaultDraftGrade: Partial<CreateDraftGradeDto> = {
  grade: '',
  year: 2024,
  teamId: '',
  sourceArticleId: '',
};

export type CreateDraftGradeDto = {
  teamId: string;
  grade: string;
  year: number;
  sourceArticleId: string;
  text?: string;
};

export type UpdateDraftGradeDto = Entity & Partial<CreateDraftGradeDto>;

export type PlayerGrade = Entity & {
  grade: string;
  gradeNumeric: number;
  text?: string;
  player: {
    id: string;
    name: string;
    position: string;
    college: string;
  };
  team: DraftGradeTeam;
  sourceArticle: {
    id: string;
    title: string;
    url: string;
    source: DraftGradeSource;
  };
  draftPick: {
    id: string;
    round: number;
    pick: number;
    year: number;
  };
};

export type CreatePlayerGradeDto = {
  playerId: string;
  sourceArticleId: string;
  teamId: string;
  draftPickId: string;
  grade?: string;
  text?: string;
};

export type UpdatePlayerGradeDto = Entity & Partial<CreatePlayerGradeDto>;

export type SourceArticle = Entity & {
  title: string;
  url: string;
  year: number;
  publicationDate?: string;
  source: SourceArticleSource;
  draftClassGrades?: Pick<
    DraftGrade,
    'id' | 'grade' | 'year' | 'text' | 'team'
  >[];
};

export type SourceArticleWithGrades = Entity & {
  title: string;
  url: string;
  year: number;
  publicationDate?: string;
  source: SourceArticleSource;
  draftClassGrades: (Pick<
    DraftGrade,
    'id' | 'grade' | 'year' | 'text' | 'team'
  > & {
    playerGrades: Pick<
      PlayerGrade,
      'id' | 'grade' | 'text' | 'player' | 'draftPick'
    >[];
  })[];
};

export type CreateSourceArticleDto = {
  sourceId: string;
  year: number;
  url: string;
  title?: string;
  publicationDate?: string;
};

export type UpdateSourceArticleDto = Partial<CreateSourceArticleDto>;

export const defaultSourceArticle: Partial<SourceArticle> = {
  title: '',
  url: '',
  year: 2024,
};

export type DraftPick = Entity & {
  round: number;
  pickNumber: number;
  year: number;
  originalTeam: Pick<Team, 'id' | 'name' | 'abbreviation'>;
  currentTeam: Pick<Team, 'id' | 'name' | 'abbreviation'>;
  player?: Player;
};

export type CreateDraftPickDto = {
  round: number;
  pickNumber: number;
  year: number;
  originalTeamId: string;
  currentTeamId: string;
  player?: CreatePlayerDto;
};

export type CreateDraftPickWithPlayerDto = CreateDraftPickDto & {
  player: CreatePlayerDto;
};

export type UpdateDraftPickDto = Entity & Partial<CreateDraftPickDto>;

export const defaultDraftPick: Partial<CreateDraftPickDto> = {
  round: undefined,
  pickNumber: undefined,
  year: 2024,
  originalTeamId: '',
  currentTeamId: '',
};

export type DraftClass = {
  year: number;
  teamId: string;
  draftPicks: DraftPick[];
};

export type CreateDraftClassDto = {
  year: number;
  teamId: string;
  draftPicks: CreateDraftPickDto[];
};

export type UpdateDraftClassDraftPickDto = Partial<CreateDraftPickDto> & {
  id?: string;
  playerId?: string;
};

export type UpdateDraftClassDto = {
  draftPicks: UpdateDraftClassDraftPickDto[];
};
