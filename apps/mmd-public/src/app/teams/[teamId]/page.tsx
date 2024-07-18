'use client';
import TeamLogo from '../../../components/team-logo';
import { capitalize } from '../../../lib/common-utils';
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
import { useEffect, useState } from 'react';
import { useTeamDraftSummary } from '../../../lib/draft-summary';
import { DraftGrade } from '../../../types';
import Card from '../../../components/card';

export default function TeamPage({ params }: { params: { teamId: string } }) {
  const { draftSummary, isLoading } = useTeamDraftSummary(2024, params.teamId);
  const [highestGrade, setHighestGrade] = useState<DraftGrade | null>(null);
  const [lowestGrade, setLowestGrade] = useState<DraftGrade | null>(null);

  useEffect(() => {
    if (!draftSummary) {
      return;
    }

    setHighestGrade(
      draftSummary.draftGrades.reduce((acc: DraftGrade, grade) => {
        if (grade.gradeNumeric > acc.gradeNumeric) {
          return grade;
        }
        return acc;
      }),
    );

    setLowestGrade(
      draftSummary.draftGrades.reduce((acc: DraftGrade, grade) => {
        if (grade.gradeNumeric < acc.gradeNumeric) {
          return grade;
        }
        return acc;
      }),
    );
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
            {highestGrade && (
              <Card flex={1} h={36} mx={2}>
                <Stat>
                  <StatLabel>Highest grade</StatLabel>
                  <StatNumber>{capitalize(highestGrade.grade)}</StatNumber>
                  <StatHelpText>
                    Source: {highestGrade.sourceArticle.source.name}
                  </StatHelpText>
                </Stat>
              </Card>
            )}
            {lowestGrade && (
              <Card flex={1} h={36} ml={2}>
                <Stat>
                  <StatLabel>Lowest grade</StatLabel>
                  <StatNumber>{capitalize(lowestGrade.grade)}</StatNumber>
                  <StatHelpText>
                    Source: {lowestGrade.sourceArticle.source.name}
                  </StatHelpText>
                </Stat>
              </Card>
            )}
          </StatGroup>
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
