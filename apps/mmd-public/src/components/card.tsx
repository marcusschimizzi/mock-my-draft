import { Box, BoxProps, forwardRef } from '@chakra-ui/react';
import { boxShadow } from '../utils/style-utils';

interface CardProps extends BoxProps {
  variant?: 'elevated' | 'interactive' | 'hero';
}

const Card = forwardRef<CardProps, 'div'>(({ variant = 'elevated', ...props }, ref) => {
  const variants = {
    elevated: {
      bg: 'elevations.light.dp02',
      _dark: { bg: 'elevations.dark.dp02' },
      boxShadow: boxShadow(2),
    },
    interactive: {
      bg: 'elevations.light.dp04',
      _dark: { bg: 'elevations.dark.dp04' },
      boxShadow: boxShadow(4),
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: boxShadow(8),
      },
    },
    hero: {
      bg: 'elevations.light.dp06',
      _dark: { bg: 'elevations.dark.dp06' },
      boxShadow: boxShadow(6),
      borderRadius: 'xl',
    },
  };

  return <Box ref={ref} borderRadius="lg" p={4} {...variants[variant]} {...props} />;
});

Card.displayName = 'Card';

export default Card;
