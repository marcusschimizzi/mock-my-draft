'use client';

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Logo from '@/components/logo';
import { Link } from '@chakra-ui/next-js';
import TeamLogo from './team-logo';
import { TEAM_NAMES, TeamNameLookup } from '@/lib/team-utils';
import { capitalize } from '@/lib/utils';

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

export default function Nav() {
  const [atTop, setAtTop] = useState(true);

  const handleScroll = () => {
    setAtTop(window.scrollY === 0);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Box
        as="header"
        width="100%"
        position="sticky"
        top={0}
        left={0}
        right={0}
        height={{ base: '64px', lg: '88px' }}
        bg={atTop ? 'transparent' : 'gray.50'}
        _dark={{
          bg: atTop ? 'transparent' : 'gray.800',
        }}
        boxShadow={atTop ? 'none' : 'md'}
        transition={'box-shadow 0.2s ease, background-color 0.2s ease'}
      >
        <Flex
          maxW="8xl"
          justifyContent="space-between"
          alignContent="center"
          p={8}
          margin="0 auto"
        >
          <Link href="/">
            <Logo />
          </Link>
          <ButtonGroup>
            <Button as={Link} variant="link" href="/about-us" mr={8}>
              About Us
            </Button>
            <Button as={Link} variant="link" href="/contact" mr={8}>
              Contact
            </Button>
            <Popover
              trigger="hover"
              placement="bottom"
              closeOnEsc={true}
              preventOverflow={true}
            >
              <PopoverTrigger>
                <Button variant="link">Teams</Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent width="fit-content">
                  <PopoverBody>
                    <Grid
                      templateColumns={[
                        'repeat(2, 1fr)',
                        null,
                        null,
                        'repeat(4, 1fr)',
                      ]}
                      gap={2}
                    >
                      {Object.keys(divisions).map((divisionName) => (
                        <GridItem minW="200px" key={createTeamID(divisionName)}>
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
                                  size={8}
                                />
                                <Text>{capitalize(team.fullName)}</Text>
                              </HStack>
                            </Link>
                          ))}
                        </GridItem>
                      ))}
                    </Grid>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </ButtonGroup>
        </Flex>
      </Box>
    </>
  );
}
