'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  Textarea,
  useToast,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
} from '@chakra-ui/react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useSources } from '../../../lib/sources';

interface FormData {
  sourceId: string;
  title: string;
  url: string;
  publicationDate: string;
  draftClassGrades: {
    teamId: string;
    grade: string;
    comments: string;
  }[];
  playerGrades: {
    playerId: string;
    grade: string;
    comments: string;
  }[];
}

const SourceArticleForm: React.FC = () => {
  const { sources, isLoading } = useSources();
  const [step, setStep] = useState(0);
  const toast = useToast();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      draftClassGrades: [{ teamId: '', grade: '', comments: '' }],
      playerGrades: [{ playerId: '', grade: '', comments: '' }],
    },
  });
  const {
    fields: draftClassFields,
    append: appendDraftClass,
    remove: removeDraftClass,
  } = useFieldArray({
    control,
    name: 'draftClassGrades',
  });
  const {
    fields: playerFields,
    append: appendPlayer,
    remove: removePlayer,
  } = useFieldArray({
    control,
    name: 'playerGrades',
  });

  const steps = [
    {
      title: 'Article Details',
      description: 'Enter source article information',
    },
    { title: 'Draft Class Grades', description: 'Add grades for each team' },
    {
      title: 'Player Grades',
      description: 'Add grades for individual players',
    },
    { title: 'Review', description: 'Review and submit' },
  ];

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    toast({
      title: 'Form submitted',
      description: "We've received your submission",
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const nextStep = () =>
    setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

  return (
    <Box maxWidth="container.xl" margin="auto" p={5}>
      <Stepper index={step} mb={8}>
        {steps.map((stepInfo, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle>{stepInfo.title}</StepTitle>
              <StepDescription>{stepInfo.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Source</FormLabel>
              <Select {...register('sourceId', { required: true })}>
                <option value="">Select a source</option>
                {sources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input {...register('title', { required: true })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>URL</FormLabel>
              <Input {...register('url', { required: true })} type="url" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Publication Date</FormLabel>
              <Input
                {...register('publicationDate', { required: true })}
                type="date"
              />
            </FormControl>
          </VStack>
        )}

        {step === 1 && (
          <VStack spacing={4} align="stretch">
            {draftClassFields.map((field, index) => (
              <Box key={field.id} p={4} borderWidth={1} borderRadius="md">
                <FormControl isRequired>
                  <FormLabel>Team</FormLabel>
                  <Select
                    {...register(`draftClassGrades.${index}.teamId` as const, {
                      required: true,
                    })}
                  >
                    <option value="">Select a team</option>
                    <option value="1">New England Patriots</option>
                    <option value="2">Buffalo Bills</option>
                    {/* Add more teams as needed */}
                  </Select>
                </FormControl>
                <FormControl isRequired mt={2}>
                  <FormLabel>Grade</FormLabel>
                  <Input
                    {...register(`draftClassGrades.${index}.grade` as const, {
                      required: true,
                    })}
                  />
                </FormControl>
                <FormControl mt={2}>
                  <FormLabel>Comments</FormLabel>
                  <Textarea
                    {...register(`draftClassGrades.${index}.comments` as const)}
                  />
                </FormControl>
                {index > 0 && (
                  <Button mt={2} onClick={() => removeDraftClass(index)}>
                    Remove
                  </Button>
                )}
              </Box>
            ))}
            <Button
              onClick={() =>
                appendDraftClass({ teamId: '', grade: '', comments: '' })
              }
            >
              Add Another Team Grade
            </Button>
          </VStack>
        )}

        {step === 2 && (
          <VStack spacing={4} align="stretch">
            {playerFields.map((field, index) => (
              <Box key={field.id} p={4} borderWidth={1} borderRadius="md">
                <FormControl isRequired>
                  <FormLabel>Player</FormLabel>
                  <Select
                    {...register(`playerGrades.${index}.playerId` as const, {
                      required: true,
                    })}
                  >
                    <option value="">Select a player</option>
                    <option value="1">Tom Brady</option>
                    <option value="2">Patrick Mahomes</option>
                    {/* Add more players as needed */}
                  </Select>
                </FormControl>
                <FormControl isRequired mt={2}>
                  <FormLabel>Grade</FormLabel>
                  <Input
                    {...register(`playerGrades.${index}.grade` as const, {
                      required: true,
                    })}
                  />
                </FormControl>
                <FormControl mt={2}>
                  <FormLabel>Comments</FormLabel>
                  <Textarea
                    {...register(`playerGrades.${index}.comments` as const)}
                  />
                </FormControl>
                {index > 0 && (
                  <Button mt={2} onClick={() => removePlayer(index)}>
                    Remove
                  </Button>
                )}
              </Box>
            ))}
            <Button
              onClick={() =>
                appendPlayer({ playerId: '', grade: '', comments: '' })
              }
            >
              Add Another Player Grade
            </Button>
          </VStack>
        )}

        {step === 3 && (
          <VStack spacing={4} align="stretch">
            <Text fontSize="xl" fontWeight="bold">
              Review Your Submission
            </Text>
            <Text fontSize="large" mt={12}>
              Source info:
            </Text>
            <hr />
            <Text>
              Source:{' '}
              {
                sources.find((source) => source.id === getValues().sourceId)
                  ?.name
              }
            </Text>
            <Text>Title: {getValues().title}</Text>
            <Text>URL: {getValues().url}</Text>
            <Text>Publication Date: {getValues().publicationDate}</Text>
            <Text fontSize="large" mt={12}>
              Draft Class Grades:
            </Text>
            <hr />
            {getValues().draftClassGrades.map((field, index) => (
              <Box key={index}>
                <Text>Team: {field.teamId}</Text>
                <Text>Grade: {field.grade}</Text>
                <Text>Comments: {field.comments}</Text>
              </Box>
            ))}
            <Text fontSize="large" mt={12}>
              Player Grades:
            </Text>
            <hr />
            {getValues().playerGrades.map((field, index) => (
              <Box key={index}>
                <Text>Player: {field.playerId}</Text>
                <Text>Grade: {field.grade}</Text>
                <Text>Comments: {field.comments}</Text>
              </Box>
            ))}
          </VStack>
        )}

        <HStack justifyContent="space-between" mt={8}>
          {step > 0 && <Button onClick={prevStep}>Previous</Button>}
          {step < steps.length - 1 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button type="submit" colorScheme="blue">
              Submit
            </Button>
          )}
        </HStack>
      </form>
    </Box>
  );
};

export default SourceArticleForm;
