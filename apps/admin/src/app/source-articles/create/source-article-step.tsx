import { Source } from '@/types';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  VStack,
  Text,
} from '@chakra-ui/react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { FormValues } from './form-types';

interface SourceArticleStepProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  sources: Source[];
}

function SourceArticleStep({
  control,
  errors,
  sources,
}: SourceArticleStepProps) {
  return (
    <VStack spacing={4} align="stretch">
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Title is required' }}
        render={({ field }) => (
          <FormControl isRequired isInvalid={!!errors.title}>
            <FormLabel>Title</FormLabel>
            <Input {...field} />
            {errors.title && (
              <FormErrorMessage>{errors.title.message}</FormErrorMessage>
            )}
          </FormControl>
        )}
      />
      <Controller
        name="url"
        control={control}
        rules={{ required: 'URL is required' }}
        render={({ field }) => (
          <FormControl isRequired isInvalid={!!errors.url}>
            <FormLabel>URL</FormLabel>
            <Input {...field} />
            {errors.url && (
              <FormErrorMessage>{errors.url.message}</FormErrorMessage>
            )}
          </FormControl>
        )}
      />
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
        name="sourceId"
        control={control}
        rules={{ required: 'Source is required' }}
        render={({ field }) => (
          <FormControl isRequired isInvalid={!!errors.sourceId}>
            <FormLabel>Source</FormLabel>
            <Select {...field}>
              <option value="">Select a source</option>
              {sources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </Select>
            {errors.sourceId && (
              <FormErrorMessage>{errors.sourceId.message}</FormErrorMessage>
            )}
          </FormControl>
        )}
      />
      <Controller
        name="publicationDate"
        control={control}
        render={({ field }) => (
          <FormControl isInvalid={!!errors.publicationDate}>
            <FormLabel>Publication Date</FormLabel>
            <Input
              {...field}
              type="date"
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.publicationDate && (
              <Text color="red.500">
                <FormErrorMessage>
                  {errors.publicationDate.message}
                </FormErrorMessage>
              </Text>
            )}
          </FormControl>
        )}
      />
    </VStack>
  );
}

export default SourceArticleStep;
