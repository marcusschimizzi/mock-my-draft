import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
import { useContext, useEffect, useRef } from 'react';
import styles from './x-axis.module.scss';
import { AxisProps } from '../common/types';
import { BarChartContext } from '../../charts/bar-chart/bar-chart';

export function XAxis({ type, dataKey, label }: AxisProps) {
    const context = useContext(BarChartContext);
    const ref = useRef<SVGGElement>(null);

    useEffect(() => {
        if (!ref.current || !context) return;

        const { xScale, data } = context;

        if (dataKey) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            xScale.domain(data.map(d => d[dataKey] as string));
        }

        const axis = axisBottom(xScale);
        select(ref.current).call(axis);
    }, [context, type, dataKey]);

    if (!context) return null;

    return (
        <g ref={ref} transform={`translate(0, ${context.height})`}>
            {label && (
                <text
                    textAnchor='middle'
                    transform={`translate(${context.xScale}.range()[1] / 2}, 40)`}
                    className={styles.xAxisLabel}
                >{label}</text>
            )}
        </g>
    );
};

export default XAxis;