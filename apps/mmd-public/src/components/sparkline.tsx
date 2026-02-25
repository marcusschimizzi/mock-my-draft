import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Box } from '@chakra-ui/react';

interface SparklineProps {
  data: Array<{ year: number; grade: number }>;
  color?: string;
}

export const Sparkline = React.memo<SparklineProps>(({ data, color = '#4a90e2' }) => {
  return (
    <Box display="inline-block" width="60px" height="24px" verticalAlign="middle">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="grade"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
});

Sparkline.displayName = 'Sparkline';
