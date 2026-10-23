import type { AssertionResult, DeliveryAttempt } from '@/lib/api';

export function formatDuration(durationMs: number | null): string {
  if (durationMs === null) {
    return '—';
  }
  return durationMs < 1000 ? `${durationMs} ms` : `${(durationMs / 1000).toFixed(2)} s`;
}

const HEADER_CLASS =
  'px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-muted';

export function AssertionsTable({ assertions }: { assertions: AssertionResult[] }) {
  if (assertions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-sand/40 px-5 py-6 text-sm text-muted">
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
            <tr className="border-b border-line bg-sand/60">
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
          <tbody>
            {assertions.map((assertion) => (
              <tr
                key={assertion.id}
                className="border-b border-line/60 transition-colors last:border-b-0 hover:bg-sand/40"
              >
                <td className="px-5 py-3.5 font-mono text-xs text-ink">{assertion.name}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-muted">{assertion.expected}</td>
                <td
                  className={`px-5 py-3.5 font-mono text-xs ${
                    assertion.passed ? 'text-muted' : 'text-danger'
                  }`}
                >
                  {assertion.actual}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      assertion.passed ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
                    }`}
                  >
                    <span aria-hidden="true">{assertion.passed ? '✓' : '✕'}</span>
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
    delivered: 'bg-success-soft text-success',
    timeout: 'bg-warn-soft text-warn',
    error: 'bg-danger-soft text-danger',
  };
  const icons: Record<DeliveryAttempt['outcome'], string> = {
    delivered: '✓',
    timeout: '⏱',
    error: '✕',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[outcome]}`}
    >
      <span aria-hidden="true">{icons[outcome]}</span>
      <span>{outcome}</span>
    </span>
  );
}

export function AttemptsTable({ attempts }: { attempts: DeliveryAttempt[] }) {
  if (attempts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-sand/40 px-5 py-6 text-sm text-muted">
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
            <tr className="border-b border-line bg-sand/60">
              {['#', 'Event ID', 'HTTP', 'Outcome', 'Duration', 'Detail'].map((heading) => (
                <th key={heading} scope="col" className={HEADER_CLASS}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr
                key={attempt.id}
                className="border-b border-line/60 transition-colors last:border-b-0 hover:bg-sand/40"
              >
                <td className="px-5 py-3.5 font-mono text-xs text-ink">
                  {attempt.attemptNumber}
                </td>
                <td className="max-w-[240px] truncate px-5 py-3.5 font-mono text-xs text-muted">
                  {attempt.eventId}
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-ink">
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
