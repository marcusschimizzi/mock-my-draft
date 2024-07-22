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
import { TeamDraftSummary, Team } from '../types';
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
import {
  getContrastingColor,
  getGradeColor,
  gradeToLetter,
} from '../lib/grade-utils';

interface GradeRange {
  team: Team;
  range: [number, number];
}

export default function Home() {
  const [year, setYear] = useState(2024);
  const { draftSummary, isLoading } = useDraftSummary(year);
  const [sources, setSources] = useState<string[]>([]);
  const [sortedTeams, setSortedTeams] = useState<TeamDraftSummary[] | null>(
    null,
  );
  const [gradeRanges, setGradeRanges] = useState<GradeRange[] | null>(null);

  useEffect(() => {
    if (!draftSummary) {
      return;
    }

    setSortedTeams(
      draftSummary.teams.sort((a, b) => b.averageGrade - a.averageGrade),
    );

    const gradeRanges: GradeRange[] = [];
    draftSummary.teams.forEach((team) => {
      const min = Math.min(
        ...team.draftGrades.map((grade) => grade.gradeNumeric),
      );
      const max = Math.max(
        ...team.draftGrades.map((grade) => grade.gradeNumeric),
      );
      gradeRanges.push({
        team: team.team,
        range: [min, max],
      });
    });

    setGradeRanges(gradeRanges);
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
      {gradeRanges && (
        <Card py={8}>
          <Heading size="md">Grade ranges</Heading>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={gradeRanges}>
              <XAxis
                dataKey="team.abbreviation"
                height={40}
                tick={({ x, y, payload }) => {
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
                        {payload.value}
                      </text>
                    </g>
                  );
                }}
              />
              <YAxis
                label={{
                  value: 'Grade Range',
                  angle: -90,
                  position: 'insideLeft',
                }}
                domain={[0, 4.3]}
                tick={(props) => {
                  console.info('props', props);
                  return (
                    <g transform={`translate(${props.x},${props.y})`}>
                      <text
                        x={0}
                        y={0}
                        textAnchor="end"
                        alignmentBaseline="middle"
                        fill="#666"
                      >
                        {gradeToLetter(props.payload.value)}
                      </text>
                    </g>
                  );
                }}
                tickCount={3}
              />
              <Tooltip
                content={({ payload }) => {
                  if (!payload || !payload.length) {
                    return null;
                  }
                  const gradeRange = payload[0].payload as GradeRange;
                  const team = gradeRange.team;
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
                      <Text fontWeight="bold">{team.name}</Text>
                      <Text fontWeight="bold">
                        <Badge
                          bg={getGradeColor(gradeRange.range[0])}
                          color={getContrastingColor(
                            getGradeColor(gradeRange.range[0]),
                          )}
                          mr={2}
                          p={1}
                          fontSize={'0.9rem'}
                        >
                          {gradeToLetter(gradeRange.range[0])}
                        </Badge>
                        to
                        <Badge
                          ml={2}
                          p={1}
                          fontSize={'0.9rem'}
                          bg={getGradeColor(gradeRange.range[1])}
                          color={getContrastingColor(
                            getGradeColor(gradeRange.range[1]),
                          )}
                        >
                          {gradeToLetter(gradeRange.range[1])}
                        </Badge>
                      </Text>
                    </Box>
                  );
                }}
              />
              <Bar dataKey="range" fill="#8884d8">
                {gradeRanges?.map((entry: GradeRange) => {
                  return (
                    <Cell key={entry.team.id} fill={entry.team.colors[0]} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
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
