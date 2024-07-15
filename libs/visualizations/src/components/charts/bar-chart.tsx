import { ReactNode, useMemo } from 'react';
import { ChartContext, DataPoint } from '../core/chart-context';
import { createBandScale, createLinearScale } from '../../utils/chart-utils';

interface BarChartProps {
  children: ReactNode;
  data: DataPoint[];
  width: number;
  height: number;
}

export function BarChart({ children, data, width, height }: BarChartProps) {
  const margins = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margins.left - margins.right;
  const innerHeight = height - margins.top - margins.bottom;
  const xScale = useMemo(
    () =>
      createBandScale(
        data.map((d) => String(d.x)),
        [0, innerWidth],
      ),
    [data, innerWidth],
  );
  const yScale = useMemo(
    () =>
      createLinearScale(
        [0, Math.max(...data.map((d) => d.y))],
        [innerHeight, 0],
      ),
    [data, innerHeight],
  );

  const context = useMemo(
    () => ({
      data,
      xScale,
      yScale,
      width: innerWidth,
      height: innerHeight,
    }),
    [data, xScale, yScale, innerWidth, innerHeight],
  );

  return (
    <ChartContext.Provider value={context}>
      <svg width={width} height={height}>
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          {children}
        </g>
      </svg>
    </ChartContext.Provider>
  );
}
