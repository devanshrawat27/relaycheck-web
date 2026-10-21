import { render, screen } from '@testing-library/react';
import { RunFilters } from '@/components/run-filters';

describe('RunFilters', () => {
  it('renders all status filters and marks the active one', () => {
    render(<RunFilters active="passed" />);

    expect(screen.getByRole('navigation', { name: 'Filter runs by status' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Passed' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Failed' })).not.toHaveAttribute('aria-current');
  });

  it('marks All as current when no status is active', () => {
    render(<RunFilters active={undefined} />);
    expect(screen.getByRole('link', { name: 'All' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Queued' })).toHaveAttribute(
      'href',
      '/?status=queued',
    );
  });
});
