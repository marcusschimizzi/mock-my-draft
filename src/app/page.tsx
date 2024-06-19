import {
  Container,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";

async function getData() {
  const res = await fetch("http://localhost:3000/api");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  const data = await getData();
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
                <Td>{entry.team}</Td>
                {Object.values(entry).map((value: any, index: number) => {
                  if (index === teamIndex) {
                    return null;
                  }
                  if (index === averageIndex) {
                    return (
                      <Td key={keys[index]}>{Number(value).toFixed(2)}</Td>
                    );
                  }
                  return <Td key={keys[index]}>{value}</Td>;
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}
