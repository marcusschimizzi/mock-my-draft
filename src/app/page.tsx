import TeamLogo from "@/components/team-logo";
import { API_URL } from "@/config/constants";
import { getInfoFromTeamAbbreviation } from "@/lib/team-utils";
import { capitalize } from "@/lib/utils";
import {
  Container,
  HStack,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";

async function getData() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const data = await getData();
  if (data.length === 0) {
    return (
      <Container as="main" maxW="container.xl">
        <Heading>Couldn't get any data</Heading>
      </Container>
    );
  }
  const keys = Object.keys(data[0]);
  const teamIndex = keys.findIndex((value) => value === "team");
  const averageIndex = keys.findIndex((value) => value === "average");
  return (
    <Container as="main" maxW="container.xl">
      <Heading>2024 NFL Draft Class Grades</Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Team</Th>
              {keys
                .filter((key) => key !== "team")
                .map((key) => (
                  <Th key={key}>{key}</Th>
                ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((entry) => (
              <Tr key={entry.team}>
                <Td>
                  <HStack>
                    <TeamLogo teamAbbreviation={entry.team} size={12} />
                    <Text marginLeft={5}>
                      {capitalize(
                        (getInfoFromTeamAbbreviation(entry.team) ?? {})
                          .fullName ?? ""
                      )}
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
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}
