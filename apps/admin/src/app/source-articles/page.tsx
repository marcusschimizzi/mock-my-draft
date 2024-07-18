'use client';
import {
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import DashboardLayout from '../../layouts/dashboard-layout';
import {
  useDeleteSourceArticle,
  useSourceArticles,
} from '../../lib/sources-articles';
import { Loading } from '../../components/loading';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useRef, useState } from 'react';
import { defaultSourceArticle, SourceArticle } from '../../types';
import SourceArticleDrawer from './components/source-article-drawer';

function SourceArticlesPage() {
  const [sourceArticle, setSourceArticle] = useState(defaultSourceArticle);
  const { sourceArticles, isLoading } = useSourceArticles();
  const toggleDrawerBtnRef = useRef(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const deleteSourceArticle = useDeleteSourceArticle({});

  const handleCreateSource = () => {
    setSourceArticle(defaultSourceArticle);
    onOpen();
  };

  const handleEdit = (sourceArticle: SourceArticle) => {
    setSourceArticle(sourceArticle);
    onOpen();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DashboardLayout>
      <Box maxWidth={800} mx="auto" mt={8} p={4}>
        <Heading mb={6}>Source article management</Heading>
        <Button
          mb={4}
          w="full"
          leftIcon={<AddIcon />}
          ref={toggleDrawerBtnRef}
          onClick={handleCreateSource}
        >
          Add a new source
        </Button>
        <SourceArticleDrawer
          sourceArticle={sourceArticle}
          onChange={setSourceArticle}
          isOpen={isOpen}
          onClose={onClose}
          toggleBtnRef={toggleDrawerBtnRef}
        />
        <Table variant={'simple'}>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Source</Th>
              <Th>Year</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sourceArticles.map((sourceArticle) => (
              <Tr key={sourceArticle.id}>
                <Td>{sourceArticle.title}</Td>
                <Td>{sourceArticle.source.name}</Td>
                <Td>{sourceArticle.year}</Td>
                <Td>
                  {sourceArticle.publicationDate
                    ? new Date(sourceArticle.publicationDate).toDateString()
                    : null}
                </Td>
                <Td justifyContent={'space-around'} display={'flex'}>
                  <Button
                    onClick={() => handleEdit(sourceArticle)}
                    colorScheme={'blue'}
                    size={'sm'}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    colorScheme={'red'}
                    size={'sm'}
                    onClick={() => deleteSourceArticle.submit(sourceArticle.id)}
                  >
                    <DeleteIcon />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </DashboardLayout>
  );
}

export default SourceArticlesPage;
