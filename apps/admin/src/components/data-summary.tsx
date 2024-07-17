import { Box, Heading, SkeletonText, Stat, StatNumber } from '@chakra-ui/react';
import { Entity } from '../types';

interface DataSummaryProps {
  title: string;
  data: Entity[];
  isLoading?: boolean;
}
function DataSummary({ title, data, isLoading }: DataSummaryProps) {
  return (
    <Box
      boxShadow="large"
      width={['200px', null, '300px']}
      height={32}
      bg="gray.100"
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
