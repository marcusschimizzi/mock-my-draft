import { useContext, useEffect, useRef } from 'react';
import { ChartContext } from '../chart-context';
import { AxisProps } from '../y-axis/y-axis';
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';

export function XAxis({ label }: AxisProps) {
  const context = useContext(ChartContext);
  const ref = useRef<SVGGElement>(null);

  if (!context) {
    throw new Error('XAxis must be used within a Chart component');
  }

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const { xScale } = context;

    const axis = axisBottom(xScale);
    select(ref.current).call(axis);
  });

  return (
    <g ref={ref} transform={`translate(0, ${context.height})`}>
      {label && (
        <text
          textAnchor="middle"
          transform={`translate(${context.xScale.range()[1] / 2}, 40)`}
        >
          {label}
        </text>
      )}
    </g>
  );
}
