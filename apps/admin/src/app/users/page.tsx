'use client';

import { Box, Heading, Table, Thead } from '@chakra-ui/react';
import DashboardLayout from '../../layouts/dashboard-layout';

function UsersPage() {
  return (
    <DashboardLayout requireAdmin={true}>
      <Box maxWidth={800} mx="auto" mt={8} p={4}>
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
    </DashboardLayout>
  );
}

export default UsersPage;
