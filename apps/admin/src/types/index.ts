export type Entity = {
  id: string;
  createdAt: string;
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

export type Source = Entity & {
  name: string;
  slug: string;
  baseUrl: string;
};

export const defaultSource: Partial<Source> = {
  name: '',
  slug: '',
  baseUrl: '',
};

export type DraftGradeTeam = Pick<Team, 'id' | 'name' | 'abbreviation'>;
export type DraftGradeSource = Pick<Source, 'id' | 'name' | 'slug'>;

export type DraftGrade = Entity & {
  id: string;
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
