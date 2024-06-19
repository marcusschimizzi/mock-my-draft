import { readFile } from "fs/promises";

const GRADES_FILE = "2024-draft-class-grades.tsv";

interface Grade {
  type: "class" | "individual";
  source: string;
  grade: string;
  team: string;
  text?: string;
}

interface TeamGrades {
  team: string;
  [key: string]: string;
}

async function readInFile(): Promise<Grade[] | null> {
  try {
    const filePath = new URL(`../../data/${GRADES_FILE}`, import.meta.url);
    const contents = await readFile(filePath, { encoding: "utf-8" });
    const lines = contents.split("\n");
    const data = [];
    const keys = lines[0].split("\t");
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split("\t");
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

function convertLetterGradeToNumber(letterGrade: string) {
  const conversionChart = {
    "a+": 4.0,
    a: 4.0,
    "a-": 3.7,
    "b+": 3.3,
    b: 3.0,
    "b-": 2.7,
    "c+": 2.3,
    c: 2.0,
    "c-": 1.7,
    "d+": 1.3,
    d: 1.0,
    "d-": 0.7,
    "f+": 0.3,
    f: 0.0,
  };
  if (letterGrade.toLowerCase() in conversionChart) {
    return conversionChart[letterGrade.toLowerCase()];
  }
  console.error(`${letterGrade} is not actually a valid grade!`);
  return 0.0;
}

function computeCumulativeGrade(teamGrades: TeamGrades) {
  let sources = 0;
  let total = 0;
  for (let source in teamGrades) {
    if (source !== "team") {
      total += convertLetterGradeToNumber(teamGrades[source]);
      sources += 1;
    }
  }
  if (!sources) {
    return 0;
  }
  return total / sources;
}

function computeAverages(grades: Grade[]) {
  const teamGrades = {};
  for (let grade of grades) {
    if (grade.team in teamGrades) {
      teamGrades[grade.team][grade.source] = grade.grade;
    } else {
      teamGrades[grade.team] = {
        [grade.source]: grade.grade,
        team: grade.team,
      };
    }
  }
  const teamGradesArray = Object.values(teamGrades);
  for (let grade of teamGradesArray) {
    grade["average"] = computeCumulativeGrade(grade as TeamGrades);
  }
  return teamGradesArray;
}

export async function GET(request: Request) {
  const grades = await readInFile();
  if (!grades) {
    return new Response("", {
      status: 500,
    });
  }
  return new Response(JSON.stringify(computeAverages(grades), null, 2), {
    status: 200,
  });
}
