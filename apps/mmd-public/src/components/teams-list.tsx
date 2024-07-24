'use client';

import { TEAM_NAMES, TeamNameLookup } from '../lib/teams-utils';
import { capitalize } from '../lib/common-utils';
import {
  Box,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import React from 'react';
import TeamLogo from '../components/team-logo';

interface TeamsListProps {
  columns?: number;
  structured?: boolean;
}

interface Divisions {
  [divisionName: string]: TeamNameLookup[];
}

function groupDivisions(): Divisions {
  const divisions: Divisions = {};
  TEAM_NAMES.forEach((team) => {
    const divisionName = `${team.conference.toUpperCase()} ${capitalize(
      team.division,
    )}`;
    if (divisionName in divisions) {
      divisions[divisionName].push(team);
    } else {
      divisions[divisionName] = [team];
    }
  });
  return divisions;
}

function createTeamID(team: string) {
  return team.toLowerCase().trim().split(' ').join('-');
}

const divisions = groupDivisions();

export default function TeamsList({
  columns = 4,
  structured = true,
}: TeamsListProps) {
  return (
    <>
      {structured ? (
        <SimpleGrid
          columns={{
            base: 1,
            md: columns,
          }}
          gap={2}
        >
          {Object.keys(divisions).map((divisionName) => (
            <Box minW="200px" key={createTeamID(divisionName)}>
              <Text
                color="text.light"
                _dark={{
                  color: 'text.dark',
                }}
              >
                {divisionName}
              </Text>
              {divisions[divisionName].map((team) => (
                <Link display="block" href={`/teams/${team.id}`} key={team.id}>
                  <HStack>
                    <TeamLogo
                      teamAbbreviation={team.abbreviation}
                      size="small"
                    />
                    <Text>{capitalize(team.fullName)}</Text>
                  </HStack>
                </Link>
              ))}
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Wrap>
          {Object.keys(divisions).map((divisionName) => (
            <WrapItem
              minW="200px"
              key={createTeamID(divisionName)}
              padding={{
                base: 3,
                lg: 8,
              }}
            >
              <VStack alignItems="flex-start">
                <Text color="GrayText">{divisionName}</Text>
                {divisions[divisionName].map((team) => (
                  <Link
                    display="block"
                    href={`/teams/${team.id}`}
                    key={team.id}
                  >
                    <HStack>
                      <TeamLogo
                        teamAbbreviation={team.abbreviation}
                        size="small"
                      />
                      <Text>{capitalize(team.fullName)}</Text>
                    </HStack>
                  </Link>
                ))}
              </VStack>
            </WrapItem>
          ))}
        </Wrap>
      )}
    </>
  );
}
