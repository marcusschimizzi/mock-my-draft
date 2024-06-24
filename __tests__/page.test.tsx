import { render, screen } from '@testing-library/react';
import Nav from '@/components/nav';

describe(Nav.name, () => {
  it('should render the nav logo', () => {
    render(<Nav />);
    expect(screen.getByText('Mock My Draft')).toBeInTheDocument();
  });
});
