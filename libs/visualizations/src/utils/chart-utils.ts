import { scaleBand, scaleLinear } from 'd3-scale';

export const createBandScale = (domain: string[], range: [number, number]) => {
  return scaleBand<string>().domain(domain).range(range).padding(0.1);
};

export const createLinearScale = (
  domain: [number, number],
  range: [number, number],
) => {
  return scaleLinear().domain(domain).range(range);
};
