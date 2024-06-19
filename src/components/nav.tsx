"use client";

import {
  Button,
  ButtonGroup,
  Container,
  Flex,
  Grid,
  GridItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Logo from "@/components/logo";
import { Link } from "@chakra-ui/next-js";

const divisions = [
  {
    name: "AFC North",
    teams: [
      "Baltimore Ravens",
      "Cincinnati Bengals",
      "Cleveland Browns",
      "Pittsburgh Steelers",
    ],
  },
  {
    name: "AFC South",
    teams: [
      "Houston Texans",
      "Indianapolis Colts",
      "Jacksonville Jaguars",
      "Tennessee Titans",
    ],
  },
  {
    name: "AFC East",
    teams: [
      "Buffalo Bills",
      "Miami Dolphins",
      "New England Patriots",
      "New York Jets",
    ],
  },
  {
    name: "AFC West",
    teams: [
      "Denver Broncos",
      "Kansas City Chiefs",
      "Los Angeles Chargers",
      "Las Vegas Raiders",
    ],
  },
  {
    name: "NFC North",
    teams: [
      "Chicago Bears",
      "Detroit Lions",
      "Green Bay Packers",
      "Minnesota Vikings",
    ],
  },
  {
    name: "NFC South",
    teams: [
      "Atlanta Falcons",
      "Carolina Panthers",
      "New Orleans Saints",
      "Tampa Bay Buccaneers",
    ],
  },
  {
    name: "NFC East",
    teams: [
      "Dallas Cowboys",
      "New York Giants",
      "Philadelphia Eagles",
      "Washington Commanders",
    ],
  },
  {
    name: "NFC West",
    teams: [
      "Arizona Cardinals",
      "Los Angeles Rams",
      "San Francisco 49ers",
      "Seattle Seahawks",
    ],
  },
];

function createTeamID(team: string) {
  return team.toLowerCase().trim().split(" ").join("-");
}

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
                    {divisions.map((division) => (
                      <GridItem minW="200px">
                        <Text color="GrayText">{division.name}</Text>
                        {division.teams.map((team) => (
                          <Link
                            display="block"
                            href={`/teams/${createTeamID(team)}`}
                          >
                            {team}
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
