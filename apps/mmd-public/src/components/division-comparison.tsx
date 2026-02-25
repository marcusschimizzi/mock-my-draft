import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Heading } from '@chakra-ui/react';
import Card from './card';
import { EnhancedTooltip } from './enhanced-tooltip';

interface DivisionComparisonProps {
  divisionTeams: Array<{
    teamId: string;
    team: string;
    grade: number;
  }>;
  currentTeamId: string;
}

export const DivisionComparison: React.FC<DivisionComparisonProps> = ({
  divisionTeams,
  currentTeamId,
}) => {
  const chartData = divisionTeams.map((dt) => ({
    ...dt,
    isCurrentTeam: dt.teamId === currentTeamId,
  }));

  return (
    <Card>
      <Heading size="md" mb={4}>
        Division Comparison
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="team" angle={-45} textAnchor="end" height={100} />
          <YAxis domain={[0, 4.5]} />
          <Tooltip content={<EnhancedTooltip />} />
          <Bar
            dataKey="grade"
            fill="#4a90e2"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
