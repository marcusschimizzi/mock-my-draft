import { CSSProperties, ReactNode, forwardRef, useEffect, useRef, useState } from "react";

interface ResponsiveContainerProps {
    children: (width: number, height: number) => ReactNode;
    aspectRatio?: number;
    id?: string;
    className?: string;
    style?: CSSProperties;
}

export const ResponsiveContainer = forwardRef<HTMLDivElement, ResponsiveContainerProps>(({ children, aspectRatio, id, className, style }: ResponsiveContainerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = (entries: ResizeObserverEntry[]) => {
            if (!entries.length) {
                return;
            }

            const { width, height } = entries[0].contentRect;
            const calculatedHeight = aspectRatio ? width / aspectRatio : height;

            setDimensions({
                width,
                height: calculatedHeight,
            });
        }

            const observer = new ResizeObserver(updateDimensions);

            if (containerRef.current) {
                observer.observe(containerRef.current);
            }

            return () => {
                observer.disconnect();
            }
    }, [aspectRatio]);

    return (
        <div
            ref={containerRef}
            id={id}
            className={className}
            style={{
                width: '100%',
                height: '100%',
                ...style,
            }}
        >
            {children(dimensions.width, dimensions.height)}
        </div>
    )
});

export default ResponsiveContainer;