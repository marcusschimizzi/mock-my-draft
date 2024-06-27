import { render, screen } from '@testing-library/react';
import Nav from '@/components/nav';

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useMediaQuery: jest.fn(),
}));

describe(Nav.name, () => {
  it('should render the nav logo', () => {
    require('@chakra-ui/react').useMediaQuery.mockReturnValue([true]);
    render(<Nav />);
    expect(screen.getByText('Mock My Draft')).toBeInTheDocument();
  });
});
