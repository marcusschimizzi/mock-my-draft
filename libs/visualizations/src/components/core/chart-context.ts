import { ScaleBand, ScaleLinear } from 'd3-scale';
import { createContext } from 'react';

export interface DataPoint {
  x: string | number;
  y: number;
}

interface ChartContext {
  data: DataPoint[];
  width: number;
  height: number;
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
}

export const ChartContext = createContext<ChartContext | undefined>(undefined);
