'use client';

import DashboardLayout from '@/layouts/dashboard-layout';
import { useSourceArticle } from '@/lib/sources-articles';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { getGradeColor } from '../create/utils';

function SourceArticlePage({
  params,
}: {
  params: { sourceArticleId: string };
}) {
  const { sourceArticle, isLoading } = useSourceArticle(params.sourceArticleId);

  return (
    <DashboardLayout>
      <Box maxW="800px" mx="auto" mt={8} p={4}>
        <Heading>{sourceArticle?.title}</Heading>
        <SimpleGrid columns={2} mt={4} spacing={4}>
          <VStack
            align="start"
            p={4}
            mt={4}
            borderRadius={8}
            bg="elevations.light.dp02"
            _dark={{ bg: 'elevations.dark.dp02' }}
          >
            <Heading size="sm">Details</Heading>

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
      </Box>
    </DashboardLayout>
  );
}

export default SourceArticlePage;
