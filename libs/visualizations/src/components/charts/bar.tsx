import { useContext } from 'react';
import { ChartContext } from '../core/chart-context';

interface BarProps {
  dataKey: string;
}

export function Bar({ dataKey }: BarProps) {
  const context = useContext(ChartContext);

  if (!context) {
    throw new Error('Bar must be used within a Chart component');
  }

  const { data, xScale, yScale, height } = context;

  return (
    <>
      {data.map((d, i) => (
        <rect
          key={i}
          x={xScale(String(d.x))}
          y={yScale(d.y)}
          width={xScale.bandwidth()}
          height={height - yScale(d.y)}
          fill={'#8884d8'}
        />
      ))}
    </>
  );
}
