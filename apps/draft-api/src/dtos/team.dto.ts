export class TeamResponseDto {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  colors?: string[];
  conference: string;
  division: string;
}

export class BulkCreateTeamResponseDto {
  message: string;
  successfulTeams: TeamResponseDto[];
  failedTeams: {
    index: number;
    error: string;
  }[];
}
