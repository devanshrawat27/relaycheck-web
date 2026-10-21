import type { AssertionResult, DeliveryAttempt } from '@/lib/api';

export function formatDuration(durationMs: number | null): string {
  if (durationMs === null) {
    return '—';
  }
  return durationMs < 1000 ? `${durationMs} ms` : `${(durationMs / 1000).toFixed(2)} s`;
}

export function AssertionsTable({ assertions }: { assertions: AssertionResult[] }) {
  if (assertions.length === 0) {
    return <p className="text-sm text-neutral-400">No assertions recorded for this run.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-800">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">Assertion results</caption>
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/60 text-xs uppercase tracking-wide text-neutral-400">
            <th scope="col" className="px-4 py-3 font-medium">
              Assertion
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Expected
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Actual
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {assertions.map((assertion) => (
            <tr key={assertion.id} className="border-b border-neutral-800/60 last:border-b-0">
              <td className="px-4 py-3 font-mono text-xs text-neutral-300">{assertion.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-400">{assertion.expected}</td>
              <td
                className={`px-4 py-3 font-mono text-xs ${
                  assertion.passed ? 'text-neutral-400' : 'text-red-300'
                }`}
              >
                {assertion.actual}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    assertion.passed ? 'text-emerald-300' : 'text-red-300'
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
  );
}

export function AttemptsTable({ attempts }: { attempts: DeliveryAttempt[] }) {
  if (attempts.length === 0) {
    return <p className="text-sm text-neutral-400">No delivery attempts recorded yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-800">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <caption className="sr-only">Delivery attempts</caption>
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/60 text-xs uppercase tracking-wide text-neutral-400">
            <th scope="col" className="px-4 py-3 font-medium">
              #
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Event ID
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              HTTP
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Outcome
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Duration
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Detail
            </th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((attempt) => (
            <tr key={attempt.id} className="border-b border-neutral-800/60 last:border-b-0">
              <td className="px-4 py-3 font-mono text-xs text-neutral-300">
                {attempt.attemptNumber}
              </td>
              <td className="max-w-[220px] truncate px-4 py-3 font-mono text-xs text-neutral-400">
                {attempt.eventId}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-400">
                {attempt.httpStatus ?? '—'}
              </td>
              <td className="px-4 py-3 text-xs">
                <span
                  className={
                    attempt.outcome === 'delivered'
                      ? 'text-emerald-300'
                      : attempt.outcome === 'timeout'
                        ? 'text-amber-300'
                        : 'text-red-300'
                  }
                >
                  {attempt.outcome === 'delivered'
                    ? '✓ delivered'
                    : attempt.outcome === 'timeout'
                      ? '⏱ timeout'
                      : '✕ error'}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-neutral-400">
                {formatDuration(attempt.durationMs)}
              </td>
              <td className="max-w-[260px] px-4 py-3 text-xs text-neutral-400">
                {attempt.errorDetail ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
