import TeamLogo from '@/components/team-logo';
import { API_URL } from '@/config/constants';
import { getInfoFromTeamId } from '@/lib/team-utils';
import { capitalize } from '@/lib/utils';
import {
  Container,
  Flex,
  Heading,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React from 'react';

async function getData(teamId: string) {
  try {
    const res = await fetch(`${API_URL}/teams/${teamId}`);

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (e) {
    return [];
  }
}

async function getResponses(teamId: string) {
  try {
    const res = await fetch(`${API_URL}/teams/${teamId}/responses`);

    if (!res.ok) {
      throw new Error('Failed to fetch responses');
    }

    return res.json();
  } catch (e) {
    return [];
  }
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
    'a+',
    'a',
    'a-',
    'b+',
    'b',
    'b-',
    'c+',
    'c',
    'c-',
    'd+',
    'd',
    'd-',
    'f+',
    'f',
    'f-',
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
  const responses = await getResponses(params.teamId);
  let { team, average, ...letterGrades } = data;
  const sortedGrades = getSortedGrades(letterGrades);

  const highestGrade = sortedGrades[0];
  const lowestGrade = sortedGrades[sortedGrades.length - 1];

  return (
    <Container as="main" maxW="container.xl">
      {teamInfo === null && <Heading>Team not found</Heading>}
      <Flex alignItems="center">
        <TeamLogo teamAbbreviation={teamInfo.abbreviation} size={24} />
        <Heading paddingLeft={5}>{capitalize(teamInfo.fullName)}</Heading>
      </Flex>
      <StatGroup marginTop={16}>
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
      <TableContainer marginTop={16} overflowX="auto">
        <Table overflowX="auto" width="max-content">
          <Thead>
            <Tr>
              <Th>Source</Th>
              <Th>Grade</Th>
              <Th>Evaluation</Th>
            </Tr>
          </Thead>
          <Tbody>
            {responses.map((response, index) => (
              <Tr key={index}>
                <Td>{capitalize(response.source.replaceAll('-', ' '))}</Td>
                <Td>{capitalize(response.grade)}</Td>
                <Td
                  whiteSpace="normal"
                  overflowWrap="break-word"
                  minWidth="150px"
                  maxWidth="800px"
                >
                  {response.text}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}
