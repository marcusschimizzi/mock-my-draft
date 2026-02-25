export class TeamDraftSummaryDto {
  readonly team: {
    readonly id: string;
    readonly name: string;
    readonly abbreviation: string;
    readonly logo: string;
    readonly colors: string[];
    readonly conference: 'afc' | 'nfc';
    readonly division: 'north' | 'south' | 'east' | 'west';
  };
  readonly draftGrades: {
    readonly id: string;
    readonly grade: string;
    readonly gradeNumeric: number;
    readonly year: number;
    readonly text: string;
    readonly sourceArticle: {
      readonly id: string;
      readonly title: string;
      readonly url: string;
      readonly source: {
        readonly id: string;
        readonly name: string;
        readonly slug: string;
      };
    };
  }[];
  readonly averageGrade: number;
}

export class DraftSummaryDto {
  readonly year: number;
  readonly teams: TeamDraftSummaryDto[];
  readonly averageGrade: number;
}
