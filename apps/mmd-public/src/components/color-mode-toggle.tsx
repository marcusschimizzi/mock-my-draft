import { Box, ButtonGroup, IconButton, useColorMode } from '@chakra-ui/react';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { boxShadow } from '../utils/style-utils';

const ColorModeToggle = () => {
  const { colorMode, setColorMode } = useColorMode();
  const [isLight, setIsLight] = useState(colorMode === 'light');

  useEffect(() => {
    setIsLight(colorMode === 'light');
  }, [colorMode]);

  const AnimatedBox = motion(Box);

  return (
    <ButtonGroup isAttached pos={'relative'} boxShadow={boxShadow(4)}>
      <IconButton
        aria-label="Toggle Light Mode"
        icon={<FontAwesomeIcon icon={faSun} />}
        onClick={() => setColorMode('light')}
        bg="elevations.light.dp12"
        _dark={{ bg: 'elevations.dark.dp12' }}
        _hover={{
          bg: 'elevations.light.dp08',
          _dark: { bg: 'elevations.dark.dp08' },
        }}
      />
      <IconButton
        aria-label="Toggle Dark Mode"
        icon={<FontAwesomeIcon icon={faMoon} />}
        onClick={() => setColorMode('dark')}
        bg="elevations.light.dp12"
        _dark={{ bg: 'elevations.dark.dp12' }}
        _hover={{
          bg: 'elevations.light.dp08',
          _dark: { bg: 'elevations.dark.dp08' },
        }}
        _focus={{}}
      />
      <AnimatePresence initial={false}>
        <AnimatedBox
          key={isLight ? 'light' : 'dark'}
          pos={'absolute'}
          w={'50%'}
          h={'100%'}
          initial={{
            x: isLight ? '100%' : '0%',
            backgroundColor: isLight ? '#d62f2f' : '#4a90e2',
            borderTopRightRadius: isLight ? '0.375rem' : '0',
            borderBottomRightRadius: isLight ? '0.375rem' : '0',
            borderTopLeftRadius: isLight ? '0' : '0.375rem',
            borderBottomLeftRadius: isLight ? '0' : '0.375rem',
          }}
          animate={{
            x: isLight ? '0%' : '100%',
            backgroundColor: isLight ? '#4a90e2' : '#d62f2f',
            borderTopRightRadius: isLight ? '0' : '0.375rem',
            borderBottomRightRadius: isLight ? '0' : '0.375rem',
            borderTopLeftRadius: isLight ? '0.375rem' : '0',
            borderBottomLeftRadius: isLight ? '0.375rem' : '0',
          }}
          exit={{
            x: isLight ? '100%' : '0%',
            backgroundColor: isLight ? '#d62f2f' : '#4a90e2',
            borderTopRightRadius: isLight ? '0.375rem' : '0',
            borderBottomRightRadius: isLight ? '0.375rem' : '0',
            borderTopLeftRadius: isLight ? '0' : '0.375rem',
            borderBottomLeftRadius: isLight ? '0' : '0.375rem',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          pointerEvents={'none'}
          opacity={0.5}
          zIndex={2}
        />
      </AnimatePresence>
    </ButtonGroup>
  );
};

export default ColorModeToggle;
