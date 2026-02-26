import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { TooltipProps } from 'recharts';
import { getGradeColor } from '../lib/grade-utils';
import { GradeBadge } from './grade-badge';

interface EnhancedTooltipProps extends TooltipProps<number, string> {
  variant?: 'default' | 'premium';
}

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  active,
  payload,
  variant: _variant = 'premium',
}) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const teamColor = getGradeColor(data.grade);

  return (
    <Box
      bg="elevations.dark.dp08"
      borderRadius="lg"
      p={4}
      border="1px solid"
      borderColor={`${teamColor}40`}
      boxShadow={`0 4px 20px ${teamColor}30, 0 0 40px ${teamColor}20`}
      backdropFilter="blur(12px)"
      maxW="280px"
    >
      <VStack align="stretch" spacing={2}>
        <Text fontSize="sm" fontWeight="bold" color={teamColor}>
          {data.team}
        </Text>
        <HStack justify="space-between">
          <Text fontSize="xs" color="gray.400">Average Grade</Text>
          <GradeBadge grade={data.grade} size="sm" />
        </HStack>
        {data.sources && (
          <HStack justify="space-between">
            <Text fontSize="xs" color="gray.400">Sources</Text>
            <Text fontSize="xs" fontWeight="semibold">{data.sources}</Text>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};
