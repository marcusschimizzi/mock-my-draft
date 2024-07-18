import { Box, chakra } from '@chakra-ui/react';

const Card = chakra(Box, {
  baseStyle: {
    bg: 'white',
    borderRadius: 'lg',
    boxShadow: 'lg',
    p: 4,
  },
});

export default Card;
