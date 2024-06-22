"use client";

import { Center, Heading, VStack } from "@chakra-ui/react";

import { Link } from "@chakra-ui/next-js";

const NotFoundPage = () => {
  return (
    <>
      <Center h="96">
        <VStack>
          <Heading size="4xl">404</Heading>
          <Heading>Uh-oh... Looks like that pick is a bust!</Heading>
        </VStack>
      </Center>
      <Center>
        <Link href="/">Go Home</Link>
      </Center>
    </>
  );
};

export default NotFoundPage;
