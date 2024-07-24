import { Box, chakra } from '@chakra-ui/react';
import { boxShadow } from '../utils/style-utils';

const Card = chakra(Box, {
  baseStyle: {
    bg: 'elevations.light.dp02',
    _dark: {
      bg: 'elevations.dark.dp02',
    },
    borderRadius: 'lg',
    boxShadow: boxShadow(2),
    p: 4,
  },
});

export default Card;
