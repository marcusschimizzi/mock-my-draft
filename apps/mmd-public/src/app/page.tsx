'use client';
import TeamLogo from '../components/team-logo';
import { capitalize } from '../lib/common-utils';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Container,
  HStack,
  Heading,
  List,
  ListItem,
  Select,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useDraftSummary, useYears } from '../lib/draft-summary';
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
import { boxShadow } from '../utils/style-utils';
import { Loading } from '../components/loading';

interface GradeRange {
  team: Team;
  range: [number, number];
}

export default function Home() {
  const [year, setYear] = useState(2024);
  const { draftSummary, isLoading } = useDraftSummary(year);
  const { years, isLoading: isYearsLoading } = useYears();
  const [sources, setSources] = useState<string[]>([]);
  const [sortedTeams, setSortedTeams] = useState<TeamDraftSummary[] | null>(
    null,
  );
  const [gradeRanges, setGradeRanges] = useState<GradeRange[] | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

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

  useEffect(() => {
    if (!years || !years.length) {
      return;
    }
    setYear(years[0]);
  }, [years]);

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
        <Loading />
      </Container>
    );
  }

  return (
    <Container as="main" maxW="container.xl" my={8}>
      <Heading w="full" display="flex" justifyContent="space-between">
        <Text>NFL Draft Class Grades</Text>
        <Select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          w={32}
          display={'inline-block'}
        >
          {years?.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </Heading>
      <Card mt={8} py={4}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={draftSummary?.teams}
            margin={
              isMobile
                ? {
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 20,
                  }
                : { top: 5, right: 30, left: 20, bottom: 5 }
            }
            layout={isMobile ? 'vertical' : 'horizontal'}
          >
            {isMobile ? (
              <>
                <XAxis
                  label={{
                    value: 'Average Grade',
                    position: 'bottom',
                  }}
                  domain={[0, 4.3]}
                  type="number"
                />
                <YAxis dataKey="team.abbreviation" type="category" />
              </>
            ) : (
              <>
                <XAxis dataKey="team.abbreviation" />
                <YAxis
                  label={{
                    value: 'Average Grade',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                  domain={[0, 4.3]}
                />
              </>
            )}
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !label) {
                  return null;
                }
                const draftSummary = payload[0].payload as TeamDraftSummary;
                const team = draftSummary.team;
                return (
                  <Box
                    bg="elevations.light.base"
                    _dark={{
                      bg: 'elevations.dark.base',
                    }}
                    p={4}
                    rounded="md"
                    borderColor={team.colors[1]}
                    borderStyle={'solid'}
                    borderWidth={3}
                    boxShadow={boxShadow(2)}
                  >
                    <Box>
                      <TeamLogo
                        size="medium"
                        teamAbbreviation={team.abbreviation}
                      />
                    </Box>
                    <Text fontWeight="bold">{team.name}</Text>
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
      </Card>
      <Box mt={8} py={4}>
        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
          }}
          columnGap={4}
          rowGap={4}
        >
          <Card flex={1} py={4} px={8}>
            <Heading size="md">Top performers</Heading>
            <List>
              {sortedTeams &&
                sortedTeams.slice(0, 3).map((team, index) => (
                  <HStack
                    key={team.team.id}
                    w="full"
                    justifyContent="space-between"
                    mt={4}
                  >
                    <HStack>
                      <TeamLogo
                        teamAbbreviation={team.team.abbreviation}
                        size="medium"
                        href={`/teams/${team.team.id}`}
                      />{' '}
                      <Text key={team.team.id} fontSize="1.2rem">
                        {team.team.name}
                      </Text>
                    </HStack>
                    <Badge
                      bg={getGradeColor(team.averageGrade)}
                      color={getContrastingColor(
                        getGradeColor(team.averageGrade),
                      )}
                      fontSize="1.1rem"
                    >
                      {team?.averageGrade?.toFixed(2) ?? 'N/A'}
                    </Badge>
                  </HStack>
                ))}
            </List>
          </Card>
          <Card flex={1}>
            <Heading size="md">Bottom performers</Heading>
            <List>
              {sortedTeams &&
                sortedTeams.slice(-3).map((team) => (
                  <HStack
                    key={team.team.id}
                    w="full"
                    justifyContent="space-between"
                    mt={4}
                  >
                    <HStack>
                      <TeamLogo
                        teamAbbreviation={team.team.abbreviation}
                        size="medium"
                        href={`/teams/${team.team.id}`}
                      />{' '}
                      <Text key={team.team.id} fontSize="1.2rem">
                        {team.team.name}
                      </Text>
                    </HStack>
                    <Badge
                      bg={getGradeColor(team.averageGrade)}
                      color={getContrastingColor(
                        getGradeColor(team.averageGrade),
                      )}
                      fontSize="1.1rem"
                    >
                      {team?.averageGrade?.toFixed(2) ?? 'N/A'}
                    </Badge>
                  </HStack>
                ))}
            </List>
          </Card>
        </SimpleGrid>
      </Box>
      {gradeRanges && (
        <Card py={4} mt={8}>
          <Box mb={4} w="full" textAlign="center">
            <Heading size="md">Grade ranges</Heading>
          </Box>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={gradeRanges}
              layout={isMobile ? 'vertical' : 'horizontal'}
              margin={
                isMobile
                  ? { top: 5, right: 5, left: 5, bottom: 20 }
                  : {
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }
              }
            >
              {isMobile ? (
                <>
                  <XAxis
                    label={{
                      value: 'Grade Range',
                      position: 'bottom',
                    }}
                    domain={[0, 4.3]}
                    type="number"
                    tick={(props) => {
                      return (
                        <g transform={`translate(${props.x},${props.y})`}>
                          <text
                            x={0}
                            y={0}
                            dy={2}
                            textAnchor="middle"
                            alignmentBaseline="hanging"
                            fill="#666"
                          >
                            {gradeToLetter(props.payload.value)}
                          </text>
                        </g>
                      );
                    }}
                  />
                  <YAxis
                    dataKey="team.abbreviation"
                    type="category"
                    width={40}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey="team.abbreviation"
                    height={40}
                    tick={({ x, y, payload }) => {
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text
                            x={0}
                            y={0}
                            dy={16}
                            textAnchor="middle"
                            fill="#666"
                          >
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
                </>
              )}
              <Tooltip
                content={({ payload }) => {
                  if (!payload || !payload.length || !payload[0].payload) {
                    return null;
                  }
                  const gradeRange = payload[0].payload as GradeRange;
                  const team = gradeRange.team;
                  return (
                    <Box
                      bg="elevations.light.base"
                      _dark={{
                        bg: 'elevations.dark.base',
                      }}
                      p={4}
                      boxShadow={boxShadow(2)}
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
              <Bar dataKey="range">
                {gradeRanges?.map((entry: GradeRange) => {
                  return (
                    <Cell
                      key={entry.team.id}
                      fill={entry.team.colors[0]}
                      strokeWidth={1}
                      stroke={entry.team.colors[0]}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
      {!isMobile ? (
        <Card py={4} mt={8}>
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
                            <Badge
                              bg={getGradeColor(grade.grade)}
                              color={getContrastingColor(
                                getGradeColor(grade.grade),
                              )}
                              fontSize="1.1rem"
                              py={1}
                              px={2}
                            >
                              {grade.grade}
                            </Badge>
                          </Td>
                        );
                      })}
                      <Td>
                        <Badge
                          bg={getGradeColor(entry.averageGrade)}
                          color={getContrastingColor(
                            getGradeColor(entry.averageGrade),
                          )}
                          fontSize="1.1rem"
                          py={1}
                          px={2}
                        >
                          {entry?.averageGrade?.toFixed(2) ?? 'N/A'}
                        </Badge>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <Card py={4} my={8}>
          <Accordion allowToggle>
            {draftSummary?.teams.map((entry: TeamDraftSummary) => {
              return (
                <AccordionItem key={entry.team.id}>
                  <Heading borderBottom="1px solid" borderColor="gray.100">
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        <HStack>
                          <TeamLogo
                            teamAbbreviation={entry.team.abbreviation}
                            size="medium"
                            href={`/teams/${entry.team.id}`}
                          />
                          <Text marginLeft={5}>{entry.team.name}</Text>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Heading>
                  <AccordionPanel pb={4}>
                    <List>
                      {entry.draftGrades
                        .sort((a, b) =>
                          a.sourceArticle.source.name >
                          b.sourceArticle.source.name
                            ? 1
                            : -1,
                        )
                        .map((grade) => {
                          return (
                            <ListItem
                              key={grade.id}
                              my={3}
                              w="full"
                              display="flex"
                              justifyContent="space-between"
                            >
                              <Text as="span">
                                {capitalize(grade.sourceArticle.source.name)}
                              </Text>
                              <Badge
                                bg={getGradeColor(grade.grade)}
                                color={getContrastingColor(
                                  getGradeColor(grade.grade),
                                )}
                                fontSize="1.1rem"
                                py={1}
                                px={2}
                                mr={2}
                              >
                                {grade.grade}
                              </Badge>
                            </ListItem>
                          );
                        })}
                    </List>
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Card>
      )}
    </Container>
  );
}
