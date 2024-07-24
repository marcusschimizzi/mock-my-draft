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
import { Loading } from '../../components/loading';
import DashboardLayout from '../../layouts/dashboard-layout';
import { useDeleteDraftGrade, useDraftGrades } from '../../lib/draft-grades';
import { useRef, useState } from 'react';
import {
  CreateDraftGradeDto,
  defaultDraftGrade,
  DraftGrade,
} from '../../types';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import DraftGradeDrawer from './components/draft-grade-drawer';

function DraftGradesPage() {
  const { isLoading, draftGrades } = useDraftGrades();
  const [draftGrade, setDraftGrade] =
    useState<Partial<CreateDraftGradeDto>>(defaultDraftGrade);
  const toggleDrawerBtnRef = useRef(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const deleteDraftGrade = useDeleteDraftGrade({});
  const [selectedId, setSelectedId] = useState('');

  const handleCreateDraftGrade = () => {
    setSelectedId('');
    setDraftGrade(defaultDraftGrade);
    onOpen();
  };

  const handleEdit = (draftGrade: DraftGrade) => {
    setSelectedId(draftGrade.id);
    setDraftGrade({
      teamId: draftGrade.team.id,
      grade: draftGrade.grade,
      year: draftGrade.year,
      sourceArticleId: draftGrade.sourceArticle.id,
      text: draftGrade.text,
    });
    onOpen();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DashboardLayout>
      <Box maxWidth={800} mx="auto" mt={8} p={4}>
        <Heading mb={6}>Draft grade management</Heading>
        <Button
          mb={4}
          w="full"
          leftIcon={<AddIcon />}
          ref={toggleDrawerBtnRef}
          onClick={handleCreateDraftGrade}
        >
          Add a new draft grade
        </Button>
        <DraftGradeDrawer
          draftGrade={draftGrade}
          isOpen={isOpen}
          onClose={onClose}
          onChange={setDraftGrade}
          toggleBtnRef={toggleDrawerBtnRef}
          selectedId={selectedId}
        />
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Team</Th>
              <Th>Grade</Th>
              <Th>Source</Th>
              <Th>Year</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {draftGrades.map((grade) => (
              <Tr key={grade.id}>
                <Td>{grade.team.name}</Td>
                <Td>{grade.grade.toUpperCase()}</Td>
                <Td>{grade.sourceArticle.source.name}</Td>
                <Td>{grade.year}</Td>
                <Td>
                  <Box w="full" display="flex" justifyContent="space-around">
                    <Button
                      colorScheme="primary"
                      onClick={() => handleEdit(grade)}
                      size={'sm'}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      colorScheme="secondary"
                      onClick={() => deleteDraftGrade.submit(grade.id)}
                      size={'sm'}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </DashboardLayout>
  );
}

export default DraftGradesPage;
