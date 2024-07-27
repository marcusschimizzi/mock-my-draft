import { useEffect } from 'react';
import { Source } from '@/types';
import { Box, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';

interface SourceFormProps {
  source: Partial<Source>;
  onChange: (source: Partial<Source>) => void;
}

function SourceForm({ source, onChange }: SourceFormProps) {
  useEffect(() => {
    // Generate slug based on source name
    if (source.name) {
      onChange({
        ...source,
        slug: source.name
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, ''),
      });
    }
  }, [source.name]);

  return (
    <Box as="form">
      <VStack spacing={4} mb={8}>
        <FormControl isRequired>
          <FormLabel>Source name</FormLabel>
          <Input
            value={source.name}
            onChange={(e) => onChange({ ...source, name: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Base URL</FormLabel>
          <Input
            value={source.baseUrl}
            onChange={(e) => onChange({ ...source, baseUrl: e.target.value })}
          />
        </FormControl>
        <FormControl isReadOnly>
          <FormLabel>Slug</FormLabel>
          <Input value={source.slug} />
        </FormControl>
      </VStack>
    </Box>
  );
}

export default SourceForm;
