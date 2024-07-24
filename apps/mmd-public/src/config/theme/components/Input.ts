import { defineStyleConfig } from '@chakra-ui/react';

const Input = defineStyleConfig({
  baseStyle: {
    field: {
      _light: {
        bg: 'elevations.light.dp03',
        color: 'text.light',
      },
      _dark: {
        bg: 'elevations.dark.dp03',
        color: 'text.dark',
      },
      _focus: {
        borderColor: 'primary.500',
      },
    },
  },
});

export default Input;
