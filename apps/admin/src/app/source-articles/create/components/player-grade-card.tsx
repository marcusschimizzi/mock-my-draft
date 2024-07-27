import { Control, Controller } from 'react-hook-form';
import { FormValues, gradeOptions } from '../form-types';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  Textarea,
  Text,
} from '@chakra-ui/react';
import { boxShadow } from '@/utils/style-utils';
import { DraftPick } from '@/types';

interface PlayerGradeCardProps {
  control: Control<FormValues>;
  teamIndex: number;
  playerIndex: number;
  draftPick: DraftPick;
}

const PlayerGradeCard = ({
  control,
  teamIndex,
  playerIndex,
  draftPick,
}: PlayerGradeCardProps) => (
  <Box
    p={4}
    borderWidth={1}
    bg="elevations.light.dp04"
    _dark={{ bg: 'elevations.dark.dp04' }}
    boxShadow={boxShadow(4)}
  >
    <Text fontWeight="bold">
      {draftPick.round} - {draftPick.pickNumber}
    </Text>
    <Text>
      {draftPick.player?.name} - {draftPick.player?.position}
    </Text>
    <Controller
      name={`draftClassGrades.${teamIndex}.playerGrades.${playerIndex}.grade`}
      control={control}
      rules={{ required: 'Grade is required' }}
      render={({ field, fieldState: { error } }) => (
        <FormControl isInvalid={!!error} maxW={48}>
          <FormLabel>Grade</FormLabel>
          <Select {...field}>
            <option value="">Select a grade</option>
            {gradeOptions.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </Select>
          {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
        </FormControl>
      )}
    />
    <Controller
      name={`draftClassGrades.${teamIndex}.playerGrades.${playerIndex}.comments`}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl isInvalid={!!error}>
          <FormLabel>Comments</FormLabel>
          <Textarea {...field} minHeight={48} />
          <FormErrorMessage>{error?.message}</FormErrorMessage>
        </FormControl>
      )}
    />
  </Box>
);

export default PlayerGradeCard;
