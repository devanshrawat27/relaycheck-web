import { fireEvent, render, screen } from '@testing-library/react';
import { RunsOverviewContent } from '@/components/runs-overview-content';
import type { RunListItem } from '@/lib/api';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const emptyProps = {
  status: undefined,
  cursor: undefined,
  runs: [],
  nextCursor: null,
  errorMessage: null,
};

const sampleRun: RunListItem = {
  id: 'run-2026-abc12345',
  scenario: 'duplicate_delivery',
  status: 'passed',
  summary: 'Three deliveries verified against one business effect.',
  createdAt: '2026-10-24T08:15:00.000Z',
  finishedAt: '2026-10-24T08:15:01.250Z',
  durationMs: 1250,
};

describe('RunsOverviewContent', () => {
  it('shows a compact first-run guide and clearly illustrative evidence preview with one CTA', () => {
    const { container } = render(<RunsOverviewContent {...emptyProps} />);

    expect(screen.getByRole('heading', { name: 'Evidence for every delivery.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'See what happened. Prove what mattered.' })).toBeInTheDocument();
    expect(screen.getByText('Each delivery, in order')).toBeInTheDocument();
    expect(screen.getByText('Receiver status and timing')).toBeInTheDocument();
    expect(screen.getByText('Assertions and business effect')).toBeInTheDocument();
    expect(screen.getByText('Illustrative · not a recorded run')).toBeInTheDocument();
    expect(screen.getAllByText('Same event ID')).toHaveLength(3);
    expect(screen.getByText('business effect')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Run a scenario' })).toHaveAttribute('href', '/runs/new');
    expect(screen.getAllByRole('link', { name: 'Run a scenario' })).toHaveLength(1);
    expect(container.querySelector('[aria-label="Filter runs by status"]')).toBeInTheDocument();
  });

  it('renders actual run fields and preserves detail and pagination links', () => {
    render(
      <RunsOverviewContent
        status="passed"
        cursor={undefined}
        runs={[sampleRun]}
        nextCursor="older-run"
        errorMessage={null}
      />,
    );

    expect(screen.getByText('duplicate_delivery')).toBeInTheDocument();
    expect(screen.getByText('Passed', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Three deliveries verified against one business effect.')).toBeInTheDocument();
    expect(screen.getByText('1.25 s')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'run-2026' })).toHaveAttribute('href', '/runs/run-2026-abc12345');
    expect(screen.getByRole('link', { name: 'View run run-2026-abc12345' })).toHaveAttribute('href', '/runs/run-2026-abc12345');
    expect(screen.getByRole('link', { name: 'Load older runs' })).toHaveAttribute('href', '/?status=passed&cursor=older-run');
    expect(screen.queryByText('Illustrative · not a recorded run')).not.toBeInTheDocument();
  });

  it('keeps filter-empty and API-error states distinct', () => {
    const { rerender } = render(<RunsOverviewContent {...emptyProps} status="failed" />);
    expect(screen.getByRole('heading', { name: 'No runs match this filter' })).toBeInTheDocument();
    expect(screen.queryByText('Your first run')).not.toBeInTheDocument();

    rerender(<RunsOverviewContent {...emptyProps} errorMessage="Connection refused" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Could not reach the Control API');
    expect(screen.queryByText('Your first run')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'No runs match this filter' })).not.toBeInTheDocument();
  });

  it('keeps the narrow-screen filter controls reachable without making the page wider', () => {
    const { container } = render(<RunsOverviewContent {...emptyProps} />);
    const filters = container.querySelector('[aria-label="Filter runs by status"]');
    expect(filters).toHaveClass('max-w-full', 'overflow-x-auto');
    expect(screen.getByRole('link', { name: 'Running' })).toHaveAttribute('href', '/?status=running');
    fireEvent.click(screen.getByRole('link', { name: 'Failed' }));
    expect(screen.getByRole('link', { name: 'Failed' })).toHaveAttribute('href', '/?status=failed');
  });
});
