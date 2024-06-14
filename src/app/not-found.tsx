"use client";

import { Center, Heading, VStack } from "@chakra-ui/react";

import { Link } from "@chakra-ui/next-js";

const NotFoundPage = () => {
  return (
    <>
      <Center h="96">
        <VStack>
          <Heading size="4xl">🤷</Heading>
          <Heading>Not Found</Heading>
        </VStack>
      </Center>
      <Center>
        <Link href="/">Go Home</Link>
      </Center>
    </>
  );
};

export default NotFoundPage;
