import { readFileSync } from 'fs';

const GRADES_FILE = '2024-draft-class-grades.tsv';

export interface Grade {
  type: 'class' | 'individual';
  source: string;
  grade: string;
  team: string;
  text?: string;
}
type GradeKey = keyof Grade;

export function readInFile(): Grade[] | null {
  try {
    const filePath = `./data/${GRADES_FILE}`;
    const contents = readFileSync(filePath, { encoding: 'utf-8' });
    const lines = contents.split('\n');
    const data: Grade[] = [];
    const keys = lines[0].split('\t');
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('\t');
      const item: Partial<Grade> = {};
      for (let j = 0; j < values.length; j++) {
        const key = keys[j].trim() as GradeKey;
        item[key] = values[j].trim() as any;
      }
      data.push(item as Grade);
    }
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}
