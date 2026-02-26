'use client';

import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

const MotionBox = motion(Box);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function ContactPage() {
  return (
    <Box minH="80vh" pb={20}>
      {/* Hero section */}
      <Box pt={{ base: 12, md: 20 }} pb={{ base: 10, md: 16 }}>
        <MotionBox custom={0} variants={fadeUp} initial="initial" animate="animate">
          <Text
            fontFamily="heading"
            fontWeight={700}
            fontSize="xs"
            letterSpacing="0.25em"
            textTransform="uppercase"
            color="secondary.500"
          >
            Contact
          </Text>
        </MotionBox>

        <MotionBox custom={1} variants={fadeUp} initial="initial" animate="animate">
          <Heading
            as="h1"
            fontFamily="heading"
            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
            fontWeight={900}
            letterSpacing="-0.02em"
            lineHeight={0.95}
            mt={4}
          >
            GET IN
            <br />
            TOUCH
          </Heading>
        </MotionBox>

        <MotionBox custom={2} variants={fadeUp} initial="initial" animate="animate">
          <Box
            w="60px"
            h="3px"
            bgGradient="linear(to-r, secondary.500, primary.500)"
            mt={6}
            borderRadius="full"
          />
        </MotionBox>
      </Box>

      {/* Body */}
      <MotionBox
        custom={3}
        variants={fadeUp}
        initial="initial"
        animate="animate"
        maxW="600px"
      >
        <Text
          fontFamily="var(--font-lora), 'Lora', serif"
          fontSize="lg"
          lineHeight={1.85}
          color="neutral.700"
          _dark={{ color: 'neutral.300' }}
        >
          Have comments, questions, suggestions, or just want to say hi?
          We&rsquo;d love to hear from you.
        </Text>
      </MotionBox>

      {/* Email card */}
      <MotionBox
        custom={4}
        variants={fadeUp}
        initial="initial"
        animate="animate"
        mt={{ base: 10, md: 14 }}
        maxW="520px"
      >
        <Box
          p={{ base: 6, md: 8 }}
          border="1px solid"
          borderColor="blackAlpha.100"
          _dark={{ borderColor: 'whiteAlpha.100' }}
          position="relative"
          overflow="hidden"
          role="group"
          transition="all 0.3s ease"
          _hover={{
            borderColor: 'primary.400',
            _dark: { borderColor: 'primary.400' },
          }}
        >
          {/* Left accent line */}
          <Box
            position="absolute"
            top={0}
            left={0}
            w="3px"
            h="full"
            bgGradient="linear(to-b, primary.500, secondary.500)"
          />

          <Text
            fontFamily="heading"
            fontWeight={700}
            fontSize="xs"
            letterSpacing="0.18em"
            textTransform="uppercase"
            color="neutral.500"
            _dark={{ color: 'neutral.400' }}
            mb={4}
            pl={4}
          >
            Email Us
          </Text>

          <Box
            pl={4}
            className="contact-link"
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight={500}
          >
            <a href="mailto:%68%65%6c%6c%6f%40%6d%6f%63%6b%6d%79%64%72%61%66%74%2e%63%6f%6d">
              <Text
                as="span"
                fontFamily="var(--font-lora), 'Lora', serif"
                _hover={{ color: 'primary.500' }}
                transition="color 0.2s ease"
              >
                hello [at] <b>askjkslkds</b> mockmydraft{' '}
                <b>skljfksjkdlsjkjlks</b> [dot] com
              </Text>
            </a>
          </Box>
        </Box>
      </MotionBox>

      {/* Decorative bottom element */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        mt={{ base: 16, md: 24 }}
      >
        <Flex align="center" gap={4} maxW="600px">
          <Box
            h="1px"
            flex={1}
            bg="blackAlpha.100"
            _dark={{ bg: 'whiteAlpha.100' }}
          />
          <Text
            fontFamily="var(--font-lora), 'Lora', serif"
            fontStyle="italic"
            fontSize="sm"
            color="neutral.400"
            _dark={{ color: 'neutral.600' }}
          >
            We read every message
          </Text>
          <Box
            h="1px"
            flex={1}
            bg="blackAlpha.100"
            _dark={{ bg: 'whiteAlpha.100' }}
          />
        </Flex>
      </MotionBox>
    </Box>
  );
}
