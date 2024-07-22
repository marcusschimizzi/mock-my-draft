'use client';
import TeamLogo from '../../../components/team-logo';
import { capitalize } from '../../../lib/common-utils';
import {
  Box,
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
  Text,
  Badge,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTeamDraftSummary } from '../../../lib/draft-summary';
import { DraftGrade } from '../../../types';
import Card from '../../../components/card';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getContrastingColor, getGradeColor } from '../../../lib/grade-utils';

interface GradeCount {
  grade: string;
  count: number;
}

export default function TeamPage({ params }: { params: { teamId: string } }) {
  const { draftSummary, isLoading } = useTeamDraftSummary(2024, params.teamId);
  const [sortedGrades, setSortedGrades] = useState<DraftGrade[] | null>(null);
  const [gradeCounts, setGradeCounts] = useState<GradeCount[] | null>(null);

  useEffect(() => {
    if (!draftSummary) {
      return;
    }

    setSortedGrades(
      draftSummary.draftGrades
        .sort((a, b) => b.gradeNumeric - a.gradeNumeric)
        .map((grade) => ({
          ...grade,
          grade: grade.grade.toUpperCase(),
        })),
    );

    const counts: GradeCount[] = [];
    for (const grade of draftSummary.draftGrades.map((g) => ({
      ...g,
      grade: g.grade.toUpperCase(),
    }))) {
      const existingGrade = counts.find((g) => g.grade === grade.grade);
      if (existingGrade) {
        existingGrade.count++;
      } else {
        counts.push({ grade: grade.grade, count: 1 });
      }
    }
    setGradeCounts(counts);
  }, [draftSummary]);

  if (!draftSummary && !isLoading) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container as="main" maxW="container.xl">
      {!draftSummary ? (
        <Heading>Team not found</Heading>
      ) : (
        <>
          <Flex alignItems="center">
            <TeamLogo
              teamAbbreviation={draftSummary.team.abbreviation}
              size="medium"
            />
            <Heading paddingLeft={5}>
              {capitalize(draftSummary.team.name)}
            </Heading>
          </Flex>
          <StatGroup marginTop={16} mb={16}>
            <Card flex={1} h={36} mr={2}>
              <Stat>
                <StatLabel>Average grade</StatLabel>
                <StatNumber>{draftSummary?.averageGrade.toFixed(2)}</StatNumber>
              </Stat>
            </Card>
            {sortedGrades && (
              <Card flex={1} h={36} mx={2}>
                <Stat>
                  <StatLabel>Highest grade</StatLabel>
                  <StatNumber>{capitalize(sortedGrades[0].grade)}</StatNumber>
                  <StatHelpText>
                    Source: {sortedGrades[0].sourceArticle.source.name}
                  </StatHelpText>
                </Stat>
              </Card>
            )}
            {sortedGrades && (
              <Card flex={1} h={36} ml={2}>
                <Stat>
                  <StatLabel>Lowest grade</StatLabel>
                  <StatNumber>
                    {capitalize(sortedGrades[sortedGrades.length - 1].grade)}
                  </StatNumber>
                  <StatHelpText>
                    Source:{' '}
                    {
                      sortedGrades[sortedGrades.length - 1].sourceArticle.source
                        .name
                    }
                  </StatHelpText>
                </Stat>
              </Card>
            )}
          </StatGroup>
          {gradeCounts && (
            <Card mb={16}>
              <Heading size="md">Grade distribution</Heading>
              <Box>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeCounts}>
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !label) {
                          return null;
                        }

                        const grade = payload[0].payload as GradeCount;
                        const sources = draftSummary.draftGrades.filter(
                          (g) =>
                            g.grade.toUpperCase() === grade.grade.toUpperCase(),
                        );
                        return (
                          <Box
                            bg="white"
                            p={4}
                            rounded="md"
                            borderColor={getGradeColor(grade.grade)}
                            borderStyle={'solid'}
                            borderWidth={3}
                          >
                            <Text fontWeight="bold">{grade.grade}</Text>
                            <Text fontWeight="bold">Count: {grade.count}</Text>
                            <Text fontWeight="bold">
                              Sources:{' '}
                              {sources
                                .map((s) =>
                                  capitalize(s.sourceArticle.source.name),
                                )
                                .join(', ')}
                            </Text>
                          </Box>
                        );
                      }}
                    />
                    <Bar dataKey="count">
                      {gradeCounts.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getGradeColor(entry.grade)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          )}
          <Card mb={16}>
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
                  {draftSummary.draftGrades.map(
                    (response: DraftGrade, index: number) => (
                      <Tr key={index}>
                        <Td>
                          {capitalize(response.sourceArticle.source.name)}
                        </Td>
                        <Td>
                          <Badge
                            bg={getGradeColor(response.grade)}
                            color={getContrastingColor(
                              getGradeColor(response.grade),
                            )}
                            fontSize={'1.2rem'}
                            padding={2}
                          >
                            {capitalize(response.grade)}
                          </Badge>
                        </Td>
                        <Td
                          whiteSpace="normal"
                          overflowWrap="break-word"
                          minWidth="150px"
                          maxWidth="800px"
                        >
                          {response.text}
                        </Td>
                      </Tr>
                    ),
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}
    </Container>
  );
}
