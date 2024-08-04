import { Center, Spinner } from '@chakra-ui/react';

export const Loading = () => {
  return (
    <Center h="100vh">
      <Spinner data-testid="loading" size="xl" color="primary" />
    </Center>
  );
};
