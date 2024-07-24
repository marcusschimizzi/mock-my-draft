import { extendTheme, ThemeComponents } from '@chakra-ui/react';
import Input from './components/Input';
import Button from './components/Button';
import colors from './colors';
import { config } from './config';
import styles from './styles';

const components: ThemeComponents = {
  Button,
  Input,
};

export const theme = extendTheme({ colors, config, components, styles });
