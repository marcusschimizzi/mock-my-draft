import { axisLeft } from "d3-axis";
import { select } from "d3-selection";
import { useContext, useEffect, useRef } from "react";
import styles from "./y-axis.module.scss";
import { BarChartContext } from "../../charts/bar-chart/bar-chart";
import { AxisProps } from "../common/types";

export function YAxis({ dataKey, label }: AxisProps) {
    const context = useContext(BarChartContext);
    const ref = useRef<SVGGElement>(null);

    useEffect(() => {
        if (!ref.current || !context) return;

        const { yScale } = context;
        
        const axis = axisLeft(yScale);
        select(ref.current).call(axis);
    }, [context]);

    if (!context) return null;

    return (
        <g ref={ref}>
            {label && (
                <text className={styles.yAxisLabel} textAnchor="middle" transform={`translate(-${context.yScale.range()[0] / 2}, -40)`}>
                    {label}
                </text>
            )}
        </g>
    )
}

export default YAxis;