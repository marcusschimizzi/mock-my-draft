import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  YAxis,
  XAxis,
  BarChart,
  Bar,
} from 'recharts';
import { EditIcon } from '@chakra-ui/icons';
import { UseFormWatch } from 'react-hook-form';
import { FormValues } from './form-types';
import {
  calculateAverageGrade,
  calculateGradeDistribution,
  getGradeColor,
  prepareTeamGradesData,
} from './utils';
import {
  VStack,
  Box,
  Text,
  IconButton,
  Table,
  Tbody,
  Tr,
  Td,
  Th,
  Accordion,
  AccordionItem,
  Heading,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { Source, Team } from '@/types';

interface ReviewStepProps {
  watch: UseFormWatch<FormValues>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  teams: Team[];
  sources: Source[];
}

const ReviewStep = ({ watch, setStep, teams, sources }: ReviewStepProps) => {
  const title = watch('title');
  const url = watch('url');
  const year = watch('year');
  const sourceId = watch('sourceId');
  const publicationDate = watch('publicationDate');
  const draftClassGrades = watch('draftClassGrades');

  const gradeDistribution = calculateGradeDistribution(draftClassGrades);
  const teamGradesData = prepareTeamGradesData(teams, draftClassGrades);

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">
        Review and Submit
      </Text>

      <Box borderWidth={1} borderRadius="lg" p={4} position="relative">
        <IconButton
          aria-label="Edit source article"
          icon={<EditIcon />}
          size="sm"
          position="absolute"
          top={2}
          right={2}
          onClick={() => setStep(1)}
        />
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          Source article details
        </Text>
        <Table variant="simple" size="sm">
          <Tbody>
            <Tr>
              <Th>Title</Th>
              <Td>{title}</Td>
            </Tr>
            <Tr>
              <Th>URL</Th>
              <Td>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </Td>
            </Tr>
            <Tr>
              <Th>Year</Th>
              <Td>{year}</Td>
            </Tr>
            <Tr>
              <Th>Source</Th>
              <Td>{sources.find((source) => source.id === sourceId)?.name}</Td>
            </Tr>
            <Tr>
              <Th>Publication Date</Th>
              <Td>{publicationDate || 'Not specified'}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Box borderWidth={1} borderRadius="lg" p={4} position="relative">
        <IconButton
          aria-label="Edit draft class grades"
          icon={<EditIcon />}
          size="sm"
          position="absolute"
          top={2}
          right={2}
          onClick={() => setStep(2)}
        />
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          Team draft class grades
        </Text>
        <Accordion allowMultiple>
          {draftClassGrades.map((grade, index) => (
            <AccordionItem key={index}>
              <Heading size="lg">
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Text>
                      {teams.find((team) => team.id === grade.teamId)?.name ||
                        'Unknown'}
                      <Badge ml={2} colorScheme={getGradeColor(grade.grade)}>
                        {grade.grade}
                      </Badge>
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Heading>
              <AccordionPanel pb={4}>
                <Text fontWeight="bold">Comments:</Text>
                <Text>{grade.comments || 'No comments'}</Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>

      <Box borderWidth={1} borderRadius="lg" p={4}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          Data visualizations
        </Text>
        <HStack spacing={4} align="start">
          <Box width="50%">
            <Text textAlign="center">Grade distribution</Text>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getGradeColor(entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box width="50%">
            <Text textAlign="center">Team grades</Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamGradesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="grade">
                  {teamGradesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getGradeColor(entry.grade)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </HStack>
      </Box>

      <Box borderWidth={1} borderRadius="lg" p={4}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          Summary
        </Text>
        <HStack justify={'space-between'} mt={4}>
          <Text>Total teams:</Text>
          <Text fontSize="md" colorScheme="blue">
            {draftClassGrades.length}
          </Text>
        </HStack>
        <HStack justify={'space-between'} mt={4}>
          <Text>Average grade:</Text>
          <Badge
            colorScheme={getGradeColor(calculateAverageGrade(draftClassGrades))}
            fontSize="md"
            ml={2}
          >
            {calculateAverageGrade(draftClassGrades)}
          </Badge>
        </HStack>
      </Box>
    </VStack>
  );
};

export default ReviewStep;
