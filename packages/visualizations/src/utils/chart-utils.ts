import { scaleBand, scaleLinear } from "d3-scale";

export const createBandScale = (domain: (string | number)[], range: [number, number]) => {
    return scaleBand<string>()
        .domain(domain.map((d) => d.toString()))
        .range(range)
        .padding(0.1);
};

export const createLinearScale = (domain: [number, number], range: [number, number]) => {
    return scaleLinear()
        .domain(domain)
        .range(range);
};

export const createLinearScaleFromData = (data: (string | number)[], range: [number, number]) => {
    return createLinearScale([0, Math.max(...(data.map((d) => Number(d))))], range);
};

export const calculateMargins = (top = 10, right = 10, bottom = 10, left = 10) => {
    return { top, right, bottom, left };
}