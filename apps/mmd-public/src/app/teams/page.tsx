'use client';

import { Box, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTeams } from '../../lib/teams';
import { capitalize } from '../../lib/common-utils';
import TeamLogo from '../../components/team-logo';
import { Link } from '@chakra-ui/next-js';
import { Loading } from '../../components/loading';

interface Division {
  name: string;
  conference: string;
  direction: string;
}

export default function TeamsPage() {
  const { teams, isLoading } = useTeams();
  const [divisions, setDivisions] = useState<Division[]>([]);

  useEffect(() => {
    const divisions = teams.reduce((acc, team) => {
      const divisionName = `${team.conference.toUpperCase()} ${capitalize(
        team.division,
      )}`;
      if (!acc.some((division) => division.name === divisionName)) {
        acc.push({
          name: divisionName,
          conference: team.conference,
          direction: team.division,
        });
      }
      return acc;
    }, [] as Division[]);

    setDivisions(divisions);
  }, [teams]);

  return (
    <Box py={16} minH="80vh" fontSize="1.2rem">
      {isLoading ? (
        <Loading />
      ) : (
        <Box>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={{
              base: 4,
              md: 8,
              lg: 12,
            }}
          >
            {divisions.map((division) => (
              <Box key={division.name}>
                <Box as="h2" fontSize="1.5rem" fontWeight="bold" mb={4}>
                  {division.name}
                </Box>
                <VStack spacing={4}>
                  {teams
                    .filter(
                      (team) =>
                        team.conference === division.conference &&
                        team.division === division.direction,
                    )
                    .map((team) => (
                      <Box
                        key={team.id}
                        p={4}
                        bg="elevations.light.dp01"
                        _dark={{
                          bg: 'elevations.dark.dp01',
                        }}
                        _hover={{
                          bg: 'elevations.light.dp02',
                          _dark: {
                            bg: 'elevations.dark.dp02',
                          },
                        }}
                        transition={'background-color 0.2s'}
                        borderRadius="md"
                        w="full"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        as={Link}
                        href={`/teams/${team.slug}`}
                      >
                        <Text fontSize="1.2rem" fontWeight="bold">
                          {team.name}
                        </Text>
                        <TeamLogo teamAbbreviation={team.abbreviation} />
                      </Box>
                    ))}
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
}
