import { render, screen, within } from '@testing-library/react';
import { AssertionsTable, AttemptsTable } from '@/components/evidence-tables';
import type { AssertionResult, DeliveryAttempt } from '@/lib/api';

const assertion = (
  overrides: Partial<AssertionResult> & Pick<AssertionResult, 'name' | 'passed'>,
): AssertionResult => ({
  id: Math.floor(Math.random() * 10000),
  runId: 'run-1',
  expected: '1',
  actual: '1',
  createdAt: new Date().toISOString(),
  ...overrides,
});

const attempt = (overrides: Partial<DeliveryAttempt>): DeliveryAttempt => ({
  id: Math.floor(Math.random() * 10000),
  runId: 'run-1',
  attemptNumber: 1,
  eventId: 'evt-1',
  httpStatus: 201,
  outcome: 'delivered',
  durationMs: 12,
  errorDetail: null,
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe('Evidence tables (run detail rendering)', () => {
  it('renders assertions with expected, actual, and pass/fail result', () => {
    render(
      <AssertionsTable
        assertions={[
          assertion({
            name: 'business_effect_applied_once',
            expected: '1',
            actual: '3',
            passed: false,
          }),
          assertion({ name: 'deliveries_accepted', passed: true }),
        ]}
      />,
    );

    const table = screen.getByRole('table');
    expect(within(table).getByText('business_effect_applied_once')).toBeInTheDocument();
    expect(within(table).getByText('3')).toBeInTheDocument();
    expect(within(table).getByText('Failed')).toBeInTheDocument();
    expect(within(table).getAllByText('Passed').length).toBeGreaterThanOrEqual(1);
  });

  it('keeps every assertion value readable in the narrow stacked layout', () => {
    const { container } = render(
      <AssertionsTable
        assertions={[
          assertion({ name: 'business_effect_applied_once', expected: '1', actual: '3', passed: false }),
        ]}
      />,
    );

    const stacked = container.querySelector('ul');
    expect(stacked).not.toBeNull();
    expect(within(stacked as HTMLElement).getByText('business_effect_applied_once')).toBeInTheDocument();
    expect(within(stacked as HTMLElement).getByText('1')).toBeInTheDocument();
    expect(within(stacked as HTMLElement).getByText('3')).toBeInTheDocument();
    expect(within(stacked as HTMLElement).getByText('Failed')).toBeInTheDocument();
  });

  it('renders delivery attempts with outcome details', () => {
    render(
      <AttemptsTable
        attempts={[
          attempt({ attemptNumber: 1, httpStatus: 503, outcome: 'error', errorDetail: 'HTTP 503' }),
          attempt({ attemptNumber: 2, httpStatus: undefined, outcome: 'timeout' }),
        ]}
      />,
    );

    const table = screen.getByRole('table');
    expect(within(table).getAllByText('evt-1').length).toBeGreaterThanOrEqual(2);
    expect(within(table).getAllByText('503').length).toBeGreaterThanOrEqual(1);
    expect(within(table).getAllByText(/timeout/).length).toBeGreaterThanOrEqual(1);
    expect(within(table).getAllByText(/error/).length).toBeGreaterThanOrEqual(1);
    expect(within(table).getAllByText(/12 ms/).length).toBeGreaterThanOrEqual(2);
  });

  it('preserves the same event ID across duplicate attempts', () => {
    const shared = 'evt_7eb2f396-8bfb-4369-aaaa-bbbbccccdddd';
    render(
      <AttemptsTable
        attempts={[1, 2, 3].map((attemptNumber) => attempt({ attemptNumber, eventId: shared }))}
      />,
    );
    const table = screen.getByRole('table');
    expect(within(table).getAllByTitle(shared)).toHaveLength(3);
  });

  it('renders honest empty states', () => {
    render(<AssertionsTable assertions={[]} />);
    expect(screen.getByText('No assertions recorded for this run.')).toBeInTheDocument();
  });
});
