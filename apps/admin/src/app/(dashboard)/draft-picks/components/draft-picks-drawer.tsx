import { useCreateDraftPick, useUpdateDraftPick } from '@/lib/draft-picks';
import { CreateDraftPickDto, DraftPick, Team } from '@/types';
import { boxShadow } from '@/utils/style-utils';
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

const DRAFT_PICK_FORM_ID = 'draft-pick-form';

interface DraftPickFormValues {
  round: number;
  pickNumber: number;
  year: number;
  originalTeamId?: string;
  currentTeamId: string;
}

const draftPickFormSchema = yup.object().shape({
  round: yup
    .number()
    .required('Round is required')
    .integer('Round must be a whole number'),
  pickNumber: yup
    .number()
    .required('Pick number is required')
    .integer('Pick number must be a whole number'),
  year: yup
    .number()
    .required('Year is required')
    .integer('Year must be a whole number')
    .min(1970, 'Year must be greater than 1970')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  originalTeamId: yup.string(),
  currentTeamId: yup.string().required('Current team is required'),
});

interface DraftPickFormProps {
  draftPick: Partial<CreateDraftPickDto>;
  teams: Team[];
  onChange: (draftPick: Partial<DraftPick>) => void;
  handleSubmit: (data: DraftPickFormValues) => void;
}

function DraftPickForm({
  draftPick,
  teams,
  onChange: _onChange,
  handleSubmit: handleFormSubmit,
}: DraftPickFormProps) {
  const [toggleOriginalTeam, setToggleOriginalTeam] = useState(
    draftPick.originalTeamId &&
      draftPick.originalTeamId !== draftPick.currentTeamId
      ? true
      : false,
  );
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<DraftPickFormValues>({
    resolver: async (data, context, options) => {
      return yupResolver<DraftPickFormValues>(draftPickFormSchema)(
        data,
        context,
        options,
      );
    },
    mode: 'onBlur',
    defaultValues: {
      round: draftPick.round || 1,
      pickNumber: draftPick.pickNumber || 1,
      year: draftPick.year,
      originalTeamId: draftPick.originalTeamId,
      currentTeamId: draftPick.currentTeamId,
    },
  });

  const onSubmit: SubmitHandler<DraftPickFormValues> = async (data) => {
    handleFormSubmit(data);
    reset();
  };

  return (
    <Box as="form" id={DRAFT_PICK_FORM_ID} onSubmit={handleSubmit(onSubmit)}>
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
        <Controller
          name="round"
          control={control}
          rules={{ required: 'Round is required' }}
          render={({ field }) => (
            <FormControl isRequired isInvalid={!!errors.round}>
              <FormLabel>Round</FormLabel>
              <Input {...field} type="number" />
              {errors.round && (
                <FormErrorMessage>{errors.round.message}</FormErrorMessage>
              )}
            </FormControl>
          )}
        />
        <Controller
          name="pickNumber"
          control={control}
          rules={{ required: 'Pick number is required' }}
          render={({ field }) => (
            <FormControl isRequired isInvalid={!!errors.pickNumber}>
              <FormLabel>Pick number</FormLabel>
              <Input {...field} type="number" />
              {errors.pickNumber && (
                <FormErrorMessage>{errors.pickNumber.message}</FormErrorMessage>
              )}
            </FormControl>
          )}
        />
        <Controller
          name="currentTeamId"
          control={control}
          rules={{ required: 'Team is required' }}
          render={({ field }) => (
            <FormControl isRequired isInvalid={!!errors.currentTeamId}>
              <FormLabel>Team</FormLabel>
              <Select {...field}>
                <option value="">Select a team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Select>
              {errors.currentTeamId && (
                <FormErrorMessage>
                  {errors.currentTeamId.message}
                </FormErrorMessage>
              )}
            </FormControl>
          )}
        />
        <Checkbox
          isChecked={toggleOriginalTeam}
          onChange={() => setToggleOriginalTeam(!toggleOriginalTeam)}
        >
          Was pick traded?
        </Checkbox>
        {toggleOriginalTeam && (
          <Controller
            name="originalTeamId"
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
        )}
      </VStack>
    </Box>
  );
}

interface DraftPickDrawerProps {
  draftPick: Partial<CreateDraftPickDto>;
  teams: Team[];
  isOpen: boolean;
  onClose: () => void;
  onChange: (draftPick: Partial<CreateDraftPickDto>) => void;
  toggleBtnRef: React.MutableRefObject<null>;
  selectedDraftPickId: string | null;
}

function DraftPickDrawer({
  draftPick,
  teams,
  isOpen,
  onClose,
  onChange,
  toggleBtnRef,
  selectedDraftPickId,
}: DraftPickDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createDraftPick = useCreateDraftPick({ onSuccess: onClose });
  const updateDraftPick = useUpdateDraftPick({ onSuccess: onClose });
  const toast = useToast();

  const handleFormSubmit = (data: DraftPickFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedDraftPickId) {
        updateDraftPick.submit({ id: selectedDraftPickId, ...data });
        toast({
          title: 'Draft pick updated',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      createDraftPick.submit({
        ...data,
        originalTeamId: data.originalTeamId || data.currentTeamId,
      });
      toast({
        title: 'Draft pick created',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Unable to submit draft pick',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={toggleBtnRef}
      placement="right"
    >
      <DrawerOverlay />
      <DrawerContent
        bg="elevations.light.dp12"
        _dark={{ bg: 'elevations.dark.dp12' }}
        boxShadow={boxShadow(12)}
      >
        <DrawerCloseButton />

        <DrawerHeader>
          {selectedDraftPickId ? 'Edit draft pick' : 'Add draft pick'}
        </DrawerHeader>

        <DrawerBody>
          <DraftPickForm
            draftPick={draftPick}
            teams={teams}
            onChange={onChange}
            handleSubmit={handleFormSubmit}
          />
        </DrawerBody>

        <DrawerFooter>
          <Box w="full" display="flex" justifyContent="space-between">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form={DRAFT_PICK_FORM_ID}
              isLoading={isSubmitting}
            >
              {selectedDraftPickId ? 'Save' : 'Create'}
            </Button>
          </Box>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default DraftPickDrawer;
