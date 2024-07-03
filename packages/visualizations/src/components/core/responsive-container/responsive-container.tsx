import { CSSProperties, ReactElement, ReactNode, cloneElement, isValidElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ErrorBoundary from "../error-boundary/error-boundary";
import React from "react";

interface Dimensions {
    width: number;
    height: number;
}

interface Padding {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface ResponsiveContainerProps {
    children: ReactNode;
    aspectRatio?: number;
    minDimensions?: Partial<Dimensions>;
    maxDimensions?: Partial<Dimensions>;
    padding?: Partial<Padding>;
    id?: string;
    className?: string;
    style?: CSSProperties;
    errorFallback?: ReactElement;
}

export const ResponsiveContainer = ({ children, aspectRatio, minDimensions = {}, maxDimensions = {}, padding = {}, id, className, style, errorFallback }: ResponsiveContainerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

    const paddingValues = useMemo(() => ({
        top: padding.top || 0,
        right: padding.right || 0,
        bottom: padding.bottom || 0,
        left: padding.left || 0,
    }), [padding]);

    const verticalPadding = paddingValues.top + paddingValues.bottom;
    const horizontalPadding = paddingValues.left + paddingValues.right;

    const calculateDimensions = useCallback((entry: ResizeObserverEntry) => {
        let { width, height } = entry.contentRect;

        // Adjust for padding
        width -= horizontalPadding;
        height -= verticalPadding;

        // Adjust for aspect ratio
        if (aspectRatio) {
            const calculatedHeight = width / aspectRatio;
            if (calculatedHeight > height) {
                width = height * aspectRatio;
            } else {
                height = calculatedHeight;
            }
        }

        // Apply min and max dimensions
        width = Math.max(minDimensions.width || 0, Math.min(width, maxDimensions.width || Infinity));
        height = Math.max(minDimensions.height || 0, Math.min(height, maxDimensions.height || Infinity));

        return { width, height };
    }, [aspectRatio, minDimensions, maxDimensions, verticalPadding, horizontalPadding]);

    useEffect(() => {
        const updateDimensions = (entries: ResizeObserverEntry[]) => {
            if (!entries.length) {
                return;
            }
            const newDimensions = calculateDimensions(entries[0]);
            setDimensions(newDimensions);
        }


            const observer = new ResizeObserver(updateDimensions);

            if (containerRef.current) {
                observer.observe(containerRef.current);
            }

            return () => {
                observer.disconnect();
            }
    }, [calculateDimensions]);

    const containerStyle: CSSProperties = {
        width: '100%',
        height: '100%',
        paddingTop: paddingValues.top,
        paddingRight: paddingValues.right,
        paddingBottom: paddingValues.bottom,
        paddingLeft: paddingValues.left,
        ...style
    };

    return (
        <div
            ref={containerRef}
            id={id}
            className={className}
            style={containerStyle}
        >
            <ErrorBoundary fallback={errorFallback}>

                {React.Children.map(children, child =>
                    isValidElement(child) ? cloneElement(child, dimensions) : child
                )}
            </ErrorBoundary>
        </div>
    )
};

export default ResponsiveContainer;