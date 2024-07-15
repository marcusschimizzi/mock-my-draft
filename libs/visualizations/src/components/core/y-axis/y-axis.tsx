import { useContext, useEffect, useRef } from 'react';
import { axisLeft } from 'd3-axis';
import { ChartContext } from '../chart-context';
import { select } from 'd3-selection';

export interface AxisProps {
  label?: string;
}

export function YAxis({ label }: AxisProps) {
  const context = useContext(ChartContext);
  const ref = useRef<SVGGElement>(null);

  if (!context) {
    throw new Error('YAxis must be used within a Chart component');
  }

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const { yScale } = context;

    const axis = axisLeft(yScale);
    select(ref.current).call(axis);
  }, [context]);

  return (
    <g ref={ref}>
      {label && (
        <text
          textAnchor="middle"
          transform={`translate(-${context.yScale.range()[0] / 2}, -40)`}
        >
          {label}
        </text>
      )}
    </g>
  );
}
