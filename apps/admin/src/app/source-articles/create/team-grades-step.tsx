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
  SimpleGrid,
} from '@chakra-ui/react';
import { Control, Controller } from 'react-hook-form';
import { FormValues, gradeOptions } from './form-types';
import { DraftClass, DraftPick, Team } from '@/types';
import PlayerGradeCard from './components/player-grade-card';

interface TeamGradesStepProps {
  control: Control<FormValues>;
  teams: Team[];
  draftClasses: DraftClass[];
}

function TeamGradesStep({ control, teams, draftClasses }: TeamGradesStepProps) {
  return (
    <VStack spacing={4} align="stretch">
      {teams.map((team, index) => {
        const draftClass = draftClasses.find(
          (draftClass) => draftClass.teamId === team.id,
        );

        return (
          <Box key={team.id} p={4} borderWidth={1} borderRadius="md">
            <HStack>
              {team?.logo && (
                <Image
                  src={team?.logo || ''}
                  alt="team logo"
                  boxSize="50px"
                  width={50}
                  height={50}
                />
              )}
              <Text fontWeight="bold" fontSize="large">
                {team?.name}
              </Text>
            </HStack>
            <VStack spacing={4} alignItems="flex-start" mt={8}>
              <Controller
                name={`draftClassGrades.${index}.grade`}
                control={control}
                rules={{ required: 'Grade is required' }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl isRequired isInvalid={!!error} maxW={48}>
                    <FormLabel>Grade</FormLabel>
                    <Select {...field}>
                      <option value="">Select a grade</option>
                      {gradeOptions.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </Select>
                    {error && (
                      <FormErrorMessage>{error.message}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name={`draftClassGrades.${index}.comments`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl isInvalid={!!error}>
                    <FormLabel>Comments</FormLabel>
                    <Textarea {...field} minHeight={48} />
                    {error && (
                      <FormErrorMessage>{error.message}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
              <SimpleGrid columns={2} spacing={4} w="full">
                {draftClass?.draftPicks
                  ?.filter((pick) => pick.player !== undefined)
                  .map((draftPick: DraftPick, playerIndex) => (
                    <PlayerGradeCard
                      draftPick={draftPick}
                      control={control}
                      teamIndex={index}
                      playerIndex={playerIndex}
                      key={draftPick.id}
                    />
                  ))}
              </SimpleGrid>
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
}

export default TeamGradesStep;
