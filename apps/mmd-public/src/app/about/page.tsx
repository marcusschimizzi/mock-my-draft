'use client';

import { Box, Grid, Heading, Text } from '@chakra-ui/react';
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

function FeatureCard({
  number,
  title,
  description,
  delay,
}: {
  number: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
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
          borderColor: 'secondary.500',
          _dark: { borderColor: 'secondary.400' },
          transform: 'translateY(-2px)',
        }}
      >
        {/* Top accent line */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="0%"
          h="2px"
          bg="secondary.500"
          transition="width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          _groupHover={{ w: '100%' }}
        />

        <Text
          fontFamily="heading"
          fontWeight={900}
          fontSize="4xl"
          color="blackAlpha.100"
          _dark={{ color: 'whiteAlpha.100' }}
          lineHeight={1}
          mb={4}
        >
          {number}
        </Text>

        <Text
          fontFamily="heading"
          fontWeight={800}
          fontSize="md"
          letterSpacing="0.12em"
          textTransform="uppercase"
          mb={3}
        >
          {title}
        </Text>

        <Text
          fontFamily="var(--font-lora), 'Lora', serif"
          fontSize="sm"
          lineHeight={1.7}
          color="neutral.600"
          _dark={{ color: 'neutral.400' }}
        >
          {description}
        </Text>
      </Box>
    </MotionBox>
  );
}

export default function AboutUsPage() {
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
            About
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
            GRADING
            <br />
            THE GRADES
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

      {/* Pull quote section */}
      <MotionBox
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Box
          py={{ base: 8, md: 12 }}
          borderTop="1px solid"
          borderBottom="1px solid"
          borderColor="blackAlpha.100"
          _dark={{ borderColor: 'whiteAlpha.100' }}
        >
          <Text
            fontFamily="var(--font-lora), 'Lora', serif"
            fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
            fontStyle="italic"
            lineHeight={1.5}
            maxW="720px"
            color="neutral.700"
            _dark={{ color: 'neutral.300' }}
          >
            &ldquo;Are draft grades the most insightful thing? No, not usually.
            But the NFL draft&mdash;and all of the coverage surrounding
            it&mdash;is really fun.&rdquo;
          </Text>
        </Box>
      </MotionBox>

      {/* Body content */}
      <Box
        as="article"
        py={{ base: 10, md: 16 }}
        maxW="680px"
        fontFamily="var(--font-lora), 'Lora', serif"
      >
        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <Text fontSize="lg" lineHeight={1.85} mb={8} color="neutral.700" _dark={{ color: 'neutral.300' }}>
            Players sometimes take time to develop and often never turn into
            what they are expected to be coming out of college. As a result,
            draft class grades are often simply a reflection of whether teams
            selected well-known players and if these selections happened later
            than expected.
          </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Text fontSize="lg" lineHeight={1.85} color="neutral.700" _dark={{ color: 'neutral.300' }}>
            This website aims to collect draft grades from as many sources as
            possible and determine if there are any insights to be had when
            observing them in the aggregate.
          </Text>
        </MotionBox>
      </Box>

      {/* Feature cards */}
      <Box pt={{ base: 4, md: 8 }} pb={{ base: 8, md: 12 }}>
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          mb={{ base: 8, md: 10 }}
        >
          <Text
            fontFamily="heading"
            fontWeight={700}
            fontSize="xs"
            letterSpacing="0.25em"
            textTransform="uppercase"
            color="neutral.500"
            _dark={{ color: 'neutral.400' }}
          >
            What We Do
          </Text>
        </MotionBox>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap={{ base: 4, md: 6 }}
        >
          <FeatureCard
            number="01"
            title="Aggregate"
            description="We collect NFL draft grades from every major sports media outlet — ESPN, NFL.com, The Athletic, and more."
            delay={0}
          />
          <FeatureCard
            number="02"
            title="Analyze"
            description="Compare how different experts and publications rate the same draft class to reveal consensus and outliers."
            delay={0.1}
          />
          <FeatureCard
            number="03"
            title="Discover"
            description="Surface patterns and insights hidden in the aggregate data, tracking trends across multiple draft years."
            delay={0.2}
          />
        </Grid>
      </Box>
    </Box>
  );
}
