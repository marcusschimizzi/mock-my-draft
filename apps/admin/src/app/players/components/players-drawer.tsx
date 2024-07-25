import { useCreatePlayer, useUpdatePlayer } from '@/lib/players';
import { Player, Position } from '@/types';
import { boxShadow } from '@/utils/style-utils';
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
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ComponentType, useState } from 'react';
import {
  Control,
  Controller,
  SubmitHandler,
  useController,
  useForm,
} from 'react-hook-form';
import * as yup from 'yup';

const positionOptions = [
  { value: Position.Quarterback, label: 'Quarterback' },
  { value: Position.RunningBack, label: 'Running back' },
  { value: Position.WideReceiver, label: 'Wide receiver' },
  { value: Position.TightEnd, label: 'Tight end' },
  { value: Position.Center, label: 'Center' },
  { value: Position.Guard, label: 'Guard' },
  { value: Position.Tackle, label: 'Tackle' },
  { value: Position.DefensiveInterior, label: 'Interior defender' },
  { value: Position.EdgeDefender, label: 'Edge defender' },
  { value: Position.Linebacker, label: 'Linebacker' },
  { value: Position.Cornerback, label: 'Cornerback' },
  { value: Position.Safety, label: 'Safety' },
  { value: Position.Kicker, label: 'Kicker' },
  { value: Position.Punter, label: 'Punter' },
];

interface HeightInputProps {
  control: Control<PlayerFormValues>;
  label?: string;
}

const HeightInput: ComponentType<HeightInputProps> = ({
  control,
  label = 'Height',
}) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name: 'height',
    control,
    rules: { required: 'Height is required' },
  });

  const totalInches = value || 0;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;

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
      name={'height'}
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

const PLAYER_FORM_ID = 'player-form';

interface PlayerFormValues {
  name: string;
  position: string;
  college?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
}

const playerFormSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  position: yup.string().required('Position is required'),
  college: yup.string(),
  dateOfBirth: yup.string(),
  height: yup.number().positive('Height must be a positive number'),
  weight: yup.number().positive('Weight must be a positive number'),
});

interface PlayerFormProps {
  player: Partial<Player>;
  onChange: (player: Partial<Player>) => void;
  handleSubmit: (data: PlayerFormValues) => void;
}

function PlayerForm({ player, onChange, handleSubmit }: PlayerFormProps) {
  const {
    handleSubmit: formSubmit,
    control,
    reset,
  } = useForm<PlayerFormValues>({
    resolver: async (data, context, options) => {
      return yupResolver<PlayerFormValues>(playerFormSchema)(
        data,
        context,
        options,
      );
    },
    defaultValues: {
      name: player.name || '',
      position: player.position || '',
      college: player.college || '',
      dateOfBirth: player.dateOfBirth
        ? new Date(player.dateOfBirth).toISOString().split('T')[0]
        : '',
      height: player.height || undefined,
      weight: player.weight || undefined,
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<PlayerFormValues> = (data) => {
    handleSubmit(data);
    reset();
  };

  return (
    <Box as="form" id={PLAYER_FORM_ID} onSubmit={formSubmit(onSubmit)}>
      <VStack spacing={4} align="stretch">
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field, fieldState: { error } }) => (
            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>Name</FormLabel>
              <Input {...field} />
              {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </FormControl>
          )}
        />
        <Controller
          name="position"
          control={control}
          rules={{ required: 'Position is required' }}
          render={({ field, fieldState: { error } }) => (
            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>Position</FormLabel>
              <Select {...field}>
                <option value="">Select a position</option>
                {positionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </FormControl>
          )}
        />
        <Controller
          name="college"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl isInvalid={!!error}>
              <FormLabel>College</FormLabel>
              <Input {...field} />
              {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </FormControl>
          )}
        />
        <Controller
          name="dateOfBirth"
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
        <HeightInput control={control} />
        <Controller
          name="weight"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl isInvalid={!!error}>
              <FormLabel>Weight</FormLabel>
              <InputGroup>
                <Input {...field} type="number" />
                <InputRightAddon>lbs</InputRightAddon>
              </InputGroup>
              {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </FormControl>
          )}
        />
      </VStack>
    </Box>
  );
}

interface PlayersDrawerProps {
  player: Partial<Player>;
  onChange: (player: Partial<Player>) => void;
  isOpen: boolean;
  onClose: () => void;
  toggleBtnRef: React.MutableRefObject<null>;
}

function PlayersDrawer({
  player,
  onChange,
  isOpen,
  onClose,
  toggleBtnRef,
}: PlayersDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const createPlayer = useCreatePlayer({ onSuccess: onClose });
  const updatePlayer = useUpdatePlayer({ onSuccess: onClose });

  const handleSubmit = (data: PlayerFormValues) => {
    setIsSubmitting(true);
    try {
      if (player.id) {
        updatePlayer.submit({
          id: player.id,
          name: data.name,
          position: data.position,
          college: data.college,
          dateOfBirth: data.dateOfBirth,
          height: data.height,
          weight: data.weight,
        });
        toast({
          title: 'Player updated.',
          description: 'The player has been updated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        createPlayer.submit({
          name: data.name,
          position: data.position,
          college: data.college,
          dateOfBirth: data.dateOfBirth,
          height: data.height,
          weight: data.weight,
        });
        toast({
          title: 'Player created.',
          description: 'The player has been created successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: "We couldn't save the player.",
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

        <DrawerHeader>{player.id ? 'Edit player' : 'Add player'}</DrawerHeader>

        <DrawerBody>
          <PlayerForm
            player={player}
            onChange={onChange}
            handleSubmit={handleSubmit}
          />
        </DrawerBody>

        <DrawerFooter>
          <Box w="full" display="flex" justifyContent="space-between">
            <Button
              colorScheme="primary"
              variant="outline"
              size="sm"
              onClick={onClose}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              colorScheme="secondary"
              size="sm"
              isLoading={isSubmitting}
              type="submit"
              form={PLAYER_FORM_ID}
            >
              {player.id ? 'Save' : 'Create'}
            </Button>
          </Box>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default PlayersDrawer;
