'use client';
import { Loading } from '@/components/loading';
import { Protected } from '@/components/protected';
import { createTeam, deleteTeam, getTeams, updateTeam } from '@/lib/api';
import { queryClient } from '@/lib/react-query';
import { Conference, defaultTeam, Division, Team } from '@/types';
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
  HStack,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
  InputGroup,
  InputRightAddon,
  InputLeftAddon,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import DashboardLayout from '@/layouts/dashboard-layout';

const CREATE_TEAM_FORM = 'create-team-form';

function TeamsPage() {
  const [newTeam, setNewTeam] = useState<Partial<Team>>(defaultTeam);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isUpdating, setIsUpdating] = useState(false);
  const openDrawerBtnRef = useRef<HTMLButtonElement>(null);
  const {
    data: teams,
    isLoading,
    error,
  } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  });

  const divisionOptions = [
    { value: Division.North, label: 'North' },
    { value: Division.South, label: 'South' },
    { value: Division.East, label: 'East' },
    { value: Division.West, label: 'West' },
  ];

  const conferenceOptions = [
    { value: Conference.NFC, label: 'NFC' },
    { value: Conference.AFC, label: 'AFC' },
  ];

  useEffect(() => {
    // Generate slug based on team name
    if (newTeam.name) {
      setNewTeam({
        ...newTeam,
        slug: newTeam.name
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, ''),
      });
    }
  }, [newTeam.name]);

  useEffect(() => {
    // Colors should have at least 2 colors
    if (!newTeam.colors || newTeam.colors.length < 2) {
      setNewTeam({
        ...newTeam,
        colors: ['#000000', '#ffffff'],
      });
    }
  }, [newTeam.colors]);

  const handleAddColor = () => {
    if (newTeam.colors && newTeam.colors.length < 7) {
      setNewTeam({
        ...newTeam,
        colors: [...newTeam.colors, '#000000'],
      });
    }
  };

  const handleRemoveColor = (index: number) => {
    if (newTeam.colors && newTeam.colors.length > 2) {
      const colors = [...newTeam.colors];
      colors.splice(index, 1);
      setNewTeam({
        ...newTeam,
        colors,
      });
    }
  };

  const handleColorChange = (index: number, value: string) => {
    if (newTeam.colors) {
      const colors = [...newTeam.colors];
      colors[index] = value;
      setNewTeam({
        ...newTeam,
        colors,
      });
    }
  };

  const handleEditTeam = (team: Team) => {
    setIsUpdating(true);
    setNewTeam(team);
    onOpen();
  };

  const handleOpenDrawer = () => {
    setIsUpdating(false);
    setNewTeam(defaultTeam);
    onOpen();
  };

  const createTeamMutation = useMutation({
    mutationKey: ['teams'],
    mutationFn: (teamData: Team) => createTeam(teamData),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const updateTeamMutation = useMutation({
    mutationKey: ['teams'],
    mutationFn: (teamData: Team) => updateTeam(teamData.slug, teamData),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationKey: ['teams'],
    mutationFn: (teamSlug: string) => deleteTeam(teamSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const handleCreateTeam = () => {
    createTeamMutation.mutate(newTeam as Team);
  };

  const handleUpdateTeam = () => {
    updateTeamMutation.mutate(newTeam as Team);
  };

  const handleDeleteTeam = (teamSlug: string) => {
    deleteTeamMutation.mutate(teamSlug);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error loading teams</div>;
  }

  return (
    <Protected>
      <DashboardLayout>
        <Box maxWidth={800} mx="auto" mt={8} p={4}>
          <Heading mb={6}>Team Management</Heading>
          <Button
            ref={openDrawerBtnRef}
            onClick={handleOpenDrawer}
            mb={4}
            w="full"
            leftIcon={<AddIcon />}
          >
            Add a new team
          </Button>
          <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={openDrawerBtnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
                {isUpdating ? 'Update team' : 'Create a new team'}
              </DrawerHeader>

              <DrawerBody>
                <Box
                  as="form"
                  onSubmit={isUpdating ? handleUpdateTeam : handleCreateTeam}
                  id={CREATE_TEAM_FORM}
                >
                  <VStack spacing={4} mb={8}>
                    <FormControl isRequired>
                      <FormLabel>Team name</FormLabel>
                      <Input
                        value={newTeam.name}
                        onChange={(e) =>
                          setNewTeam({ ...newTeam, name: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Team abbreviation</FormLabel>
                      <Input
                        value={newTeam.abbreviation}
                        onChange={(e) =>
                          setNewTeam({
                            ...newTeam,
                            abbreviation: e.target.value,
                          })
                        }
                        maxLength={3}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Team nickname</FormLabel>
                      <Input
                        value={newTeam.nickname}
                        onChange={(e) =>
                          setNewTeam({ ...newTeam, nickname: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Team location</FormLabel>
                      <Input
                        value={newTeam.location}
                        onChange={(e) =>
                          setNewTeam({ ...newTeam, location: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Team conference</FormLabel>
                      <Select
                        placeholder="Select conference"
                        value={newTeam.conference}
                        onChange={(e) =>
                          setNewTeam({
                            ...newTeam,
                            conference: e.target.value as Conference,
                          })
                        }
                      >
                        {conferenceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Team division</FormLabel>
                      <Select
                        placeholder="Select division"
                        value={newTeam.division}
                        onChange={(e) =>
                          setNewTeam({
                            ...newTeam,
                            division: e.target.value as Division,
                          })
                        }
                      >
                        {divisionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl isReadOnly>
                      <FormLabel>Team slug</FormLabel>
                      <Input value={newTeam.slug} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Team logo</FormLabel>
                      <HStack>
                        <InputGroup>
                          <Input
                            value={newTeam.logo}
                            onChange={(e) =>
                              setNewTeam({ ...newTeam, logo: e.target.value })
                            }
                          />

                          {newTeam.logo && (
                            <InputRightAddon>
                              <img
                                src={newTeam.logo}
                                alt="Team logo preview"
                                style={{ maxWidth: '24px', maxHeight: '24px' }}
                              />
                            </InputRightAddon>
                          )}
                        </InputGroup>
                      </HStack>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Team colors</FormLabel>
                      <VStack alignItems="start">
                        {newTeam.colors?.map((color, index) => (
                          <InputGroup key={index} mb={2}>
                            <InputLeftAddon
                              paddingInlineEnd="5px"
                              paddingInlineStart="5px"
                            >
                              <Input
                                type="color"
                                value={color}
                                onChange={(e) =>
                                  handleColorChange(index, e.target.value)
                                }
                                padding={0}
                                minWidth="2rem"
                              />
                            </InputLeftAddon>

                            <Input
                              type="text"
                              value={color}
                              onChange={(e) =>
                                handleColorChange(index, e.target.value)
                              }
                            />

                            {(newTeam.colors ?? []).length > 2 && (
                              <InputRightAddon>
                                <Button
                                  onClick={() => handleRemoveColor(index)}
                                  size="sm"
                                >
                                  <DeleteIcon />
                                </Button>
                              </InputRightAddon>
                            )}
                          </InputGroup>
                        ))}
                        {newTeam.colors && newTeam.colors.length < 7 && (
                          <Button
                            onClick={handleAddColor}
                            size="sm"
                            leftIcon={<AddIcon />}
                          >
                            Add color
                          </Button>
                        )}
                      </VStack>
                    </FormControl>
                  </VStack>
                </Box>
              </DrawerBody>

              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  type="submit"
                  form={CREATE_TEAM_FORM}
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
                <Th>Logo</Th>
                <Th>Abbreviation</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {teams?.map((team) => {
                return (
                  <Tr key={team.id}>
                    <Td>{team.name}</Td>
                    <Td>
                      <img
                        src={team.logo}
                        alt={`${team.name} logo`}
                        style={{ maxWidth: '48px', maxHeight: '48px' }}
                      />
                    </Td>
                    <Td>{team.abbreviation}</Td>
                    <Td justifyContent="space-around" display="flex">
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handleEditTeam(team)}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteTeam(team.slug)}
                      >
                        <DeleteIcon />
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </DashboardLayout>
    </Protected>
  );
}

export default TeamsPage;
