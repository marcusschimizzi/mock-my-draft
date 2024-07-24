import { StyleFunctionProps } from '@chakra-ui/react';

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg:
        props.colorMode === 'dark'
          ? 'elevations.dark.base'
          : 'elevations.light.base',
      color: props.colorMode === 'dark' ? 'text.dark' : 'text.light',
    },
  }),
};

export default styles;
