import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import Nav from '@/components/nav';

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useMediaQuery: jest.fn(),
}));

describe(Nav.name, () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@chakra-ui/react').useMediaQuery.mockReturnValue([false]);
  });

  it('should render the nav logo', () => {
    render(<Nav />);
    expect(screen.getByText('Mock My Draft')).toBeInTheDocument();
  });

  it('should render hamburger menu on mobile', () => {
    render(<Nav />);
    expect(screen.getByTestId('mobileMenuOpenButton')).toBeInTheDocument();
  });
});
