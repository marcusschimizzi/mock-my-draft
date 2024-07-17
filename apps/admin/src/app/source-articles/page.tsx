'use client';
import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import DashboardLayout from '../../layouts/dashboard-layout';
import { useSourceArticles } from '../../lib/sources-articles';
import { Loading } from '../../components/loading';

function SourceArticlesPage() {
  const { sourceArticles, isLoading } = useSourceArticles();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DashboardLayout>
      <Box p={4} maxW={800}>
        <Heading mb={6}>Source article management</Heading>
        <Table variant={'simple'}>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Source</Th>
              <Th>Year</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sourceArticles.map((sourceArticle) => (
              <Tr key={sourceArticle.id}>
                <Td>{sourceArticle.title}</Td>
                <Td>{sourceArticle.source.name}</Td>
                <Td>{sourceArticle.year}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </DashboardLayout>
  );
}

export default SourceArticlesPage;
