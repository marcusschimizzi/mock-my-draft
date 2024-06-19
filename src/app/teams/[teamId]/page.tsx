import { Container, Heading } from "@chakra-ui/react";
import React from "react";

export default function TeamPage({ params }: { params: { teamId: string } }) {
  return (
    <Container as="main" maxW="container.xl">
      <Heading>{params.teamId}</Heading>
    </Container>
  );
}
