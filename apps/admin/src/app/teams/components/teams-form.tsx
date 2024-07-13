import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Select,
  VStack,
} from '@chakra-ui/react';
import { Conference, Division, Team } from '../../../types';
import { useEffect } from 'react';
import { Image } from '@chakra-ui/next-js';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

interface TeamsFormProps {
  team: Partial<Team>;
  onChange: (team: Partial<Team>) => void;
}

function TeamsForm({ onChange, team }: TeamsFormProps) {
  const divisionOptions = [
    { value: Division.East, label: 'East' },
    { value: Division.West, label: 'West' },
    { value: Division.North, label: 'North' },
    { value: Division.South, label: 'South' },
  ];

  const conferenceOptions = [
    { value: Conference.NFC, label: 'NFC' },
    { value: Conference.AFC, label: 'AFC' },
  ];

  useEffect(() => {
    // Generate slug based on team name
    if (team.name) {
      onChange({
        ...team,
        slug: team.name
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, ''),
      });
    }
  }, [team.name]);

  useEffect(() => {
    // Colors should have at least 2 colors
    if (!team.colors || team.colors.length < 2) {
      onChange({
        ...team,
        colors: ['#000000', '#ffffff'],
      });
    }
  }, [team.colors]);

  const handleAddColor = () => {
    if (team.colors && team.colors.length < 7) {
      onChange({
        ...team,
        colors: [...team.colors, '#000000'],
      });
    }
  };

  const handleRemoveColor = (index: number) => {
    if (team.colors && team.colors.length > 2) {
      const colors = [...team.colors];
      colors.splice(index, 1);
      onChange({
        ...team,
        colors,
      });
    }
  };

  const handleColorChange = (index: number, value: string) => {
    if (team.colors) {
      const colors = [...team.colors];
      colors[index] = value;
      onChange({
        ...team,
        colors,
      });
    }
  };

  return (
    <Box as="form">
      <VStack spacing={4} mb={8}>
        <FormControl isRequired>
          <FormLabel>Team name</FormLabel>
          <Input
            value={team.name}
            onChange={(e) => onChange({ ...team, name: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Team abbreviation</FormLabel>
          <Input
            value={team.abbreviation}
            onChange={(e) =>
              onChange({ ...team, abbreviation: e.target.value })
            }
            maxLength={3}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Team nickname</FormLabel>
          <Input
            value={team.nickname}
            onChange={(e) => onChange({ ...team, nickname: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Team location</FormLabel>
          <Input
            value={team.location}
            onChange={(e) => onChange({ ...team, location: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Conference</FormLabel>
          <Select
            placeholder="Select conference"
            value={team.conference}
            onChange={(e) =>
              onChange({
                ...team,
                conference: e.target.value as Conference,
              })
            }
          >
            {conferenceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Division</FormLabel>
          <Select
            placeholder="Select division"
            value={team.division}
            onChange={(e) =>
              onChange({
                ...team,
                division: e.target.value as Division,
              })
            }
          >
            {divisionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isReadOnly>
          <FormLabel>Team slug</FormLabel>
          <Input value={team.slug} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Logo</FormLabel>
          <HStack>
            <InputGroup>
              <Input
                value={team.logo}
                onChange={(e) => onChange({ ...team, logo: e.target.value })}
              />

              {team.logo && (
                <InputRightAddon>
                  <Image
                    src={team.logo}
                    alt="Team logo preview"
                    width={12}
                    height={12}
                  />
                </InputRightAddon>
              )}
            </InputGroup>
          </HStack>
        </FormControl>
        <FormControl>
          <FormLabel>Colors</FormLabel>
          <VStack alignItems="start">
            {team.colors?.map((color, index) => (
              <InputGroup key={index} mb={2}>
                <InputLeftAddon paddingInlineEnd="5px" paddingInlineStart="5px">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    padding={0}
                    minWidth="2rem"
                  />
                </InputLeftAddon>

                <Input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />

                {(team.colors ?? []).length > 2 && (
                  <InputRightAddon>
                    <Button onClick={() => handleRemoveColor(index)} size="sm">
                      <DeleteIcon />
                    </Button>
                  </InputRightAddon>
                )}
              </InputGroup>
            ))}
            {team.colors && team.colors.length < 7 && (
              <Button onClick={handleAddColor} size="sm" leftIcon={<AddIcon />}>
                Add color
              </Button>
            )}
          </VStack>
        </FormControl>
      </VStack>
    </Box>
  );
}

export default TeamsForm;
