import { render } from '@testing-library/react';

import Visualizations from './visualizations';

describe('Visualizations', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Visualizations />);
    expect(baseElement).toBeTruthy();
  });
});
