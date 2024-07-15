import { render } from '@testing-library/react';
import { ChartContext } from '../chart-context';
import { XAxis } from './x-axis';
import { createBandScale, createLinearScale } from '../../../utils/chart-utils';

// Mock D3 axisLeft function
jest.mock('d3-axis', () => ({
  axisBottom: jest.fn(() => ({
    call: jest.fn(),
  })),
}));

// Mock D3 selection function
jest.mock('d3-selection', () => ({
  select: jest.fn(() => ({
    call: jest.fn(),
  })),
}));

// Mock D3 scales
jest.mock('d3-scale', () => ({
  scaleLinear: jest.fn(() => ({
    range: jest.fn().mockReturnThis(),
    domain: jest.fn().mockReturnThis(),
  })),
  scaleBand: jest.fn(() => ({
    range: jest.fn().mockReturnThis(),
    domain: jest.fn().mockReturnThis(),
    padding: jest.fn().mockReturnThis(),
  })),
}));

describe('XAxis', () => {
  test('renders without error', () => {
    const yScale = createLinearScale([0, 100], [0, 100]);
    const xScale = createBandScale(['A', 'B', 'C'], [0, 100]);
    const mockChartContext = {
      yScale,
      data: [],
      width: 100,
      height: 100,
      xScale,
    };
    const { container } = render(
      <svg>
        <ChartContext.Provider value={mockChartContext}>
          <XAxis label="Label" />
        </ChartContext.Provider>
        ,
      </svg>,
    );

    expect(container).toBeInTheDocument();
  });
});
