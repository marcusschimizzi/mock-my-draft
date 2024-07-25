'use client';

import DashboardLayout from '@/layouts/dashboard-layout';
import { useSource } from '@/lib/sources';
import { Link } from '@chakra-ui/next-js';
import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

function SourcePage({ params }: { params: { sourceId: string } }) {
  const { source, isLoading } = useSource(params.sourceId);

  return (
    <DashboardLayout>
      <Box p={4} mt={8} mx="auto" maxW="800px">
        <Heading>{source?.name}</Heading>
        <Box mt={4}>{source?.baseUrl}</Box>
        {source?.sourceArticles && (
          <TableContainer mt={8}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Year</Th>
                </Tr>
              </Thead>
              <Tbody>
                {source.sourceArticles.map((sourceArticle) => (
                  <Tr key={sourceArticle.id}>
                    <Td>
                      <Link href={`/source-articles/${sourceArticle.id}`}>
                        {sourceArticle.title}
                      </Link>
                    </Td>
                    <Td>{sourceArticle.year}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default SourcePage;
