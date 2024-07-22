'use client';
import TeamLogo from '../components/team-logo';
import { capitalize } from '../lib/common-utils';
import {
  Badge,
  Box,
  Container,
  HStack,
  Heading,
  List,
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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import Card from '../components/card';
import { getContrastingColor, getGradeColor } from '../lib/grade-utils';

export default function Home() {
  const [year, setYear] = useState(2024);
  const { draftSummary, isLoading } = useDraftSummary(year);
  const [sources, setSources] = useState<string[]>([]);
  const [sortedTeams, setSortedTeams] = useState<TeamDraftSummary[] | null>(
    null,
  );

  useEffect(() => {
    if (!draftSummary) {
      return;
    }

    setSortedTeams(
      draftSummary.teams.sort((a, b) => b.averageGrade - a.averageGrade),
    );
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
      <Box py={8}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={draftSummary?.teams}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="team.name" />
            <YAxis
              label={{
                value: 'Average Grade',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !label) {
                  return null;
                }
                const draftSummary = payload[0].payload as TeamDraftSummary;
                const team = draftSummary.team;
                return (
                  <Box
                    bg="white"
                    p={4}
                    rounded="md"
                    borderColor={team.colors[1]}
                    borderStyle={'solid'}
                    borderWidth={3}
                  >
                    <Box>
                      <TeamLogo
                        size="medium"
                        teamAbbreviation={team.abbreviation}
                      />
                    </Box>
                    <Text fontWeight="bold">{label}</Text>
                    <Text fontWeight="bold">
                      Average: {draftSummary.averageGrade.toFixed(2)}
                    </Text>
                  </Box>
                );
              }}
            />
            <Bar dataKey="averageGrade">
              {draftSummary?.teams.map((entry: TeamDraftSummary) => {
                return <Cell key={entry.team.id} fill={entry.team.colors[0]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box py={8}>
        <HStack>
          <Card flex={1} mr={2}>
            <Heading size="md">Top performers</Heading>
            <List>
              {sortedTeams &&
                sortedTeams.slice(0, 3).map((team) => (
                  <HStack key={team.team.id}>
                    <TeamLogo
                      teamAbbreviation={team.team.abbreviation}
                      size="medium"
                      href={`/teams/${team.team.id}`}
                    />{' '}
                    <Text key={team.team.id} fontSize="1.2rem">
                      {team.team.name} -{' '}
                      <Badge
                        bg={getGradeColor(team.averageGrade)}
                        color={getContrastingColor(
                          getGradeColor(team.averageGrade),
                        )}
                      >
                        {team.averageGrade.toFixed(2)}
                      </Badge>
                    </Text>
                  </HStack>
                ))}
            </List>
          </Card>
          <Card flex={1} ml={2}>
            <Heading size="md">Bottom performers</Heading>
            <List>
              {sortedTeams &&
                sortedTeams.slice(-3).map((team) => (
                  <HStack key={team.team.id}>
                    <TeamLogo
                      teamAbbreviation={team.team.abbreviation}
                      size="medium"
                      href={`/teams/${team.team.id}`}
                    />{' '}
                    <Text key={team.team.id} fontSize="1.2rem">
                      {team.team.name} -{' '}
                      <Badge
                        bg={getGradeColor(team.averageGrade)}
                        color={getContrastingColor(
                          getGradeColor(team.averageGrade),
                        )}
                      >
                        {team.averageGrade.toFixed(2)}
                      </Badge>
                    </Text>
                  </HStack>
                ))}
            </List>
          </Card>
        </HStack>
      </Box>
      <Box py={8}>
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
