import { Box, ChakraProps, HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import logoSvg from '../images/logo.svg';

export default function Logo(props: ChakraProps) {
  return (
    <Box {...props}>
      <HStack>
        <Image src={logoSvg} alt="Mock My Draft Logo" width={50} height={50} />
        <Text
          fontFamily="heading"
          fontSize="lg"
          fontWeight={800}
          letterSpacing="0.06em"
          textTransform="uppercase"
          as="h1"
        >
          Mock My Draft
        </Text>
      </HStack>
    </Box>
  );
}
