import { useContext } from 'react';
import { BarChartContext } from './bar-chart';

interface BarProps {
  dataKey: string;
}

export function Bar({ dataKey }: BarProps) {
  const context = useContext(BarChartContext);

  if (!context) return null;

  const { data, xScale, yScale, height } = context;

  return (
    <>
      {data.map((d, i) => {
        return (
          <rect
            key={i}
            x={xScale(d.team as string)}
            y={yScale(d[dataKey] as number)}
            width={xScale.bandwidth()}
            height={height - yScale(d[dataKey] as number)}
            fill={d.color ? (d.color as string) : 'steelblue'}
          />
        );
      })}
    </>
  );
}

export default Bar;
