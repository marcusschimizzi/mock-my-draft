import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../src/config/theme';
import Nav from '../src/components/nav';

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useMediaQuery: jest.fn(),
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);

describe(Nav.name, () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@chakra-ui/react').useMediaQuery.mockReturnValue([false]);
  });

  it('should render the nav logo', () => {
    renderWithTheme(<Nav />);
    expect(screen.getByText('Mock My Draft')).toBeInTheDocument();
  });

  it('should render hamburger menu on mobile', () => {
    renderWithTheme(<Nav />);
    expect(screen.getByTestId('mobileMenuOpenButton')).toBeInTheDocument();
  });
});
