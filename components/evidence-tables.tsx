import type { AssertionResult, DeliveryAttempt } from '@/lib/api';
import { shortEventId } from '@/lib/run-evidence';

export function formatDuration(durationMs: number | null): string {
  if (durationMs === null) {
    return '—';
  }
  return durationMs < 1000 ? `${durationMs} ms` : `${(durationMs / 1000).toFixed(2)} s`;
}

const HEADER_CLASS =
  'px-4 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:px-5';
const NUMERIC_HEADER_CLASS = `${HEADER_CLASS} text-right`;

export function AssertionsTable({ assertions }: { assertions: AssertionResult[] }) {
  if (assertions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-sand/30 px-5 py-6 text-xs text-muted">
        No assertions recorded for this run.
      </div>
    );
  }
  return (
    <>
      {/* Narrow screens: stacked evidence rows keep every value readable. */}
      <ul className="space-y-2 sm:hidden">
        {assertions.map((assertion) => (
          <li
            key={assertion.id}
            className={`rounded-xl border px-4 py-3 ${
              assertion.passed ? 'border-line bg-surface' : 'border-danger-border bg-danger-soft'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <code className="break-all font-mono text-[12px] font-medium text-ink">
                {assertion.name}
              </code>
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${
                  assertion.passed
                    ? 'border-success-border bg-success-soft text-success-dark'
                    : 'border-danger-border bg-danger-soft text-danger-dark'
                }`}
              >
                <span aria-hidden="true">{assertion.passed ? '✓' : '✕'}</span>
                {assertion.passed ? 'Passed' : 'Failed'}
              </span>
            </div>
            <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-muted">
              <div className="flex items-center gap-1.5">
                <dt>expected</dt>
                <dd className="font-semibold text-ink">{assertion.expected}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt>actual</dt>
                <dd className={`font-semibold ${assertion.passed ? 'text-ink' : 'text-danger-dark'}`}>
                  {assertion.actual}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-xl border border-line bg-surface shadow-card sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <caption className="sr-only">Assertion results</caption>
            <thead>
              <tr className="border-b border-line bg-sand/50">
                <th scope="col" className={HEADER_CLASS}>
                  Assertion
                </th>
                <th scope="col" className={NUMERIC_HEADER_CLASS}>
                  Expected
                </th>
                <th scope="col" className={NUMERIC_HEADER_CLASS}>
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
                  className={`transition-colors ${
                    assertion.passed ? 'hover:bg-sand/20' : 'bg-danger-soft/45'
                  }`}
                >
                  <td className="px-4 py-3.5 font-mono text-[12px] font-medium text-ink sm:px-5">
                    {assertion.name}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-[12px] tabular-nums text-muted sm:px-5">
                    {assertion.expected}
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right font-mono text-[12px] font-semibold tabular-nums sm:px-5 ${
                      assertion.passed ? 'text-ink' : 'text-danger-dark'
                    }`}
                  >
                    {assertion.actual}
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
                        assertion.passed
                          ? 'border-success-border bg-success-soft text-success-dark'
                          : 'border-danger-border bg-danger-soft text-danger-dark'
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
    </>
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
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium ${styles[outcome]}`}
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
  const ordered = attempts.slice().sort((a, b) => a.attemptNumber - b.attemptNumber);
  return (
    <>
      {/* Narrow screens: each attempt keeps its full event ID and outcome. */}
      <ul className="space-y-2 sm:hidden">
        {ordered.map((attempt) => (
          <li key={attempt.id} className="rounded-xl border border-line bg-surface px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                Attempt {attempt.attemptNumber}
              </span>
              <OutcomePill outcome={attempt.outcome} />
            </div>
            <code className="mt-2 block break-all font-mono text-[11px] leading-relaxed text-ink-secondary">
              {attempt.eventId}
            </code>
            <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-muted">
              <div className="flex items-center gap-1.5">
                <dt>http</dt>
                <dd className="font-semibold text-ink">{attempt.httpStatus ?? '—'}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt>duration</dt>
                <dd className="text-ink-secondary">{formatDuration(attempt.durationMs)}</dd>
              </div>
            </dl>
            {attempt.errorDetail ? (
              <p className="mt-1.5 text-[11px] leading-relaxed text-danger-dark">{attempt.errorDetail}</p>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-xl border border-line bg-surface shadow-card sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <caption className="sr-only">Delivery attempts</caption>
            <thead>
              <tr className="border-b border-line bg-sand/50">
                <th scope="col" className={HEADER_CLASS}>
                  #
                </th>
                <th scope="col" className={HEADER_CLASS}>
                  Event ID
                </th>
                <th scope="col" className={NUMERIC_HEADER_CLASS}>
                  HTTP
                </th>
                <th scope="col" className={HEADER_CLASS}>
                  Outcome
                </th>
                <th scope="col" className={NUMERIC_HEADER_CLASS}>
                  Duration
                </th>
                <th scope="col" className={HEADER_CLASS}>
                  Detail
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {ordered.map((attempt) => (
                <tr key={attempt.id} className="transition-colors hover:bg-sand/20">
                  <td className="px-4 py-3 font-mono text-[12px] font-semibold tabular-nums text-ink sm:px-5">
                    {attempt.attemptNumber}
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <code
                      title={attempt.eventId}
                      className="whitespace-nowrap font-mono text-[11px] text-ink-secondary"
                    >
                      {shortEventId(attempt.eventId, 18, 8)}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[12px] font-semibold tabular-nums text-ink sm:px-5">
                    {attempt.httpStatus ?? '—'}
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <OutcomePill outcome={attempt.outcome} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-[12px] tabular-nums text-ink-secondary sm:px-5">
                    {formatDuration(attempt.durationMs)}
                  </td>
                  <td className="max-w-[280px] px-4 py-3 text-xs leading-relaxed text-muted sm:px-5">
                    {attempt.errorDetail ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
