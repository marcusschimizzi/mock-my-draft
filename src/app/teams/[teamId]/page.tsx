import { getInfoFromTeamId } from "@/lib/team-utils";
import { capitalize } from "@/lib/utils";
import {
  Container,
  Heading,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import React from "react";

async function getData(teamId: string) {
  const res = await fetch(`http://localhost:3000/api/teams/${teamId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

interface GradesMap {
  [source: string]: string;
}

interface Grade {
  source: string;
  letterGrade: string;
}

function getSortedGrades(grades: GradesMap) {
  const gradeOrder = [
    "a+",
    "a",
    "a-",
    "b+",
    "b",
    "b-",
    "c+",
    "c",
    "c-",
    "d+",
    "d",
    "d-",
    "f+",
    "f",
    "f-",
  ];

  let sortedGrades: Grade[] = [];
  for (const grade in grades) {
    sortedGrades.push({
      source: grade,
      letterGrade: grades[grade],
    });
  }
  return sortedGrades.sort((a, b) => {
    return (
      gradeOrder.indexOf(a.letterGrade) - gradeOrder.indexOf(b.letterGrade)
    );
  });
}

export default async function TeamPage({
  params,
}: {
  params: { teamId: string };
}) {
  const teamInfo = getInfoFromTeamId(params.teamId);
  const data = await getData(params.teamId);
  let { team, average, ...letterGrades } = data;
  const sortedGrades = getSortedGrades(letterGrades);

  const highestGrade = sortedGrades[0];
  const lowestGrade = sortedGrades[sortedGrades.length - 1];

  return (
    <Container as="main" maxW="container.xl">
      {teamInfo === null && <Heading>Team not found</Heading>}
      <Heading>{capitalize(teamInfo.fullName)}</Heading>
      <StatGroup>
        <Stat>
          <StatLabel>Average grade</StatLabel>
          <StatNumber>{Number(average).toFixed(2)}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Highest grade</StatLabel>
          <StatNumber>{capitalize(highestGrade.letterGrade)}</StatNumber>
          <StatHelpText>Source: {highestGrade.source}</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Lowest grade</StatLabel>
          <StatNumber>{capitalize(lowestGrade.letterGrade)}</StatNumber>
          <StatHelpText>Source: {lowestGrade.source}</StatHelpText>
        </Stat>
      </StatGroup>
    </Container>
  );
}
