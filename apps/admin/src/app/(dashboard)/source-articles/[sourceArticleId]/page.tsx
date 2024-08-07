'use client';

import { useSourceArticle } from '@/lib/sources-articles';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { getGradeColor } from '../create/utils';
import { useParams } from 'next/navigation';
import { EditIcon } from '@chakra-ui/icons';
import SourceArticleDrawer from '../components/source-article-drawer';
import { useRef, useState } from 'react';
import { CreateSourceArticleDto, SourceArticle } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link as NextLink } from '@chakra-ui/next-js';

function SourceArticlePage() {
  const { sourceArticleId } = useParams<{ sourceArticleId: string }>();
  const { sourceArticle, isLoading } = useSourceArticle(sourceArticleId);
  const editButtonRef = useRef(null);
  const [newSourceArticle, setNewSourceArticle] = useState<
    Partial<CreateSourceArticleDto>
  >({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEdit = (sourceArticle: SourceArticle) => {
    setNewSourceArticle({
      title: sourceArticle.title,
      url: sourceArticle.url,
      year: sourceArticle.year,
      publicationDate: sourceArticle.publicationDate,
      sourceId: sourceArticle.source.id,
    });
    onOpen();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!sourceArticle) {
    return <div>Source article not found</div>;
  }

  return (
    <>
      <Heading maxW="90%">{sourceArticle?.title}</Heading>
      <Button
        colorScheme="primary"
        mt={8}
        w="full"
        leftIcon={<FontAwesomeIcon icon={faEdit} />}
        as={NextLink}
        href={`/source-articles/${sourceArticleId}/edit`}
      >
        Edit article & grades
      </Button>
      <SimpleGrid columns={2} mt={4} spacing={4}>
        <VStack
          align="start"
          p={4}
          mt={4}
          borderRadius={8}
          bg="elevations.light.dp02"
          _dark={{ bg: 'elevations.dark.dp02' }}
          position="relative"
        >
          <Heading size="sm">Details</Heading>
          <Button
            colorScheme="primary"
            position="absolute"
            right={8}
            top={8}
            ref={editButtonRef}
            onClick={() => handleEdit(sourceArticle)}
          >
            <EditIcon />
          </Button>

          {sourceArticle?.url && (
            <Text>
              <Link
                href={sourceArticle.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View original article
              </Link>
            </Text>
          )}
          <Text>
            <Text as="span" color="GrayText">
              Year:
            </Text>{' '}
            {sourceArticle?.year}
          </Text>
          {sourceArticle?.publicationDate && (
            <Text>
              <Text as="span" color="GrayText">
                Publication date:
              </Text>{' '}
              {new Date(sourceArticle?.publicationDate).toDateString()}
            </Text>
          )}
        </VStack>
        <VStack
          align="start"
          p={4}
          mt={4}
          borderRadius={8}
          bg="elevations.light.dp02"
          _dark={{ bg: 'elevations.dark.dp02' }}
        >
          <Heading size="sm">Source</Heading>
          <Text>{sourceArticle?.source.name}</Text>
          <Text>
            <Link href={`/sources/${sourceArticle?.source.id}`}>
              Go to source page
            </Link>
          </Text>
        </VStack>
      </SimpleGrid>
      {sourceArticle?.draftClassGrades && (
        <VStack mt={8} align="start" w="full">
          <Heading size="md">Draft Class Grades</Heading>
          <Accordion mt={4} allowToggle w="full">
            {sourceArticle.draftClassGrades.map((grade) => (
              <AccordionItem key={grade.id} w="full">
                <Heading size="sm">
                  <AccordionButton w="full">
                    <Box
                      w="full"
                      justifyContent="space-between"
                      alignItems="center"
                      display="flex"
                    >
                      <HStack flex={1} justifyContent="space-between">
                        <Text>{grade.team.name}</Text>
                        <Box
                          bg={getGradeColor(grade.grade.toUpperCase())}
                          w={12}
                          h={12}
                          borderRadius="50%"
                          position="relative"
                        >
                          <Text
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            fontWeight="bold"
                          >
                            {grade.grade.toUpperCase()}
                          </Text>
                        </Box>
                      </HStack>
                      <AccordionIcon />
                    </Box>
                  </AccordionButton>
                </Heading>
                <AccordionPanel>
                  {grade.text && (
                    <Text whiteSpace="preserve">{grade.text}</Text>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </VStack>
      )}
      <SourceArticleDrawer
        sourceArticle={newSourceArticle}
        isOpen={isOpen}
        onClose={onClose}
        toggleBtnRef={editButtonRef}
        onChange={setNewSourceArticle}
      />
    </>
  );
}

const WrappedSourceArticlePage = () => (
  <Box maxWidth="container.xl" mx="auto" mt={8} p={4} position="relative">
    <SourceArticlePage />
  </Box>
);

export default WrappedSourceArticlePage;
