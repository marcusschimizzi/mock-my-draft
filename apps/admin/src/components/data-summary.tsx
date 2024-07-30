import {
  Box,
  Heading,
  SkeletonText,
  Stat,
  StatNumber,
  LinkProps,
  BoxProps,
} from '@chakra-ui/react';
import { Entity } from '../types';
import { boxShadow } from '@/utils/style-utils';
import { Link } from '@chakra-ui/next-js';

type DataSummaryProps = {
  title: string;
  data: Entity[];
  isLoading?: boolean;
  link?: string;
} & ((BoxProps & { link?: never }) | (LinkProps & { link: string }));

function DataSummary({
  title,
  data,
  isLoading,
  link,
  ...props
}: DataSummaryProps) {
  if (isLoading) {
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
        <SkeletonText noOfLines={1} spacing={4} />
        <SkeletonText noOfLines={1} spacing={4} />
      </Box>
    );
  }

  return (
    <>
      {link ? (
        <Link
          href={link}
          {...(props as LinkProps)}
          boxShadow={boxShadow(2)}
          height={32}
          bg="elevations.light.dp02"
          _dark={{ bg: 'elevations.dark.dp02' }}
          _hover={{
            bg: 'elevations.light.dp04',
            _dark: { bg: 'elevations.dark.dp04' },
            transform: 'translateY(-2px)',
          }}
          transition={'background-color 0.2s, transform 0.2s'}
          borderRadius="md"
          p={4}
          mr={4}
          mt={4}
          alignContent={'center'}
          justifyItems={'center'}
        >
          <Stat>
            <StatNumber fontSize="xx-large">{data.length}</StatNumber>
          </Stat>
          <Heading size="md">{title}</Heading>
        </Link>
      ) : (
        <Box
          {...(props as BoxProps)}
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
          <Stat>
            <StatNumber fontSize="xx-large">{data.length}</StatNumber>
          </Stat>
          <Heading size="md">{title}</Heading>
        </Box>
      )}
    </>
  );
}

export default DataSummary;
