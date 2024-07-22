export interface Team {
  id: string;
  name: string;
  abbreviation: string;
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
