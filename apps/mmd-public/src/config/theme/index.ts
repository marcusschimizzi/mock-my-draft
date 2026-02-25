import { extendTheme } from '@chakra-ui/react';
import colors from './colors';
import styles from './styles';
import { config } from './config';
import Input from './components/Input';
import { typography } from './foundations';

export const theme = extendTheme({
  colors,
  styles,
  config,
  ...typography,
  components: {
    Input,
  },
});
