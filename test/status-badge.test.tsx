import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/status-badge';
import type { RunStatus } from '@/lib/api';

const LABELS: Record<RunStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  passed: 'Passed',
  failed: 'Failed',
  error: 'Error',
};

describe('StatusBadge', () => {
  it.each(Object.entries(LABELS))('renders the %s status with a visible label', (status, label) => {
    render(<StatusBadge status={status as RunStatus} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('never relies on color alone: label + icon are present', () => {
    render(<StatusBadge status="failed" />);
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('✕')).toHaveAttribute('aria-hidden', 'true');
  });
});
