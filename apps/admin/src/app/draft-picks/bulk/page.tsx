'use client';

import DashboardLayout from '@/layouts/dashboard-layout';
import { useBulkCreateDraftPicks } from '@/lib/draft-picks';
import { useTeams } from '@/lib/teams';
import { CreateDraftPickDto, Team } from '@/types';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  UseFieldArrayAppend,
  useForm,
} from 'react-hook-form';

interface BulkEditDraftPicksFormValues {
  year: number;
  picks: {
    round: number;
    pickNumber: number;
    originalTeamId?: string;
    currentTeamId: string;
  }[];
}

/**
 * Component to render a draft round of picks
 */
function DraftRound({
  control,
  picks,
  errors,
  roundDetails,
  currentRoundDetails,
  onDetailsChange,
  teams,
  appendDraftPick,
}: {
  control: Control<BulkEditDraftPicksFormValues>;
  picks: FieldArrayWithId<BulkEditDraftPicksFormValues, 'picks', 'id'>[];
  errors: FieldErrors<BulkEditDraftPicksFormValues>;
  currentRoundDetails: RoundDetails;
  roundDetails: RoundDetails[];
  onDetailsChange: (details: RoundDetails[]) => void;
  teams: Team[];
  appendDraftPick: UseFieldArrayAppend<BulkEditDraftPicksFormValues, 'picks'>;
}) {
  useEffect(() => {
    console.info(
      `Round ${currentRoundDetails.round} starts at pick ${currentRoundDetails.startPick}`,
    );
  }, [currentRoundDetails]);

  return (
    <VStack spacing={4} align="stretch">
      {Array.from({ length: currentRoundDetails.picks }).map((_, index) => (
        <HStack key={index}>
          <Controller
            name={`picks.${currentRoundDetails.startPick + index - 1}.round`}
            control={control}
            render={({ field }) => (
              <FormControl
                isReadOnly
                isInvalid={!!errors.picks?.[index]?.round}
              >
                <FormLabel>Round</FormLabel>
                <Input
                  {...field}
                  type="number"
                  value={currentRoundDetails.round}
                />
                {errors?.picks?.[index]?.round && (
                  <FormErrorMessage>
                    {errors.picks[index]?.round.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            )}
          />
          <Controller
            name={`picks.${
              currentRoundDetails.startPick + index - 1
            }.pickNumber`}
            control={control}
            render={({ field }) => (
              <FormControl
                isRequired
                isInvalid={!!errors.picks?.[index]?.pickNumber}
                isReadOnly
              >
                <FormLabel>Pick number</FormLabel>
                <Input
                  {...field}
                  type="number"
                  value={currentRoundDetails.startPick + index}
                />
                {errors?.picks?.[index]?.pickNumber && (
                  <FormErrorMessage>
                    {errors.picks[index]?.pickNumber.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            )}
          />
          <Controller
            name={`picks.${
              currentRoundDetails.startPick + index - 1
            }.currentTeamId`}
            control={control}
            rules={{ required: 'Team is required' }}
            render={({ field }) => (
              <FormControl
                isRequired
                isInvalid={
                  !!errors.picks?.[currentRoundDetails.startPick + index]
                    ?.currentTeamId
                }
              >
                <FormLabel>Team</FormLabel>
                <Select {...field}>
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </Select>
                {errors?.picks?.[index]?.currentTeamId && (
                  <FormErrorMessage>
                    {errors.picks[index]?.currentTeamId.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            )}
          />
          <Controller
            name={`picks.${
              currentRoundDetails.startPick + index - 1
            }.originalTeamId`}
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel>Original team</FormLabel>
                <Select {...field}>
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </HStack>
      ))}
      <Button
        onClick={() => {
          appendDraftPick({
            round: currentRoundDetails.round,
            pickNumber:
              currentRoundDetails.startPick + currentRoundDetails.picks,
            currentTeamId: '',
          });
          onDetailsChange(
            roundDetails.map((roundDetail) => {
              if (roundDetail.round === currentRoundDetails.round) {
                return {
                  ...roundDetail,
                  picks: currentRoundDetails.picks + 1,
                };
              }
              if (roundDetail.round > currentRoundDetails.round) {
                return {
                  ...roundDetail,
                  startPick: roundDetail.startPick + 1,
                };
              }
              return roundDetail;
            }),
          );
        }}
        leftIcon={<AddIcon />}
      >
        Add pick
      </Button>
    </VStack>
  );
}

interface RoundDetails {
  round: number;
  picks: number;
  startPick: number;
}

/**
 * Calculate the number of picks before a given round
 * We cannot rely on the number of picks to be round * 32 since compensatory picks can change this
 * Instead, we simply count the picks before the given round
 */
const calculatePicksBeforeRound = (
  roundDetails: RoundDetails[],
  round: number,
) => {
  if (!roundDetails.length || round === 1) {
    return 0;
  }
  return roundDetails
    .filter((roundDetail) => roundDetail.round < round)
    .reduce((acc, roundDetail) => acc + roundDetail.picks, 0);
};

function BulkEditDraftPicksPage() {
  const { teams, isLoading } = useTeams();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<BulkEditDraftPicksFormValues>({
    defaultValues: {
      year: new Date().getFullYear(),
      picks: [],
    },
  });
  const { fields: draftPicks, append: appendDraftPick } = useFieldArray({
    control,
    name: 'picks',
  });
  const [roundDetails, setRoundDetails] = useState<RoundDetails[]>([]);
  const {
    submitAsync,
    isError,
    isLoading: isCreateDraftPicksLoading,
  } = useBulkCreateDraftPicks({});
  const toast = useToast();
  const router = useRouter();

  const onSubmit: SubmitHandler<BulkEditDraftPicksFormValues> = async (
    data,
  ) => {
    try {
      const processedData: CreateDraftPickDto[] = data.picks.map((pick) => ({
        year: data.year,
        round: pick.round,
        pickNumber: pick.pickNumber,
        originalTeamId: pick.originalTeamId ?? pick.currentTeamId,
        currentTeamId: pick.currentTeamId,
      }));
      const { message, successfulPicks, failedPicks } = await submitAsync(
        processedData,
      );
      console.log(message, successfulPicks, failedPicks);
      toast({
        title: 'Draft picks created',
        status: 'success',
        isClosable: true,
        description: `${successfulPicks.length} draft picks created`,
        duration: 5000,
      });
      reset();
      router.push('/draft-picks');
    } catch (error) {
      console.error('Error creating draft picks', error);
      toast({
        title: 'An error occurred',
        description: 'Unable to create draft picks',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <DashboardLayout>
      <Box maxWidth="800px" mx="auto" mt={8} p={4}>
        <Heading mb={6}>Bulk edit draft picks</Heading>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="stretch">
            <Controller
              name="year"
              control={control}
              rules={{ required: 'Year is required' }}
              render={({ field }) => (
                <FormControl isRequired isInvalid={!!errors.year}>
                  <FormLabel>Year</FormLabel>
                  <Input {...field} type="number" />
                  {errors.year && (
                    <FormErrorMessage>{errors.year.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
            <Box>
              <Box>
                {Array.from({ length: roundDetails.length }).map((_, index) => (
                  <Box key={index} p={4} borderWidth={1} borderRadius="md">
                    <Heading size="md">Round {index + 1}</Heading>
                    <DraftRound
                      control={control}
                      picks={draftPicks.filter(
                        (pick) => pick.round === index + 1,
                      )}
                      errors={errors}
                      roundDetails={roundDetails}
                      currentRoundDetails={roundDetails[index]}
                      teams={teams}
                      onDetailsChange={setRoundDetails}
                      appendDraftPick={appendDraftPick}
                    />
                  </Box>
                ))}
              </Box>
              <Button
                onClick={() =>
                  setRoundDetails([
                    ...roundDetails,
                    {
                      round: roundDetails.length + 1,
                      picks: 0,
                      startPick:
                        calculatePicksBeforeRound(
                          roundDetails,
                          roundDetails.length + 1,
                        ) + 1,
                    },
                  ])
                }
                leftIcon={<AddIcon />}
              >
                Add round
              </Button>
            </Box>
          </VStack>
          <Button
            type="submit"
            mt={4}
            isLoading={isCreateDraftPicksLoading || isLoading}
            colorScheme="primary"
          >
            Save
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
}

export default BulkEditDraftPicksPage;
