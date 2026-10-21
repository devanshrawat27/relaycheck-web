import { render, screen } from '@testing-library/react';
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

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('business_effect_applied_once')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getAllByText('Passed').length).toBeGreaterThanOrEqual(1);
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

    expect(screen.getAllByText('evt-1').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('503').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/timeout/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/error/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/12 ms/).length).toBeGreaterThanOrEqual(2);
  });

  it('renders honest empty states', () => {
    render(<AssertionsTable assertions={[]} />);
    expect(screen.getByText('No assertions recorded for this run.')).toBeInTheDocument();
  });
});
