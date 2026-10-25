import { render, screen } from '@testing-library/react';
import { EffectVerdictStrip, RunMetrics, VerdictCallout } from '@/components/run-evidence';
import type { RunDetail } from '@/lib/api';
import { describeRun, extraRunNote, scenarioLabel, shortEventId } from '@/lib/run-evidence';

const BASE_RUN: RunDetail = {
  id: 'run_01HQ7EB2F3968BFB4369',
  scenario: 'duplicate_delivery',
  status: 'passed',
  summary: '3 attempts, 3 accepted, 1 business effect',
  createdAt: '2026-10-24T08:15:00.000Z',
  startedAt: '2026-10-24T08:15:00.200Z',
  finishedAt: '2026-10-24T08:15:01.421Z',
  durationMs: 221,
  params: { eventId: 'evt_7eb2f396-8bfb-4369' },
  safeError: null,
  attempts: [
    {
      id: 1,
      runId: 'run_01HQ7EB2F3968BFB4369',
      attemptNumber: 1,
      eventId: 'evt_7eb2f396-8bfb-4369',
      httpStatus: 201,
      outcome: 'delivered',
      durationMs: 49,
      errorDetail: null,
      createdAt: '2026-10-24T08:15:00.400Z',
    },
    {
      id: 2,
      runId: 'run_01HQ7EB2F3968BFB4369',
      attemptNumber: 2,
      eventId: 'evt_7eb2f396-8bfb-4369',
      httpStatus: 201,
      outcome: 'delivered',
      durationMs: 14,
      errorDetail: null,
      createdAt: '2026-10-24T08:15:00.700Z',
    },
    {
      id: 3,
      runId: 'run_01HQ7EB2F3968BFB4369',
      attemptNumber: 3,
      eventId: 'evt_7eb2f396-8bfb-4369',
      httpStatus: 201,
      outcome: 'delivered',
      durationMs: 8,
      errorDetail: null,
      createdAt: '2026-10-24T08:15:01.000Z',
    },
  ],
  assertions: [
    { id: 11, runId: 'r', name: 'delivery_attempt_count', expected: '3', actual: '3', passed: true, createdAt: '' },
    { id: 12, runId: 'r', name: 'deliveries_accepted', expected: '3', actual: '3', passed: true, createdAt: '' },
    { id: 13, runId: 'r', name: 'business_effect_applied_once', expected: '1', actual: '1', passed: true, createdAt: '' },
  ],
};

function withBrokenIdempotency(run: RunDetail): RunDetail {
  return {
    ...run,
    status: 'failed',
    summary: '3 attempts, 3 accepted, 3 business effects',
    assertions: run.assertions.map((assertion) =>
      assertion.name === 'business_effect_applied_once'
        ? { ...assertion, actual: '3', passed: false }
        : assertion,
    ),
  };
}

function running(run: RunDetail): RunDetail {
  return { ...run, status: 'running', attempts: [], assertions: [], durationMs: null, finishedAt: null };
}

describe('describeRun', () => {
  it('derives the verified claim from recorded attempts and the effect assertion', () => {
    const evidence = describeRun(BASE_RUN);
    expect(evidence.label).toBe('Duplicate delivery');
    expect(evidence.attempts).toBe(3);
    expect(evidence.accepted).toBe(3);
    expect(evidence.businessEffects).toBe(1);
    expect(evidence.effectVerdict).toBe('single');
    expect(evidence.headline).toBe('3 delivery attempts → 1 business effect');
    expect(evidence.subline).toBe('3 attempts · 3 accepted · 1 business effect');
    expect(evidence.failedAssertions).toHaveLength(0);
    expect(evidence.terminal).toBe(true);
  });

  it('detects duplicate business effects instead of claiming success', () => {
    const evidence = describeRun(withBrokenIdempotency(BASE_RUN));
    expect(evidence.businessEffects).toBe(3);
    expect(evidence.effectVerdict).toBe('duplicate');
    expect(evidence.headline).toBe('3 delivery attempts → 3 business effects');
    expect(evidence.failedAssertions).toHaveLength(1);
    expect(evidence.failedAssertions[0]?.name).toBe('business_effect_applied_once');
  });

  it('treats a zero effect count as missing rather than verified', () => {
    const run = withBrokenIdempotency(BASE_RUN);
    run.assertions = run.assertions.map((assertion) =>
      assertion.name === 'business_effect_applied_once' ? { ...assertion, actual: '0' } : assertion,
    );
    const evidence = describeRun(run);
    expect(evidence.effectVerdict).toBe('missing');
    expect(evidence.headline).toBe('3 delivery attempts → 0 business effects');
  });

  it('withholds a verdict while the run is still running', () => {
    const evidence = describeRun(running(BASE_RUN));
    expect(evidence.terminal).toBe(false);
    expect(evidence.effectVerdict).toBe('unknown');
    expect(evidence.headline).toBe('0 delivery attempts recorded');
    expect(evidence.subline).toBe('Waiting for the runner to record delivery evidence.');
  });

  it('does not fabricate an effect count when no assertion was recorded', () => {
    const evidence = describeRun({ ...BASE_RUN, assertions: [], status: 'error', safeError: 'boom' });
    expect(evidence.businessEffects).toBeNull();
    expect(evidence.effectVerdict).toBe('unknown');
    expect(evidence.headline).toBe('3 delivery attempts recorded');
  });

  it('labels unknown scenarios without exposing raw slugs', () => {
    expect(scenarioLabel('receiver_timeout')).toBe('Receiver timeout');
    expect(scenarioLabel('custom_fault_mode')).toBe('Custom fault mode');
  });

  it('keeps both ends of a long event ID visible', () => {
    expect(shortEventId('evt_7eb2f396-8bfb-4369-aaaa-bbbbcccc')).toBe(
      'evt_7eb2f396-8…bbcccc',
    );
    expect(shortEventId('evt_short')).toBe('evt_short');
  });
});

describe('Run evidence components', () => {
  it('renders the three separate measurements with real values', () => {
    render(<RunMetrics evidence={describeRun(BASE_RUN)} durationLabel="221 ms" />);
    expect(screen.getByText('Delivery attempts')).toBeInTheDocument();
    expect(screen.getByText('Business effects')).toBeInTheDocument();
    expect(screen.getByText('Total duration')).toBeInTheDocument();
    expect(screen.getByText('221 ms')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('states the verified claim on a passing run', () => {
    render(<EffectVerdictStrip evidence={describeRun(BASE_RUN)} />);
    expect(screen.getByText('3 delivery attempts → 1 business effect')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText(/did not repeat the business effect/)).toBeInTheDocument();
  });

  it('states the failure honestly when the receiver duplicated the effect', () => {
    render(<EffectVerdictStrip evidence={describeRun(withBrokenIdempotency(BASE_RUN))} />);
    expect(screen.getByText('3 delivery attempts → 3 business effects')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText(/receiver is not idempotent/)).toBeInTheDocument();
  });

  it('hides the verdict strip until a run reaches a terminal state', () => {
    const { container } = render(<EffectVerdictStrip evidence={describeRun(running(BASE_RUN))} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('explains a failing assertion with expected and actual values', () => {
    render(
      <VerdictCallout
        evidence={describeRun(withBrokenIdempotency(BASE_RUN))}
        safeError={null}
      />,
    );
    expect(screen.getByText('Execution completed, but the behaviour is wrong')).toBeInTheDocument();
    expect(screen.getByText('business_effect_applied_once')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('separates an execution error from an assertion failure', () => {
    render(
      <VerdictCallout
        evidence={describeRun({ ...BASE_RUN, status: 'error', assertions: [], safeError: 'Receiver unreachable' })}
        safeError="Receiver unreachable"
      />,
    );
    expect(screen.getByText('The scenario could not complete reliably')).toBeInTheDocument();
    expect(screen.getByText('Receiver unreachable')).toBeInTheDocument();
    expect(screen.queryByText(/behaviour is wrong/)).not.toBeInTheDocument();
  });

  it('only adds the API summary when it carries context the page cannot derive', () => {
    expect(extraRunNote(BASE_RUN)).toBeNull();
    expect(extraRunNote({ ...BASE_RUN, summary: '3 attempts, 3 accepted, 1 business effect' })).toBeNull();
    expect(
      extraRunNote({ ...BASE_RUN, summary: 'resumed from 1 attempt' }),
    ).toBe('resumed from 1 attempt');
  });
});
