import { ScaleBand, ScaleLinear } from "d3-scale";
import { calculateMargins, createBandScale, createLinearScaleFromData } from "../../../utils/chart-utils";
import { ReactNode, createContext, useMemo } from "react";

interface DataPoint {
    [key: string]: string | number;
}

interface BarChartProps {
    children: ReactNode;
    data: DataPoint[];
    width: number;
    height: number;
}

interface BarChartContext {
    data: DataPoint[];
    xScale: ScaleBand<string>;
    yScale: ScaleLinear<number, number>;
    width: number;
    height: number;
}

export const BarChartContext = createContext<BarChartContext | null>(null);

export function BarChart({ children, data, width, height }: BarChartProps) {
    const margins = calculateMargins(60, 30, 60, 60);
    const innerWidth = width - margins.left - margins.right;
    const innerHeight = height - margins.top - margins.bottom;
    const xScale = useMemo(() => createBandScale(data.map(d => d.team), [0, innerWidth]), [data, innerWidth]);
    const yScale = useMemo(() => createLinearScaleFromData(data.map(d => d.average), [innerHeight, 0]), [data, innerHeight]);

    const contextValue = useMemo(() => ({
        data,
        xScale,
        yScale,
        width: innerWidth,
        height: innerHeight,
    }), [data, xScale, yScale, innerWidth, innerHeight]);

    return (
        <BarChartContext.Provider value={contextValue}>
            <svg width={width} height={height}>
                <g transform={`translate(${margins.left}, ${margins.top})`}>
                    {children}
                </g>
            </svg>
        </BarChartContext.Provider>
    );
}

export default BarChart;