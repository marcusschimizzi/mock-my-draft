'use client';

import { Box, Heading, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { Loading } from '../../components/loading';
import DashboardLayout from '../../layouts/dashboard-layout';
import { useDraftGrades } from '../../lib/draft-grades';

function DraftGradesPage() {
  const { isLoading, draftGrades } = useDraftGrades();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DashboardLayout>
      <Box maxWidth={800} mx="auto" mt={8} p={4}>
        <Heading mb={6}>Draft grade management</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Team</Th>
              <Th>Grade</Th>
              <Th>Source</Th>
              <Th>Year</Th>
            </Tr>
          </Thead>
          <Tbody>
            {draftGrades.map((grade) => (
              <Tr key={grade.id}>
                <Th>{grade.team.name}</Th>
                <Th>{grade.grade}</Th>
                <Th>{grade.sourceArticle.source.name}</Th>
                <Th>{grade.year}</Th>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </DashboardLayout>
  );
}

export default DraftGradesPage;
