import { getInfoFromTeamId } from '@/lib/team-utils';
import { readFile } from 'fs/promises';

const GRADES_FILE = '2024-draft-class-grades.tsv';

interface Grade {
  type: 'class' | 'individual';
  source: string;
  grade: string;
  team: string;
  text?: string;
}

async function readInFile(): Promise<Grade[] | null> {
  try {
    const filePath = new URL(
      `../../../../../data/${GRADES_FILE}`,
      import.meta.url
    );
    const contents = await readFile(filePath, { encoding: 'utf-8' });
    const lines = contents.split('\n');
    const data = [];
    const keys = lines[0].split('\t');
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('\t');
      const item = {};
      for (let j = 0; j < values.length; j++) {
        item[keys[j].trim()] = values[j].trim();
      }
      data.push(item);
    }
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  const grades = await readInFile();
  if (!grades) {
    return new Response('', {
      status: 500,
    });
  }
  const teamAbbreviation = getInfoFromTeamId(params.teamId).abbreviation;
  if (!teamAbbreviation) {
    return new Response('', {
      status: 400,
    });
  }
  const teamResponses = grades
    .filter((grade) => grade.team === teamAbbreviation)
    .map((grade) => {
      return {
        text: grade.text,
        source: grade.source,
        grade: grade.grade,
      };
    });
  if (!teamResponses) {
    return new Response('', {
      status: 404,
    });
  }
  return new Response(JSON.stringify(teamResponses, null, 2), {
    status: 200,
  });
}
