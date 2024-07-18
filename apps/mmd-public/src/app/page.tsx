'use client';
import TeamLogo from '../components/team-logo';
import { capitalize } from '../lib/common-utils';
import {
  Box,
  Container,
  HStack,
  Heading,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useDraftSummary } from '../lib/draft-summary';
import { useEffect, useState } from 'react';
import { TeamDraftSummary } from '../types';
import Card from '../components/card';

export default function Home() {
  const [year, setYear] = useState(2024);
  const { draftSummary, isLoading } = useDraftSummary(year);
  const [highestGrade, setHighestGrade] = useState<TeamDraftSummary | null>(
    null,
  );
  const [lowestGrade, setLowestGrade] = useState<TeamDraftSummary | null>(null);
  const [sources, setSources] = useState<string[]>([]);

  useEffect(() => {
    if (!draftSummary) {
      return;
    }

    const maxGrade = draftSummary.teams.reduce((acc, team) => {
      if (team.averageGrade > acc.averageGrade) {
        return team;
      }
      return acc;
    });

    const minGrade = draftSummary.teams.reduce((acc, team) => {
      if (team.averageGrade < acc.averageGrade) {
        return team;
      }
      return acc;
    });

    setHighestGrade(maxGrade);
    setLowestGrade(minGrade);
  }, [draftSummary]);

  useEffect(() => {
    if (!draftSummary) {
      return;
    }

    const sources = draftSummary.teams.reduce((acc: string[], team) => {
      const teamSources = team.draftGrades.map(
        (grade) => grade.sourceArticle.source.name,
      );
      return [...acc, ...teamSources];
    }, []);

    setSources([...new Set(sources)]);
  }, [draftSummary]);

  if (!draftSummary && !isLoading) {
    return (
      <Container as="main" maxW="container.xl" minH="80vh">
        <Heading>Couldn&apos;t get any data</Heading>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container as="main" maxW="container.xl" minH="80vh">
        <Heading>Loading...</Heading>
      </Container>
    );
  }

  return (
    <Container as="main" maxW="container.xl">
      <Heading>2024 NFL Draft Class Grades</Heading>
      <Box py={16}>
        <StatGroup pb={16}>
          {highestGrade && (
            <Card flex={1} mr={2}>
              <Stat>
                <StatNumber>
                  <TeamLogo
                    teamAbbreviation={highestGrade.team.abbreviation}
                    size="large"
                    href={`/teams/${highestGrade.team.id}`}
                  />
                  {highestGrade.averageGrade.toFixed(2)}{' '}
                </StatNumber>
                <StatLabel>Highest grade</StatLabel>
              </Stat>
            </Card>
          )}
          {lowestGrade && (
            <Card flex={1} ml={2}>
              <Stat>
                <StatNumber>
                  <TeamLogo
                    teamAbbreviation={lowestGrade.team.abbreviation}
                    size="large"
                    href={`/teams/${lowestGrade.team.id}`}
                  />
                  {lowestGrade.averageGrade.toFixed(2)}{' '}
                </StatNumber>
                <StatLabel>Lowest grade</StatLabel>
              </Stat>
            </Card>
          )}
        </StatGroup>
        <Card>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Team</Th>
                  {sources.map((source) => (
                    <Th key={source}>{capitalize(source)}</Th>
                  ))}
                  <Th>Average</Th>
                </Tr>
              </Thead>
              <Tbody>
                {draftSummary?.teams.map((entry: TeamDraftSummary) => {
                  return (
                    <Tr key={entry.team.id}>
                      <Td>
                        <HStack>
                          <TeamLogo
                            teamAbbreviation={entry.team.abbreviation}
                            size="medium"
                            href={`/teams/${entry.team.id}`}
                          />
                          <Text marginLeft={5}>{entry.team.name}</Text>
                        </HStack>
                      </Td>
                      {entry.draftGrades.map((grade) => {
                        return (
                          <Td key={grade.id}>
                            <Text>{grade.grade}</Text>
                          </Td>
                        );
                      })}
                      <Td>{entry.averageGrade.toFixed(2)}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Container>
  );
}
