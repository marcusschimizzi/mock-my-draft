import { Skeleton, VStack, HStack, SimpleGrid } from '@chakra-ui/react';
import Card from './card';

export const ChartSkeleton = () => (
  <Card>
    <VStack align="stretch" spacing={4}>
      <Skeleton height="20px" width="40%" />
      <Skeleton height="300px" />
    </VStack>
  </Card>
);

export const StatsCardSkeleton = () => (
  <Card variant="hero">
    <VStack align="stretch" spacing={2}>
      <Skeleton height="16px" width="60%" />
      <Skeleton height="32px" width="80%" />
      <Skeleton height="14px" width="50%" />
    </VStack>
  </Card>
);

export const HeroStatsSkeleton = () => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={12}>
    {[1, 2, 3, 4].map((i) => (
      <StatsCardSkeleton key={i} />
    ))}
  </SimpleGrid>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <Card>
    <VStack align="stretch" spacing={3}>
      {Array.from({ length: rows }).map((_, i) => (
        <HStack key={i} spacing={4}>
          <Skeleton height="16px" flex={1} />
          <Skeleton height="16px" width="80px" />
          <Skeleton height="24px" width="60px" />
        </HStack>
      ))}
    </VStack>
  </Card>
);
