import { render, screen, act } from '@testing-library/react';
import ResponsiveContainer from './responsive-container';

// Mock the ResizeObserver API
class ResizeObserverMock {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();

  // Simulate a resize event
  simulateResize(entries: ResizeObserverEntry[]) {
    this.callback(entries, this);
  }
}

global.ResizeObserver = ResizeObserverMock;

const MockChart = ({ width, height }: { width: number; height: number }) => (
  <div data-testid="mock-chart" style={{ width, height }}>
    Width: {width}, Height: {height}
  </div>
);

describe('ResponsiveContainer', () => {
  it('renders the child component', () => {
    render(
      <ResponsiveContainer>
        <MockChart width={0} height={0} />
      </ResponsiveContainer>,
    );

    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
  });

  it('passes the correct dimensions to the child component', () => {
    let resizeObserver: ResizeObserverMock;
    jest
      .spyOn(global, 'ResizeObserver')
      .mockImplementation((callback: ResizeObserverCallback) => {
        resizeObserver = new ResizeObserverMock(callback);
        return resizeObserver;
      });

    render(
      <ResponsiveContainer>
        <MockChart width={0} height={0} />
      </ResponsiveContainer>,
    );

    act(() => {
      resizeObserver?.simulateResize([
        { contentRect: { width: 100, height: 200 } } as ResizeObserverEntry,
      ]);
    });

    expect(screen.getByTestId('mock-chart')).toHaveStyle('width: 100px');
    expect(screen.getByTestId('mock-chart')).toHaveStyle('height: 200px');
  });

  it('applies aspect ratio correctly', () => {
    let resizeObserver: ResizeObserverMock;
    jest
      .spyOn(global, 'ResizeObserver')
      .mockImplementation((callback: ResizeObserverCallback) => {
        resizeObserver = new ResizeObserverMock(callback);
        return resizeObserver;
      });

    render(
      <ResponsiveContainer aspectRatio={16 / 9}>
        <MockChart width={0} height={0} />
      </ResponsiveContainer>,
    );

    act(() => {
      resizeObserver?.simulateResize([
        { contentRect: { width: 1600, height: 1000 } } as ResizeObserverEntry,
      ]);
    });

    expect(screen.getByTestId('mock-chart')).toHaveStyle('width: 1600px');
    expect(screen.getByTestId('mock-chart')).toHaveStyle('height: 900px');
  });

  it('applies min and max dimensions correctly', () => {
    let resizeObserver: ResizeObserverMock;
    jest
      .spyOn(global, 'ResizeObserver')
      .mockImplementation((callback: ResizeObserverCallback) => {
        resizeObserver = new ResizeObserverMock(callback);
        return resizeObserver;
      });

    render(
      <ResponsiveContainer
        minDimensions={{ width: 200, height: 100 }}
        maxDimensions={{ width: 800, height: 600 }}
      >
        <MockChart width={0} height={0} />
      </ResponsiveContainer>,
    );

    // Resize to smaller than min dimensions
    act(() => {
      resizeObserver?.simulateResize([
        { contentRect: { width: 100, height: 50 } } as ResizeObserverEntry,
      ]);
    });

    expect(screen.getByTestId('mock-chart')).toHaveStyle('width: 200px');
    expect(screen.getByTestId('mock-chart')).toHaveStyle('height: 100px');

    // Resize to larger than max dimensions
    act(() => {
      resizeObserver?.simulateResize([
        { contentRect: { width: 1000, height: 700 } } as ResizeObserverEntry,
      ]);
    });

    expect(screen.getByTestId('mock-chart')).toHaveStyle('width: 800px');
    expect(screen.getByTestId('mock-chart')).toHaveStyle('height: 600px');
  });

  it('applies padding correctly', () => {
    let resizeObserver: ResizeObserverMock;
    jest
      .spyOn(global, 'ResizeObserver')
      .mockImplementation((callback: ResizeObserverCallback) => {
        resizeObserver = new ResizeObserverMock(callback);
        return resizeObserver;
      });

    render(
      <ResponsiveContainer
        padding={{ top: 10, right: 20, bottom: 30, left: 40 }}
      >
        <MockChart width={0} height={0} />
      </ResponsiveContainer>,
    );

    act(() => {
      resizeObserver?.simulateResize([
        { contentRect: { width: 100, height: 100 } } as ResizeObserverEntry,
      ]);
    });

    expect(screen.getByTestId('mock-chart')).toHaveStyle('width: 40px');
    expect(screen.getByTestId('mock-chart')).toHaveStyle('height: 60px');
  });

  it('renders error fallback when child throws', () => {
    // Mock console.error to prevent error logs in the test output
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const ErrorComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) {
        throw new Error('Test error');
      }

      return <div>No error</div>;
    };

    const { rerender } = render(
      <ResponsiveContainer
        errorFallback={<div data-testid="error-fallback">:(</div>}
      >
        <ErrorComponent shouldThrow={false} />
      </ResponsiveContainer>,
    );

    rerender(
      <ResponsiveContainer
        errorFallback={<div data-testid="error-fallback">:(</div>}
      >
        <ErrorComponent shouldThrow={true} />
      </ResponsiveContainer>,
    );

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    expect(screen.getByText(':(')).toBeInTheDocument();

    // Restore the original console.error
    console.error = originalConsoleError;
  });
});
