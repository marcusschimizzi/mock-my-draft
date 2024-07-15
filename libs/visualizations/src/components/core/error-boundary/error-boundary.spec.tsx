import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './error-boundary';

// Mock console.error to prevent error logs in the console
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

const ErrorThrower = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }

  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render default error message when there is an error', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ErrorThrower shouldThrow={false} />
      </ErrorBoundary>,
    );

    rerender(
      <ErrorBoundary>
        <ErrorThrower shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });

  it('should render custom fallback UI when provided and there is an error', () => {
    const fallback = <div>Fallback Component</div>;

    const { rerender } = render(
      <ErrorBoundary fallback={fallback}>
        <ErrorThrower shouldThrow={false} />
      </ErrorBoundary>,
    );

    rerender(
      <ErrorBoundary fallback={fallback}>
        <ErrorThrower shouldThrow={true} />
      </ErrorBoundary>,
    );

    const fallbackComponent = screen.getByText('Fallback Component');
    expect(fallbackComponent).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('should log error to the console', () => {
    const error = new Error('Test error');

    const { rerender } = render(
      <ErrorBoundary>
        <ErrorThrower shouldThrow={false} />
      </ErrorBoundary>,
    );

    rerender(
      <ErrorBoundary>
        <ErrorThrower shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalledWith(`Uncaught error: ${error}`);
  });

  it('should catch runtime errors', () => {
    const ComponentWithRuntimeError = () => {
      return (
        <button
          onClick={() => {
            throw new Error('Runtime error');
          }}
        >
          Trigger error
        </button>
      );
    };

    render(
      <ErrorBoundary>
        <ComponentWithRuntimeError />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByText('Trigger error'));

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Error: Runtime error')).toBeInTheDocument();
  });

  it('should remove event listener on unmount', () => {
    const removeEventListener = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <ErrorBoundary>
        <ErrorThrower shouldThrow={false} />
      </ErrorBoundary>,
    );

    unmount();

    expect(removeEventListener).toHaveBeenCalled();
  });
});
