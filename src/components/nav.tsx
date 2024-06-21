"use client";

import {
  Button,
  ButtonGroup,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Logo from "@/components/logo";
import { Link } from "@chakra-ui/next-js";
import TeamLogo from "./team-logo";
import { TEAM_NAMES, TeamNameLookup } from "@/lib/team-utils";
import { capitalize } from "@/lib/utils";

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
  return team.toLowerCase().trim().split(" ").join("-");
}

const divisions = groupDivisions();

export default function Nav() {
  return (
    <>
      <Container maxW="8xl">
        <Flex
          justifyContent="space-between"
          alignContent="center"
          as="nav"
          p={8}
        >
          <Link href="/">
            <Logo />
          </Link>
          <ButtonGroup>
            <Popover
              trigger="hover"
              placement="bottom"
              closeOnEsc={true}
              preventOverflow={true}
            >
              <PopoverTrigger>
                <Button variant="link">Teams</Button>
              </PopoverTrigger>
              <PopoverContent width="fit-content">
                <PopoverBody>
                  <Grid templateColumns="repeat(4, 1fr)" gap={2}>
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
            </Popover>
          </ButtonGroup>
        </Flex>
      </Container>
    </>
  );
}
