import { Box, Heading, SkeletonText, Stat, StatNumber } from '@chakra-ui/react';
import { Entity } from '../types';
import { boxShadow } from '@/utils/style-utils';

interface DataSummaryProps {
  title: string;
  data: Entity[];
  isLoading?: boolean;
}
function DataSummary({ title, data, isLoading }: DataSummaryProps) {
  return (
    <Box
      boxShadow={boxShadow(2)}
      height={32}
      bg="elevations.light.dp02"
      _dark={{ bg: 'elevations.dark.dp02' }}
      borderRadius="md"
      p={4}
      mr={4}
      mt={4}
      alignContent={'center'}
      justifyItems={'center'}
    >
      {isLoading ? (
        <SkeletonText mt={4} noOfLines={4} spacing="4" />
      ) : (
        <Stat>
          <StatNumber fontSize="xx-large">{data.length}</StatNumber>
        </Stat>
      )}
      <Heading size="md">{title}</Heading>
    </Box>
  );
}

export default DataSummary;
