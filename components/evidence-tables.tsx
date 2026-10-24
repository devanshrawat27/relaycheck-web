import type { AssertionResult, DeliveryAttempt } from '@/lib/api';

export function formatDuration(durationMs: number | null): string {
  if (durationMs === null) {
    return '—';
  }
  return durationMs < 1000 ? `${durationMs} ms` : `${(durationMs / 1000).toFixed(2)} s`;
}

const HEADER_CLASS =
  'px-5 py-3.5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted';

export function AssertionsTable({ assertions }: { assertions: AssertionResult[] }) {
  if (assertions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-sand/30 px-5 py-6 text-xs text-muted">
        No assertions recorded for this run.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <caption className="sr-only">Assertion results</caption>
          <thead>
            <tr className="border-b border-line bg-sand/50">
              <th scope="col" className={HEADER_CLASS}>
                Assertion
              </th>
              <th scope="col" className={HEADER_CLASS}>
                Expected
              </th>
              <th scope="col" className={HEADER_CLASS}>
                Actual
              </th>
              <th scope="col" className={HEADER_CLASS}>
                Result
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {assertions.map((assertion) => (
              <tr
                key={assertion.id}
                className="transition-colors hover:bg-sand/20"
              >
                <td className="px-5 py-3.5 font-mono text-xs font-medium text-ink">
                  {assertion.name}
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-muted">
                  {assertion.expected}
                </td>
                <td
                  className={`px-5 py-3.5 font-mono text-xs font-semibold ${
                    assertion.passed ? 'text-ink' : 'text-danger'
                  }`}
                >
                  {assertion.actual}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
                      assertion.passed
                        ? 'border border-success-border bg-success-soft text-success-dark'
                        : 'border border-danger-border bg-danger-soft text-danger-dark'
                    }`}
                  >
                    <span aria-hidden="true" className="font-bold">
                      {assertion.passed ? '✓' : '✕'}
                    </span>
                    <span>{assertion.passed ? 'Passed' : 'Failed'}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OutcomePill({ outcome }: { outcome: DeliveryAttempt['outcome'] }) {
  const styles: Record<DeliveryAttempt['outcome'], string> = {
    delivered: 'border-success-border bg-success-soft text-success-dark',
    timeout: 'border-warn-border bg-warn-soft text-warn-dark',
    error: 'border-danger-border bg-danger-soft text-danger-dark',
  };
  const icons: Record<DeliveryAttempt['outcome'], string> = {
    delivered: '✓',
    timeout: '⏱',
    error: '✕',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium ${styles[outcome]}`}
    >
      <span aria-hidden="true" className="font-bold">{icons[outcome]}</span>
      <span>{outcome}</span>
    </span>
  );
}

export function AttemptsTable({ attempts }: { attempts: DeliveryAttempt[] }) {
  if (attempts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-sand/30 px-5 py-6 text-xs text-muted">
        No delivery attempts recorded yet.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <caption className="sr-only">Delivery attempts</caption>
          <thead>
            <tr className="border-b border-line bg-sand/50">
              {['#', 'Event ID', 'HTTP', 'Outcome', 'Duration', 'Detail'].map((heading) => (
                <th key={heading} scope="col" className={HEADER_CLASS}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {attempts.map((attempt) => (
              <tr
                key={attempt.id}
                className="transition-colors hover:bg-sand/20"
              >
                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-ink">
                  #{attempt.attemptNumber}
                </td>
                <td className="max-w-[240px] truncate px-5 py-3.5 font-mono text-xs text-muted" title={attempt.eventId}>
                  {attempt.eventId}
                </td>
                <td className="px-5 py-3.5 font-mono text-xs font-bold text-ink">
                  {attempt.httpStatus ?? '—'}
                </td>
                <td className="px-5 py-3.5">
                  <OutcomePill outcome={attempt.outcome} />
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-muted">
                  {formatDuration(attempt.durationMs)}
                </td>
                <td className="max-w-[260px] px-5 py-3.5 text-xs text-muted">
                  {attempt.errorDetail ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
