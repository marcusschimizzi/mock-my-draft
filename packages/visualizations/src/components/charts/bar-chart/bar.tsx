import { useContext } from "react";
import { BarChartContext } from "./bar-chart";

interface BarProps {
    dataKey: string;
}

export function Bar({ dataKey }: BarProps) {
    const context = useContext(BarChartContext);

    if (!context) return null;

    const { data, xScale, yScale, height } = context;

    return (
        <>
            {data.map((d, i) => (
                <rect
                    key={i}
                    x={xScale(d[xScale.domain()[0]] as string)}
                    y={yScale(d[dataKey] as number)}
                    width={xScale.bandwidth()}
                    height={height - yScale(d[dataKey] as number)
                
                    }
                    fill="steelblue"
                />
            ))}
        </>
    );
}

export default Bar;