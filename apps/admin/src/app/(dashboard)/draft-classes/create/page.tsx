'use client';

import { useTeams } from '@/lib/teams';
import {
  CreateDraftPickDto,
  DraftPick,
  Player,
  Team,
  UpdateDraftClassDraftPickDto,
} from '@/types';
import { boxShadow } from '@/utils/style-utils';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
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
  SimpleGrid,
  useToast,
  VStack,
  Text,
  InputGroup,
  InputRightAddon,
  Alert,
  AlertDescription,
  AlertTitle,
  AlertIcon,
} from '@chakra-ui/react';
import { ComponentType, useState } from 'react';
import { positionOptions } from '../../players/components/players-drawer';
import FormStepper from '../../source-articles/create/form-stepper';
import { Loading } from '@/components/loading';
import NavigationButtons from '../../source-articles/create/navigation-buttons';
import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  FieldPath,
  useController,
  UseFormGetValues,
  SubmitHandler,
} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  getDraftClassByYearAndTeamId,
  useCreateDraftClass,
  useUpdateDraftClass,
} from '@/lib/draft-class';

interface InternalDraftPick {
  round?: number;
  pick?: number;
}

const BasicInfoStep = ({
  control,
  teams,
}: {
  control: Control<FormValues>;
  teams: Team[];
}) => {
  return (
    <Box>
      <Heading>Basic info</Heading>
      <Controller
        name="year"
        control={control}
        rules={{ required: 'Year is required' }}
        render={({ field, fieldState: { error } }) => (
          <FormControl mt={8} isInvalid={!!error}>
            <FormLabel>Year</FormLabel>
            <Input
              {...field}
              type="number"
              min={1970}
              max={new Date().getFullYear() + 1}
            />
            {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
          </FormControl>
        )}
      />
      <Controller
        name="team"
        control={control}
        rules={{ required: 'Team is required' }}
        render={({ field, fieldState: { error } }) => (
          <FormControl mt={8} isInvalid={!!error}>
            <FormLabel>Team</FormLabel>
            <Select {...field}>
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Select>
            {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
          </FormControl>
        )}
      />
    </Box>
  );
};

const DraftPicksStep = ({
  picks,
  control,
  addPick,
  removePick,
}: {
  picks: Pick<InternalDraftPick, 'round' | 'pick'>[];
  control: Control<FormValues>;
  addPick: (data: InternalDraftPick) => void;
  removePick: (index: number) => void;
}) => {
  return (
    <VStack align="start">
      <Heading>Draft picks</Heading>
      {picks.map((pick, index) => (
        <HStack
          key={`pick-${index}`}
          spacing={4}
          mt={8}
          w="full"
          justifyContent="space-between"
          alignItems={'center'}
        >
          <Controller
            name={`picks.${index}.round`}
            control={control}
            rules={{ required: 'Round is required' }}
            render={({ field, fieldState: { error } }) => (
              <FormControl isInvalid={!!error}>
                <FormLabel>Round</FormLabel>
                <Input {...field} type="number" />
                {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
          <Controller
            name={`picks.${index}.pick`}
            control={control}
            rules={{ required: 'Pick is required' }}
            render={({ field, fieldState: { error } }) => (
              <FormControl isInvalid={!!error}>
                <FormLabel>Pick</FormLabel>
                <Input {...field} type="number" />
                {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
          <Button onClick={() => removePick(index)} colorScheme="red">
            <DeleteIcon />
          </Button>
        </HStack>
      ))}
      <Button
        onClick={() => addPick({})}
        colorScheme="primary"
        leftIcon={<AddIcon />}
        mt={8}
      >
        Add pick
      </Button>
    </VStack>
  );
};
interface HeightInputProps {
  control: Control<FormValues>;
  label?: string;
  name: FieldPath<FormValues>;
}

const HeightInput: ComponentType<HeightInputProps> = ({
  control,
  name,
  label = 'Height',
}) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: 'Height is required' },
  });
  let inches = 0;
  let feet = 0;

  if (value && typeof value === 'number') {
    const totalInches = value || 0;
    feet = Math.floor(totalInches / 12);
    inches = totalInches % 12;
  }

  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFeet = parseInt(e.target.value, 10) || 0;
    onChange(newFeet * 12 + inches);
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInches = parseInt(e.target.value, 10) || 0;
    onChange(feet * 12 + newInches);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl>
          <FormLabel>{label}</FormLabel>
          <HStack>
            <InputGroup>
              <Input
                {...field}
                type="number"
                onChange={handleFeetChange}
                value={feet}
                min={0}
                max={9}
              />
              <InputRightAddon>ft</InputRightAddon>
            </InputGroup>
            <InputGroup>
              <Input
                {...field}
                type="number"
                onChange={handleInchesChange}
                value={inches}
                min={0}
                max={11}
              />
              <InputRightAddon>in</InputRightAddon>
            </InputGroup>
          </HStack>
          {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
        </FormControl>
      )}
    />
  );
};

const PlayersStep = ({
  players,
  control,
  picks,
}: {
  players: Omit<Player, 'id'>[];
  control: Control<FormValues>;
  picks?: Pick<InternalDraftPick, 'round' | 'pick'>[];
}) => {
  return (
    <VStack align="start">
      <Heading>Players</Heading>
      {(picks ?? []).map((pick, index) => (
        <Box
          w="full"
          key={index}
          mt={8}
          p={4}
          bg="elevations.light.dp04"
          _dark={{ bg: 'elevations.dark.dp04' }}
          boxShadow={boxShadow(4)}
          borderRadius="md"
        >
          <Text fontWeight="bold" mb={2}>
            Round {pick.round}, Pick {pick.pick}
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Controller
              name={`players.${index}.name`}
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <FormLabel>Name</FormLabel>
                  <Input {...field} />
                  {error && (
                    <FormErrorMessage>{error?.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name={`players.${index}.position`}
              control={control}
              rules={{ required: 'Position is required' }}
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <FormLabel>Position</FormLabel>
                  <Select {...field}>
                    <option value="">Select position</option>
                    {positionOptions.map((position) => (
                      <option key={position.value} value={position.value}>
                        {position.label}
                      </option>
                    ))}
                  </Select>
                  {error && (
                    <FormErrorMessage>{error?.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name={`players.${index}.college`}
              control={control}
              rules={{ required: 'College is required' }}
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <FormLabel>College</FormLabel>
                  <Input {...field} />
                  {error && (
                    <FormErrorMessage>{error?.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name={`players.${index}.dateOfBirth`}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <FormLabel>Date of birth</FormLabel>
                  <Input
                    {...field}
                    type="date"
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                </FormControl>
              )}
            />
            <HeightInput control={control} name={`players.${index}.height`} />
            <Controller
              name={`players.${index}.weight`}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <FormLabel>Weight</FormLabel>
                  <InputGroup>
                    <Input {...field} type="number" />
                    <InputRightAddon>lbs</InputRightAddon>
                  </InputGroup>
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name={`players.${index}.armLength`}
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Arm length</FormLabel>
                  <InputGroup>
                    <Input {...field} type="number" />
                    <InputRightAddon>in</InputRightAddon>
                  </InputGroup>
                </FormControl>
              )}
            />
            <Controller
              name={`players.${index}.handSize`}
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Hand size</FormLabel>
                  <InputGroup>
                    <Input {...field} type="number" />
                    <InputRightAddon>in</InputRightAddon>
                  </InputGroup>
                </FormControl>
              )}
            />
            <Controller
              name={`players.${index}.fortyYardDash`}
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>40-yard dash</FormLabel>
                  <InputGroup>
                    <Input {...field} type="number" />
                    <InputRightAddon>s</InputRightAddon>
                  </InputGroup>
                </FormControl>
              )}
            />
            <Controller
              name={`players.${index}.tenYardSplit`}
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>10-yard split</FormLabel>
                  <InputGroup>
                    <Input {...field} type="number" />
                    <InputRightAddon>s</InputRightAddon>
                  </InputGroup>
                </FormControl>
              )}
            />
            <Controller
              name={`players.${index}.twentyYardSplit`}
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>20-yard split</FormLabel>
                  <InputGroup>
                    <Input {...field} type="number" />
                    <InputRightAddon>s</InputRightAddon>
                  </InputGroup>
                </FormControl>
              )}
            />
            <Controller
              name={`players.${index}.twentyYardShuttle`}
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>20-yard shuttle</FormLabel>
                  <InputGroup>
                    <Input {...field} type="number" />
                    <InputRightAddon>s</InputRightAddon>
                  </InputGroup>
                </FormControl>
              )}
            />
            <Controller
              name={`players.${index}.threeConeDrill`}
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>3-cone drill</FormLabel>
                  <InputGroup>
                    <Input {...field} type="number" />
                    <InputRightAddon>s</InputRightAddon>
                  </InputGroup>
                </FormControl>
              )}
            />
            <Controller
              name={`players.${index}.verticalJump`}
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Vertical jump</FormLabel>
                  <InputGroup>
                    <Input {...field} type="number" />
                    <InputRightAddon>in</InputRightAddon>
                  </InputGroup>
                </FormControl>
              )}
            />
            <HeightInput
              control={control}
              name={`players.${index}.broadJump`}
              label="Broad jump"
            />
            <Controller
              name={`players.${index}.benchPress`}
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Bench press</FormLabel>
                  <InputGroup>
                    <Input {...field} type="number" />
                    <InputRightAddon>reps</InputRightAddon>
                  </InputGroup>
                </FormControl>
              )}
            />
          </SimpleGrid>
        </Box>
      ))}
    </VStack>
  );
};

const ReviewStep = ({
  getValues,
  teams,
}: {
  getValues: UseFormGetValues<FormValues>;
  teams: Team[];
}) => {
  const players = getValues('players') ?? [];
  const picks = getValues('picks') ?? [];
  const team = teams.find((team) => team.id === getValues('team'));
  const height = (index: number) => players[index]?.height;
  const formattedDate = (index: number) => {
    const date = players[index]?.dateOfBirth;
    if (!date) return '--';
    const dateObj = new Date(date);
    return `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
  };
  return (
    <VStack align="start" spacing={4} w="full">
      <Text fontSize="xx-large" fontWeight="bolder">
        {getValues('year')} draft class for the {team?.name}
      </Text>
      {!picks || !players ? (
        <Text>No picks or players added</Text>
      ) : (
        <>
          <HStack>
            <Text>Picks: {picks.length}</Text>
            <Text>Players: {players.length}</Text>
          </HStack>
          <SimpleGrid
            spacing={4}
            columns={{ base: 1, md: 2, xl: 3 }}
            w="full"
            mt={8}
          >
            {picks.map((pick, index) => (
              <Box
                key={index}
                p={4}
                bg="elevations.light.dp04"
                borderRadius="md"
                _dark={{ bg: 'elevations.dark.dp04' }}
                boxShadow={boxShadow(4)}
              >
                <VStack key={index} align="start" spacing={4}>
                  <HStack>
                    <Text fontWeight="bold">
                      Round {pick.round}, Pick {pick.pick}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="1.25rem">{players[index]?.name}</Text>
                    <Text fontSize="1.25rem">{players[index]?.position}</Text>
                  </HStack>
                  <Text>
                    Born: <b>{formattedDate(index)}</b>
                  </Text>
                  <Text>
                    College: <b>{players[index]?.college}</b>
                  </Text>
                  <Text>
                    Height:{' '}
                    <b>
                      {!height(index)
                        ? '--'
                        : `${Math.floor((height(index) ?? 0) / 12)}'${
                            (height(index) ?? 0) % 12
                          }"`}
                    </b>
                  </Text>
                  <Text>
                    Weight: <b>{players[index]?.weight} lbs</b>
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </>
      )}
    </VStack>
  );
};

interface FormValues {
  year: number;
  team: string;
  picks?: Pick<InternalDraftPick, 'round' | 'pick'>[];
  players?: Omit<Player, 'id'>[];
}

const playerSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  position: yup.string().required('Position is required'),
  college: yup.string().required('College is required'),
  dateOfBirth: yup.string(),
  height: yup.number(),
  weight: yup.number(),
  armLength: yup.number(),
  handSize: yup.number(),
  fortyYardDash: yup.number(),
  tenYardSplit: yup.number(),
  twentyYardSplit: yup.number(),
  twentyYardShuttle: yup.number(),
  threeConeDrill: yup.number(),
  verticalJump: yup.number(),
  broadJump: yup.number(),
  benchPress: yup.number().integer(),
});

const formSchema = yup.object().shape({
  year: yup
    .number()
    .max(new Date().getFullYear() + 1, 'Draft class cannot be in the future.')
    .min(1970, 'Draft class cannot be before 1970.')
    .required('Year is required'),
  team: yup.string().uuid().required('Team is required'),
  picks: yup.array().of(
    yup.object().shape({
      round: yup.number().required('Round is required'),
      pick: yup.number().required('Pick is required'),
    }),
  ),
  players: yup.array().of(playerSchema.default(undefined)),
});

function DraftClassPage() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { teams, isLoading: teamsLoading } = useTeams();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingPicks, setExistingPicks] = useState<DraftPick[]>([]);
  const toast = useToast();
  const { submitAsync: submitCreateDraftClassAsync } = useCreateDraftClass({});
  const { submitAsync: submitUpdateDraftClassAsync } = useUpdateDraftClass({});

  const steps = [
    { title: 'Basic info', description: 'Enter year and team.' },
    { title: 'Draft picks', description: 'Add draft picks.' },
    { title: 'Players', description: 'Add players to draft picks.' },
    { title: 'Review', description: 'Review and submit.' },
  ];

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    trigger,
    watch,
    getValues,
    formState: { errors, touchedFields },
  } = useForm<FormValues>({
    mode: 'onBlur',
    resolver: async (data, context, options) => {
      return yupResolver<FormValues>(formSchema)(data, context, options);
    },
    defaultValues: {
      year: new Date().getFullYear(),
      team: '',
      picks: [{}],
      players: [{ name: '', position: '', college: '' }],
    },
  });

  const {
    fields: pickFields,
    append: appendPick,
    remove: removePick,
  } = useFieldArray({
    control,
    name: 'picks',
  });

  const { fields: playerFields } = useFieldArray({
    control,
    name: 'players',
  });

  const checkForExistingDraftClass = async (data: {
    year: number;
    team: string;
  }) => {
    setIsLoading(true);

    const response = await getDraftClassByYearAndTeamId(data.year, data.team);

    if (response.draftPicks.length > 0) {
      setValue(
        'picks',
        response.draftPicks.map((pick) => ({
          round: pick.round,
          pick: pick.pickNumber,
        })),
      );
      setValue(
        'players',
        response.draftPicks
          .map((pick) => {
            if (!pick.player || !pick.player.name || !pick.player.position)
              return null;

            const player: Omit<Player, 'id'> = {
              name: pick.player.name,
              position: pick.player.position,
            } as Omit<Player, 'id'>;

            if (pick.player.college) {
              player.college = pick.player.college;
            }
            if (pick.player.dateOfBirth) {
              player.dateOfBirth = pick.player.dateOfBirth;
            }
            if (pick.player.height) {
              player.height = pick.player.height;
            }
            if (pick.player.weight) {
              player.weight = pick.player.weight;
            }
            if (pick.player.armLength) {
              player.armLength = pick.player.armLength;
            }
            if (pick.player.handSize) {
              player.handSize = pick.player.handSize;
            }
            if (pick.player.fortyYardDash) {
              player.fortyYardDash = pick.player.fortyYardDash;
            }
            if (pick.player.tenYardSplit) {
              player.tenYardSplit = pick.player.tenYardSplit;
            }
            if (pick.player.twentyYardSplit) {
              player.twentyYardSplit = pick.player.twentyYardSplit;
            }
            if (pick.player.twentyYardShuttle) {
              player.twentyYardShuttle = pick.player.twentyYardShuttle;
            }
            if (pick.player.threeConeDrill) {
              player.threeConeDrill = pick.player.threeConeDrill;
            }
            if (pick.player.verticalJump) {
              player.verticalJump = pick.player.verticalJump;
            }
            if (pick.player.broadJump) {
              player.broadJump = pick.player.broadJump;
            }
            if (pick.player.benchPress) {
              player.benchPress = pick.player.benchPress;
            }

            return player;
          })
          .filter(
            (player: Omit<Player, 'id'> | null) => player !== null,
          ) as Omit<Player, 'id'>[], // TODO: Fix this type
      );
      setExistingPicks(response.draftPicks);
      setIsEditing(true);
      toast({
        title: 'Draft class found',
        description: 'An existing draft class was found.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
    setStep(1);
  };

  const handleNext = async () => {
    let fieldsToValidate: FieldPath<FormValues>[] = [];
    if (step === 0) {
      fieldsToValidate = ['year', 'team'];
    } else if (step === 1) {
      fieldsToValidate = ['picks'];
    } else if (step === 2) {
      fieldsToValidate = ['players'];
    }
    const isStepValid = await trigger(fieldsToValidate);
    if (!isStepValid) {
      toast({
        title: 'Form is invalid',
        description: 'Please fix the errors before continuing',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      return;
    }
    if (step === 0) {
      checkForExistingDraftClass({
        year: getValues('year'),
        team: getValues('team'),
      });
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    if (step === 1 && isEditing) {
      setIsEditing(false);
    }
    setStep(step - 1);
  };

  const isNextDisabled = () => {
    if (isSubmitting) return true;

    if (step === 0) {
      // Year does not need to be touched, the default is valid
      return !(touchedFields.team && !errors.team && !errors.year);
    }
    return false;
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    setIsSubmitting(true);
    if (!data.picks || !data.players) {
      setIsSubmitting(false);
      return;
    }
    try {
      if (step === steps.length - 1) {
        if (isEditing) {
          await submitUpdateDraftClassAsync({
            year: data.year,
            teamId: data.team,
            data: {
              draftPicks: data.picks?.map((pick, index) => {
                const existingPick = existingPicks.find(
                  (p) => p.round === pick.round && p.pickNumber === pick.pick,
                );
                const existingPlayer = existingPick?.player;
                const mappedPick: UpdateDraftClassDraftPickDto = {
                  round: pick.round,
                  pickNumber: pick.pick,
                  originalTeamId: data.team,
                  currentTeamId: data.team,
                  year: data.year,
                };
                if (existingPick) {
                  mappedPick.id = existingPick.id;
                }
                if (existingPlayer) {
                  mappedPick.playerId = existingPlayer.id;
                  mappedPick.player = {
                    ...existingPlayer,
                    ...data.players?.[index],
                  };
                } else {
                  mappedPick.player = data.players?.[index];
                }
                return mappedPick;
              }),
            },
          });
          toast({
            title: 'Draft class updated!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } else {
          await submitCreateDraftClassAsync({
            year: data.year,
            teamId: data.team,
            draftPicks: data.picks
              .map((pick, index) => {
                if (!pick.round || !pick.pick) return null;
                return {
                  round: pick.round,
                  pickNumber: pick.pick,
                  year: data.year,
                  originalTeamId: data.team,
                  currentTeamId: data.team,
                  player: data.players?.[index],
                };
              })
              .filter((pick) => pick !== null) as CreateDraftPickDto[], // TODO: Fix this type
          });
          toast({
            title: 'Draft class created!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        }
        reset();
        setIsEditing(false);
        setStep(0);
      }
    } catch (error) {
      toast({
        title: 'Error creating draft class',
        description: 'An error occurred while creating the draft class.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (teamsLoading) {
    return <Loading />;
  }

  return (
    <>
      {isEditing && (
        <Alert status="info" mb={8}>
          <AlertIcon />
          <AlertTitle>Existing draft class found</AlertTitle>
          <AlertDescription>
            This draft class already exists. You can edit the picks and players
            below.
          </AlertDescription>
        </Alert>
      )}
      <FormStepper steps={steps} step={step} />
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        maxW="container.lg"
        mx="auto"
      >
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {step === 0 && <BasicInfoStep control={control} teams={teams} />}
            {step === 1 && (
              <>
                <Text>
                  <b>{watch('year')}</b> draft class for the{' '}
                  <b>{teams.find((team) => team.id === watch('team'))?.name}</b>
                </Text>
                <DraftPicksStep
                  control={control}
                  picks={pickFields}
                  addPick={appendPick}
                  removePick={removePick}
                />
              </>
            )}
            {step === 2 && (
              <PlayersStep
                control={control}
                players={playerFields}
                picks={watch('picks')}
              />
            )}
            {step === 3 && <ReviewStep getValues={getValues} teams={teams} />}

            <Box mt={8}>
              <NavigationButtons
                step={step}
                numSteps={steps.length}
                isNextDisabled={isNextDisabled}
                isSubmitting={isSubmitting}
                onBack={handleBack}
                onNext={handleNext}
              />
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

const WrappedDraftClassPage = () => (
  <Box mt={8} p={4} maxWidth="container.xl" mx="auto">
    <DraftClassPage />
  </Box>
);

export default WrappedDraftClassPage;
