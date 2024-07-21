import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Select,
  Textarea,
  VStack,
  Text,
  Image,
} from '@chakra-ui/react';
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
} from 'react-hook-form';
import { FormValues, gradeOptions } from './form-types';
import { Source, Team } from '@/types';

interface TeamGradesStepProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  fields: FieldArrayWithId<FormValues, 'draftClassGrades', 'id'>[];
  teams: Team[];
  sources: Source[];
}

function TeamGradesStep({
  control,
  errors,
  fields,
  teams,
  sources,
}: TeamGradesStepProps) {
  return (
    <VStack spacing={4} align="stretch">
      {fields.map((field, index) => (
        <Box key={field.id} p={4} borderWidth={1} borderRadius="md">
          <HStack>
            {teams.find((team) => team.id === field.teamId)?.logo && (
              <Image
                src={teams.find((team) => team.id === field.teamId)?.logo || ''}
                alt="team logo"
                boxSize="50px"
                width={50}
                height={50}
              />
            )}
            <Text fontWeight="bold" fontSize="large">
              {teams.find((team) => team.id === field.teamId)?.name}
            </Text>
          </HStack>
          <VStack spacing={4} alignItems="flex-start" mt={8}>
            <Controller
              name={`draftClassGrades.${index}.grade`}
              control={control}
              rules={{ required: 'Grade is required' }}
              render={({ field }) => (
                <FormControl
                  isRequired
                  isInvalid={!!errors.draftClassGrades?.[index]?.grade}
                  maxW={48}
                >
                  <FormLabel>Grade</FormLabel>
                  <Select {...field}>
                    <option value="">Select a grade</option>
                    {gradeOptions.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </Select>
                  {errors.draftClassGrades?.[index]?.grade && (
                    <FormErrorMessage>
                      {errors.draftClassGrades?.[index]?.grade.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name={`draftClassGrades.${index}.comments`}
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Comments</FormLabel>
                  <Textarea {...field} minHeight={48} />
                </FormControl>
              )}
            />
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}

export default TeamGradesStep;
