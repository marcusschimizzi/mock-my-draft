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
};

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
};

export type CreateDraftPickDto = {
  round: number;
  pickNumber: number;
  year: number;
  originalTeamId: string;
  currentTeamId: string;
};

export type UpdateDraftPickDto = Entity & Partial<CreateDraftPickDto>;

export const defaultDraftPick: Partial<CreateDraftPickDto> = {
  round: undefined,
  pickNumber: undefined,
  year: 2024,
  originalTeamId: '',
  currentTeamId: '',
};
