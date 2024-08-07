'use client';

import { Box, Heading, Table, Thead } from '@chakra-ui/react';

function UsersPage() {
  return (
    <Box maxWidth="container.xl" mx="auto" mt={8} p={4}>
      <Heading mb={6}>User management</Heading>
      <Table>
        <Thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </Thead>
      </Table>
    </Box>
  );
}

export default UsersPage;
