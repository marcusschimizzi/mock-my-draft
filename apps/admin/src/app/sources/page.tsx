'use client';
import { Protected } from '@/components/protected';
import { defaultSource, Source } from '@/types';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import {
  createSource,
  deleteSource,
  getSources,
  updateSource,
} from '@/lib/api';
import { Loading } from '@/components/loading';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { queryClient } from '@/lib/react-query';
import DashboardLayout from '@/layouts/dashboard-layout';

const CREATE_SOURCES_FORM = 'create-sources-form';

function SourcesPage() {
  const [newSource, setNewSource] = useState<Partial<Source>>(defaultSource);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isUpdating, setIsUpdating] = useState(false);
  const openDrawerBtnRef = useRef<HTMLButtonElement>(null);

  const {
    data: sources,
    isLoading,
    error,
  } = useQuery<Source[]>({
    queryKey: ['sources'],
    queryFn: () => getSources(),
  });

  const handleOpenDrawer = () => {
    onOpen();
    setNewSource(defaultSource);
    setIsUpdating(false);
  };

  const handleEditSource = (source: Source) => {
    onOpen();
    setNewSource(source);
    setIsUpdating(true);
  };

  useEffect(() => {
    if (newSource.name) {
      setNewSource({
        ...newSource,
        slug: newSource.name
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, ''),
      });
    }
  }, [newSource.name]);

  const createSourceMutation = useMutation({
    mutationKey: ['sources'],
    mutationFn: (sourceData: Source) => createSource(sourceData),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ['sources'] });
    },
  });

  const updateSourceMutation = useMutation({
    mutationKey: ['sources'],
    mutationFn: (sourceData: Source) =>
      updateSource(sourceData.slug, sourceData),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ['sources'] });
    },
  });

  const deleteSourceMutation = useMutation({
    mutationKey: ['sources'],
    mutationFn: (sourceSlug: string) => deleteSource(sourceSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdating) {
      updateSourceMutation.mutate(newSource as Source);
    } else {
      createSourceMutation.mutate(newSource as Source);
    }
  };

  const handleDeleteSource = (sourceSlug: string) => {
    deleteSourceMutation.mutate(sourceSlug);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error loading sources</div>;
  }

  return (
    <Protected>
      <DashboardLayout>
        <Box maxWidth={800} mx="auto" mt={8} p={4}>
          <Heading mb={6}>Sources Management</Heading>
          <Button
            ref={openDrawerBtnRef}
            onClick={handleOpenDrawer}
            mb={4}
            w="full"
            leftIcon={<AddIcon />}
          >
            Add a new source
          </Button>
          <Drawer
            isOpen={isOpen}
            onClose={onClose}
            placement="right"
            finalFocusRef={openDrawerBtnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
                {isUpdating ? 'Update source' : 'Create a new source'}
              </DrawerHeader>

              <DrawerBody>
                <Box
                  as="form"
                  onSubmit={handleFormSubmit}
                  id={CREATE_SOURCES_FORM}
                >
                  <VStack spacing={4} mb={8}>
                    <FormControl isRequired>
                      <FormLabel>Source name</FormLabel>
                      <Input
                        value={newSource.name}
                        onChange={(e) =>
                          setNewSource({ ...newSource, name: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Source URL</FormLabel>
                      <Input
                        value={newSource.baseUrl}
                        onChange={(e) =>
                          setNewSource({
                            ...newSource,
                            baseUrl: e.target.value,
                          })
                        }
                      />
                    </FormControl>
                    <FormControl isReadOnly>
                      <FormLabel>Source slug</FormLabel>
                      <Input value={newSource.slug} />
                    </FormControl>
                  </VStack>
                </Box>
              </DrawerBody>

              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  form={CREATE_SOURCES_FORM}
                  type="submit"
                  colorScheme="blue"
                >
                  Save
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>URL</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sources?.map((source) => (
                <Tr key={source.id}>
                  <Td>{source.name}</Td>
                  <Td>{source.baseUrl}</Td>
                  <Td justifyContent="space-around" display="flex">
                    <Button
                      onClick={() => handleEditSource(source)}
                      colorScheme="blue"
                      size="sm"
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDeleteSource(source.slug)}
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
    </Protected>
  );
}

export default SourcesPage;
