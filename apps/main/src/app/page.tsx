import Chart from '@/components/chart';
import TeamLogo from '@/components/team-logo';
import { API_URL } from '@/config/constants';
import { getInfoFromTeamAbbreviation } from '@/lib/team-utils';
import { capitalize } from '@/lib/utils';
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
import React from 'react';

async function getData() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (e) {
    return [
      {
        pff: 'b+',
        team: 'ari',
        'fox-sports': 'a',
        'yahoo-sports': 'b+',
        'pro-football-network': 'a',
        nfl: 'a-',
        'the-sporting-news': 'b',
        average: 3.5500000000000003,
      },
      {
        pff: 'c-',
        team: 'atl',
        'fox-sports': 'c-',
        'yahoo-sports': 'd-',
        'pro-football-network': 'd',
        nfl: 'c+',
        'the-sporting-news': 'c-',
        average: 1.5166666666666666,
      },
      {
        pff: 'a-',
        team: 'bal',
        'fox-sports': 'b',
        'yahoo-sports': 'b+',
        'pro-football-network': 'a-',
        nfl: 'a-',
        'the-sporting-news': 'a',
        average: 3.5666666666666664,
      },
      {
        pff: 'b-',
        team: 'buf',
        'fox-sports': 'b-',
        'yahoo-sports': 'c+',
        'pro-football-network': 'b+',
        nfl: 'b+',
        'the-sporting-news': 'b',
        average: 2.8833333333333333,
      },
      {
        pff: 'c',
        team: 'car',
        'fox-sports': 'b-',
        'yahoo-sports': 'c',
        'pro-football-network': 'b',
        nfl: 'b',
        'the-sporting-news': 'c',
        average: 2.4499999999999997,
      },
      {
        pff: 'b+',
        team: 'cin',
        'fox-sports': 'a',
        'yahoo-sports': 'b+',
        'pro-football-network': 'b',
        nfl: 'b-',
        'the-sporting-news': 'a',
        average: 3.3833333333333333,
      },
      {
        pff: 'a',
        team: 'chi',
        'fox-sports': 'a-',
        'yahoo-sports': 'a',
        'pro-football-network': 'a+',
        nfl: 'a-',
        'the-sporting-news': 'a-',
        average: 3.8499999999999996,
      },
      {
        pff: 'c+',
        team: 'cle',
        'fox-sports': 'c',
        'yahoo-sports': 'b',
        'pro-football-network': 'b',
        nfl: 'c+',
        'the-sporting-news': 'c',
        average: 2.4333333333333336,
      },
      {
        pff: 'a-',
        team: 'den',
        'fox-sports': 'b-',
        'yahoo-sports': 'd',
        'pro-football-network': 'b+',
        nfl: 'b-',
        'the-sporting-news': 'a-',
        average: 2.8499999999999996,
      },
      {
        pff: 'b-',
        team: 'dal',
        'fox-sports': 'b',
        'yahoo-sports': 'c+',
        'pro-football-network': 'b+',
        nfl: 'a-',
        'the-sporting-news': 'c',
        average: 2.8333333333333335,
      },
      {
        pff: 'a',
        team: 'det',
        'fox-sports': 'b+',
        'yahoo-sports': 'b',
        'pro-football-network': 'b+',
        nfl: 'b',
        'the-sporting-news': 'a',
        average: 3.4333333333333336,
      },
      {
        pff: 'b+',
        team: 'gb',
        'fox-sports': 'b',
        'yahoo-sports': 'b',
        'pro-football-network': 'b-',
        nfl: 'b',
        'the-sporting-news': 'b',
        average: 3,
      },
      {
        pff: 'b+',
        team: 'hou',
        'fox-sports': 'a-',
        'yahoo-sports': 'b',
        'pro-football-network': 'b-',
        nfl: 'a-',
        'the-sporting-news': 'b',
        average: 3.233333333333333,
      },
      {
        pff: 'a+',
        team: 'ind',
        'fox-sports': 'c+',
        'yahoo-sports': 'b+',
        'pro-football-network': 'a',
        nfl: 'b+',
        'the-sporting-news': 'b-',
        average: 3.266666666666666,
      },
      {
        pff: 'b',
        team: 'jax',
        'fox-sports': 'a-',
        'yahoo-sports': 'c',
        'pro-football-network': 'b',
        nfl: 'a-',
        'the-sporting-news': 'c-',
        average: 2.8499999999999996,
      },
      {
        pff: 'b+',
        team: 'kc',
        'fox-sports': 'a-',
        'yahoo-sports': 'a',
        'pro-football-network': 'a',
        nfl: 'a',
        'the-sporting-news': 'a-',
        average: 3.783333333333333,
      },
      {
        pff: 'b+',
        team: 'lv',
        'fox-sports': 'b-',
        'yahoo-sports': 'b',
        'pro-football-network': 'a',
        nfl: 'b-',
        'the-sporting-news': 'd',
        average: 2.783333333333333,
      },
      {
        pff: 'a',
        team: 'lac',
        'fox-sports': 'a-',
        'yahoo-sports': 'b+',
        'pro-football-network': 'a',
        nfl: 'a-',
        'the-sporting-news': 'a',
        average: 3.783333333333333,
      },
      {
        pff: 'b+',
        team: 'lar',
        'fox-sports': 'b',
        'yahoo-sports': 'b-',
        'pro-football-network': 'a',
        nfl: 'a-',
        'the-sporting-news': 'a-',
        average: 3.4,
      },
      {
        pff: 'b-',
        team: 'mia',
        'fox-sports': 'a-',
        'yahoo-sports': 'b+',
        'pro-football-network': 'b-',
        nfl: 'b-',
        'the-sporting-news': 'c',
        average: 2.8499999999999996,
      },
      {
        pff: 'b+',
        team: 'min',
        'fox-sports': 'a',
        'yahoo-sports': 'c+',
        'pro-football-network': 'a-',
        nfl: 'b+',
        'the-sporting-news': 'a',
        average: 3.4333333333333336,
      },
      {
        pff: 'b+',
        team: 'ne',
        'fox-sports': 'b+',
        'yahoo-sports': 'a-',
        'pro-football-network': 'b+',
        nfl: 'b',
        'the-sporting-news': 'a-',
        average: 3.3833333333333333,
      },
      {
        pff: 'a+',
        team: 'no',
        'fox-sports': 'b',
        'yahoo-sports': 'b-',
        'pro-football-network': 'b+',
        nfl: 'a-',
        'the-sporting-news': 'b',
        average: 3.283333333333333,
      },
      {
        pff: 'a-',
        team: 'nyg',
        'fox-sports': 'b+',
        'yahoo-sports': 'b+',
        'pro-football-network': 'b+',
        nfl: 'b+',
        'the-sporting-news': 'b-',
        average: 3.266666666666667,
      },
      {
        pff: 'a',
        team: 'nyj',
        'fox-sports': 'b',
        'yahoo-sports': 'b-',
        'pro-football-network': 'a-',
        nfl: 'b+',
        'the-sporting-news': 'b+',
        average: 3.3333333333333335,
      },
      {
        pff: 'a+',
        team: 'phi',
        'fox-sports': 'a-',
        'yahoo-sports': 'a-',
        'pro-football-network': 'a-',
        nfl: 'a-',
        'the-sporting-news': 'a',
        average: 3.8000000000000003,
      },
      {
        pff: 'a+',
        team: 'pit',
        'fox-sports': 'a+',
        'yahoo-sports': 'a',
        'pro-football-network': 'a',
        nfl: 'a',
        'the-sporting-news': 'a+',
        average: 4,
      },
      {
        pff: 'b+',
        team: 'sf',
        'fox-sports': 'b-',
        'yahoo-sports': 'c-',
        'pro-football-network': 'b-',
        nfl: 'b',
        'the-sporting-news': 'c-',
        average: 2.5166666666666666,
      },
      {
        pff: 'b+',
        team: 'sea',
        'fox-sports': 'b',
        'yahoo-sports': 'c+',
        'pro-football-network': 'a',
        nfl: 'a',
        'the-sporting-news': 'b-',
        average: 3.216666666666667,
      },
      {
        pff: 'a',
        team: 'tb',
        'fox-sports': 'b+',
        'yahoo-sports': 'b+',
        'pro-football-network': 'b+',
        nfl: 'b+',
        'the-sporting-news': 'b+',
        average: 3.4166666666666665,
      },
      {
        pff: 'b',
        team: 'ten',
        'fox-sports': 'b-',
        'yahoo-sports': 'c+',
        'pro-football-network': 'b+',
        nfl: 'a-',
        'the-sporting-news': 'b-',
        average: 2.9499999999999997,
      },
      {
        pff: 'a',
        team: 'was',
        'fox-sports': 'b+',
        'yahoo-sports': 'b',
        'pro-football-network': 'b+',
        nfl: 'a-',
        'the-sporting-news': 'a',
        average: 3.5500000000000003,
      },
    ];
  }
}

export default async function Home() {
  const data = await getData();
  if (data.length === 0) {
    return (
      <Container as="main" maxW="container.xl">
        <Heading>Couldn&apos;t get any data</Heading>
      </Container>
    );
  }
  const keys = Object.keys(data[0]);
  const teamIndex = keys.findIndex((value) => value === 'team');
  const averageIndex = keys.findIndex((value) => value === 'average');
  const highestGrade = data.reduce((acc, curr) =>
    acc.average > curr.average ? acc : curr
  );
  const highestGradeTeamInfo = getInfoFromTeamAbbreviation(highestGrade.team);
  const lowestGrade = data.reduce((acc, curr) =>
    acc.average < curr.average ? acc : curr
  );
  const lowestGradeTeamInfo = getInfoFromTeamAbbreviation(lowestGrade.team);
  return (
    <Container as="main" maxW="container.xl">
      <Heading>2024 NFL Draft Class Grades</Heading>
      <Box>
        <Chart data={data} />
      </Box>
      <Box py={16}>
        <StatGroup pb={16}>
          <Stat>
            <StatNumber>
              <TeamLogo
                teamAbbreviation={highestGrade.team}
                size={16}
                href={`/teams/${highestGradeTeamInfo.id}`}
              />
              {highestGrade.average.toFixed(2)}{' '}
            </StatNumber>
            <StatLabel>Highest grade</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>
              <TeamLogo
                teamAbbreviation={lowestGrade.team}
                size={16}
                href={`/teams/${lowestGradeTeamInfo.id}`}
              />
              {lowestGrade.average.toFixed(2)}{' '}
            </StatNumber>
            <StatLabel>Lowest grade</StatLabel>
          </Stat>
        </StatGroup>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Team</Th>
                {keys
                  .filter((key) => key !== 'team')
                  .map((key) => (
                    <Th key={key}>{key}</Th>
                  ))}
              </Tr>
            </Thead>
            <Tbody>
              {data.map((entry) => {
                const teamInfo = getInfoFromTeamAbbreviation(entry.team);

                return (
                  <Tr key={entry.team}>
                    <Td>
                      <HStack>
                        <TeamLogo
                          teamAbbreviation={entry.team}
                          size={12}
                          href={`/teams/${teamInfo.id}`}
                        />
                        <Text marginLeft={5}>
                          {capitalize(teamInfo.fullName ?? '')}
                        </Text>
                      </HStack>
                    </Td>
                    {Object.values(entry).map((value: any, index: number) => {
                      if (index === teamIndex) {
                        return null;
                      }
                      if (index === averageIndex) {
                        return (
                          <Td key={keys[index]}>{Number(value).toFixed(2)}</Td>
                        );
                      }
                      return <Td key={keys[index]}>{capitalize(value)}</Td>;
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
