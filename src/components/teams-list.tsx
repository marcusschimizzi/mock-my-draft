'use client';

import { TEAM_NAMES, TeamNameLookup } from '@/lib/team-utils';
import { capitalize } from '@/lib/utils';
import { Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import React from 'react';
import TeamLogo from '@/components/team-logo';

interface TeamsListProps {
  columns?: number;
}

interface Divisions {
  [divisionName: string]: TeamNameLookup[];
}

function groupDivisions(): Divisions {
  const divisions: Divisions = {};
  TEAM_NAMES.forEach((team) => {
    const divisionName = `${team.conference.toUpperCase()} ${capitalize(
      team.division
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

export default function TeamsList({ columns = 4 }: TeamsListProps) {
  return (
    <>
      <Grid
        templateColumns={
          columns
            ? `repeat(${columns}, 1fr)`
            : ['repeat(2, 1fr)', null, null, 'repeat(4, 1fr)']
        }
        gap={2}
      >
        {Object.keys(divisions).map((divisionName) => (
          <GridItem minW="200px" key={createTeamID(divisionName)}>
            <Text color="GrayText">{divisionName}</Text>
            {divisions[divisionName].map((team) => (
              <Link display="block" href={`/teams/${team.id}`} key={team.id}>
                <HStack>
                  <TeamLogo teamAbbreviation={team.abbreviation} size={8} />
                  <Text>{capitalize(team.fullName)}</Text>
                </HStack>
              </Link>
            ))}
          </GridItem>
        ))}
      </Grid>
    </>
  );
}
