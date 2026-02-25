import { HStack, Select, Button, ButtonGroup } from '@chakra-ui/react';
import Card from './card';

interface FilterBarProps {
  conference: 'all' | 'afc' | 'nfc';
  sortBy: 'grade' | 'name' | 'consensus';
  onConferenceChange: (conference: 'all' | 'afc' | 'nfc') => void;
  onSortChange: (sortBy: 'grade' | 'name' | 'consensus') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  conference,
  sortBy,
  onConferenceChange,
  onSortChange,
}) => {
  return (
    <Card variant="elevated" mb={6}>
      <HStack spacing={4} flexWrap="wrap">
        <Select
          value={conference}
          onChange={(e) => onConferenceChange(e.target.value as 'all' | 'afc' | 'nfc')}
          maxW="200px"
        >
          <option value="all">All Conferences</option>
          <option value="afc">AFC</option>
          <option value="nfc">NFC</option>
        </Select>

        <ButtonGroup isAttached variant="outline" size="sm">
          <Button
            onClick={() => onSortChange('grade')}
            colorScheme={sortBy === 'grade' ? 'blue' : 'gray'}
          >
            By Grade
          </Button>
          <Button
            onClick={() => onSortChange('consensus')}
            colorScheme={sortBy === 'consensus' ? 'blue' : 'gray'}
          >
            By Consensus
          </Button>
          <Button
            onClick={() => onSortChange('name')}
            colorScheme={sortBy === 'name' ? 'blue' : 'gray'}
          >
            By Name
          </Button>
        </ButtonGroup>
      </HStack>
    </Card>
  );
};
