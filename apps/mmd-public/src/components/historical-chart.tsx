import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Heading } from '@chakra-ui/react';
import Card from './card';
import { EnhancedTooltip } from './enhanced-tooltip';

interface HistoricalChartProps {
  teamData: Array<{ year: number; grade: number }>;
  leagueAverages: Array<{ year: number; average: number }>;
  teamColor: string;
  teamName: string;
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({
  teamData,
  leagueAverages,
  teamColor,
  teamName,
}) => {
  // Merge team data with league averages, including fields the tooltip expects
  const chartData = teamData.map((td) => ({
    year: td.year,
    teamGrade: td.grade,
    leagueAverage: leagueAverages.find((la) => la.year === td.year)?.average || 0,
    grade: td.grade,
    team: teamName,
  }));

  return (
    <Card>
      <Heading size="md" mb={4}>
        Draft Performance History
      </Heading>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
          <XAxis dataKey="year" stroke="#A0AEC0" />
          <YAxis domain={[0, 4.5]} stroke="#A0AEC0" />
          <Tooltip content={<EnhancedTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="teamGrade"
            stroke={teamColor}
            strokeWidth={3}
            name={teamName}
            dot={{ fill: teamColor, r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="leagueAverage"
            stroke="#718096"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="League Average"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
