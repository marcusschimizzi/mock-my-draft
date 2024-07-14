import { ComponentType, ReactNode, useEffect, useState } from 'react';
import styles from './error-boundary.module.scss';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ErrorBoundary: ComponentType<ErrorBoundaryProps> = ({
  children,
  fallback,
}: ErrorBoundaryProps) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      setError(error.error);
      console.error(`Uncaught error: ${error.error}`);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (error) {
    if (fallback) {
      return fallback;
    }
    return (
      <div className={styles.errorBoundary}>
        <h1>Something went wrong</h1>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {error && error.toString()}
        </details>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;
