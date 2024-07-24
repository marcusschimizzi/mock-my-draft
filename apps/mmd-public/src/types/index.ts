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

export interface Team {
  id: string;
  name: string;
  location: string;
  nickname: string;
  conference: Conference;
  division: Division;
  abbreviation: string;
  slug: string;
  logo: string;
  colors: string[];
}

export interface TeamDraftSummary {
  team: Team;
  draftGrades: DraftGrade[];
  averageGrade: number;
}

export interface DraftSummary {
  year: number;
  teams: TeamDraftSummary[];
  averageGrade: number;
}

export interface DraftGrade {
  id: string;
  grade: string;
  gradeNumeric: number;
  year: number;
  text: string;
  sourceArticle: {
    id: string;
    title: string;
    url: string;
    source: {
      id: string;
      name: string;
      slug: string;
    };
  };
}
