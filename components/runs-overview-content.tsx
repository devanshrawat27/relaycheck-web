import Link from 'next/link';
import { ErrorPanel } from '@/components/error-panel';
import { RunFilters } from '@/components/run-filters';
import { StatusBadge } from '@/components/status-badge';
import { Metric, Panel, SectionHeading } from '@/components/ui';
import { buttonPrimary } from '@/lib/ui';
import type { MetricsResponse, RunListItem, RunStatus } from '@/lib/api';
import { scenarioLabel } from '@/lib/run-evidence';

interface RunsOverviewContentProps {
  status: RunStatus | undefined;
  cursor: string | undefined;
  runs: RunListItem[];
  nextCursor: string | null;
  errorMessage: string | null;
  metrics?: MetricsResponse | null;
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

function formatDuration(durationMs: number | null): string {
  if (durationMs === null) return '—';
  return durationMs < 1000 ? `${durationMs} ms` : `${(durationMs / 1000).toFixed(2)} s`;
}

function OverviewStrip({ metrics }: { metrics: MetricsResponse }) {
  const runs = metrics.runs;
  const queueUnavailable = metrics.queues.work < 0;
  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/70 px-4 py-3 sm:px-5">
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
          Operational overview
        </h2>
        <span className="font-mono text-[10px] text-muted">
          Snapshot {new Date(metrics.generatedAt).toLocaleTimeString('en-GB')}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-line/70 sm:grid-cols-4">
        <Metric label="Passed" value={String(runs.passed ?? 0)} tone="success" />
        <Metric label="Failed" value={String(runs.failed ?? 0)} tone="danger" />
        <Metric label="Error" value={String(runs.error ?? 0)} tone="warn" />
        <Metric label="Queued" value={String(runs.queued ?? 0)} tone="neutral" />
        <Metric
          label="Work queue"
          value={queueUnavailable ? '—' : String(metrics.queues.work)}
          detail={queueUnavailable ? 'Broker unreachable' : 'Jobs awaiting runner'}
          tone={queueUnavailable ? 'warn' : 'neutral'}
        />
        <Metric
          label="Dead-letter"
          value={String(metrics.queues.deadLetter)}
          tone={metrics.queues.deadLetter > 0 ? 'warn' : 'neutral'}
        />
        <Metric
          label="Outbox pending"
          value={String(metrics.outbox.pending)}
          tone={metrics.outbox.pending > 0 ? 'warn' : 'neutral'}
        />
        <Metric
          label="Outbox failed"
          value={String(metrics.outbox.failed)}
          tone={metrics.outbox.failed > 0 ? 'danger' : 'neutral'}
        />
      </div>
    </Panel>
  );
}

function FirstRunPreview() {
  return (
    <div className="rounded-lg border border-line bg-sand/40 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/70 pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Delivery evidence</p>
        <span className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          Illustrative · not a recorded run
        </span>
      </div>
      <div className="grid gap-4 pt-4 sm:grid-cols-[1fr_auto_0.78fr] sm:items-center">
        <div className="space-y-2" aria-label="Three illustrative deliveries">
          {[1, 2, 3].map((attempt) => (
            <div key={attempt} className="flex items-center gap-2.5 rounded-md border border-line bg-surface px-3 py-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[9px] text-muted">
                {attempt}
              </span>
              <span className="font-mono text-[10px] text-ink-secondary">Same event ID</span>
              <span className="ml-auto text-[9px] text-muted">delivery</span>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="hidden h-px w-8 bg-line sm:block" />
        <div className="flex items-center justify-between gap-3 rounded-md border border-ember-border bg-ember-soft px-3 py-3 sm:block sm:text-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ember-dark">Receiver outcome</span>
          <span className="block text-2xl font-semibold text-ember-dark">1</span>
          <span className="font-mono text-[9px] text-ember-dark">business effect</span>
        </div>
      </div>
    </div>
  );
}

function FirstRunEmptyState() {
  return (
    <Panel className="grid gap-6 p-5 sm:grid-cols-[0.9fr_1.1fr] sm:gap-8 sm:p-7">
      <div className="flex flex-col justify-center">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ember-dark">
          Your first run
        </p>
        <h3 id="first-run-title" className="mt-2 text-xl font-semibold leading-tight tracking-tight text-ink">
          See what happened. Prove what mattered.
        </h3>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
          A scenario run keeps the delivery trail and receiver outcome together, so you can verify
          behavior from evidence instead of guesswork.
        </p>
        <ol className="mt-4 grid gap-2 border-t border-line/80 pt-4 text-xs text-ink/85 sm:grid-cols-3 sm:gap-3">
          <li>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ember-dark">01 · Attempts</span>
            <span className="mt-1 block text-muted">Each delivery, in order</span>
          </li>
          <li>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ember-dark">02 · Responses</span>
            <span className="mt-1 block text-muted">Receiver status and timing</span>
          </li>
          <li>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ember-dark">03 · Verification</span>
            <span className="mt-1 block text-muted">Assertions and business effect</span>
          </li>
        </ol>
        <p className="mt-3 text-xs text-muted">
          Start with <span className="font-medium text-ink">Run a scenario</span> above to record your
          first run.
        </p>
      </div>
      <div className="flex items-center">
        <FirstRunPreview />
      </div>
    </Panel>
  );
}

function NoMatchesState() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed border-line px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div>
        <h3 className="text-sm font-medium text-ink">No runs match this filter</h3>
        <p className="mt-0.5 text-xs text-muted">Try another status to see more history.</p>
      </div>
      <Link href="/" className="w-fit text-xs font-semibold text-ember-dark underline-offset-4 hover:underline">
        Show all runs →
      </Link>
    </div>
  );
}

function RunsTable({ runs }: { runs: RunListItem[] }) {
  return (
    <>
      {/* Narrow screens: one card per run keeps status, time, and the detail link visible. */}
      <ul className="space-y-2 sm:hidden">
        {runs.map((run) => (
          <li key={run.id} className="overflow-hidden rounded-xl border border-line bg-surface">
            <Link href={`/runs/${run.id}`} className="block px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[15px] font-medium leading-snug text-ink">
                  {scenarioLabel(run.scenario)}
                </span>
                <StatusBadge status={run.status} />
              </div>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                {run.id.slice(0, 8)} · {formatTimestamp(run.createdAt)}
              </p>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                {run.summary ?? '—'}
              </p>
              <div className="mt-2.5 flex items-center justify-between font-mono text-[11px] text-muted">
                <span>{formatDuration(run.durationMs)}</span>
                <span className="font-semibold text-ember-dark">Details →</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-xl border border-line bg-surface sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[740px] border-collapse text-left">
            <caption className="sr-only">Recent scenario runs</caption>
            <thead>
              <tr className="border-b border-line bg-sand/50">
                {['Scenario', 'Run ID', 'Status', 'Created', 'Duration', 'Result', 'Actions'].map((heading, index) => (
                  <th
                    key={`${heading}-${index}`}
                    scope="col"
                    className={`px-4 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-muted ${
                      heading === 'Duration' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {heading === 'Actions' ? <span className="sr-only">Actions</span> : heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {runs.map((run) => (
                <tr key={run.id} className="transition-colors hover:bg-sand/30">
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/runs/${run.id}`}
                      title={run.scenario}
                      className="text-[13px] font-medium text-ink underline-offset-4 hover:text-ember-dark hover:underline"
                    >
                      {scenarioLabel(run.scenario)}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px]">
                    <Link
                      href={`/runs/${run.id}`}
                      title={run.id}
                      className="text-muted underline-offset-4 hover:text-ember-dark hover:underline"
                    >
                      {run.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={run.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[11px] text-muted">
                    {formatTimestamp(run.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono text-[11px] tabular-nums text-muted">
                    {formatDuration(run.durationMs)}
                  </td>
                  <td className="max-w-[300px] px-4 py-3.5 text-xs leading-snug text-muted">
                    <span className="line-clamp-2">{run.summary ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/runs/${run.id}`}
                      aria-label={`Details for run ${run.id}`}
                      className="whitespace-nowrap text-xs font-semibold text-ember-dark underline-offset-4 hover:underline"
                    >
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-line/70 px-4 py-2 text-[10px] text-muted">
          Open a run to inspect its recorded attempts, receiver responses, and assertions.
        </p>
      </div>
    </>
  );
}

export function RunsOverviewContent({
  status,
  cursor,
  runs,
  nextCursor,
  errorMessage,
  metrics = null,
}: RunsOverviewContentProps) {
  const filtered = status !== undefined || cursor !== undefined;
  return (
    <section aria-labelledby="runs-heading" className="space-y-5 sm:space-y-6">
      <div className="border-b border-line/80 pb-5">
        <SectionHeading
          eyebrow="RelayCheck / Runs"
          title="Webhook test runs"
          titleId="runs-heading"
          description="Run repeatable webhook scenarios and inspect the recorded delivery attempts, receiver outcomes, and assertions behind every verdict."
          action={
            <Link href="/runs/new" className={`${buttonPrimary} min-h-10 px-4 py-2 text-sm`}>
              Run a scenario <span aria-hidden="true">→</span>
            </Link>
          }
        />
      </div>

      {metrics ? <OverviewStrip metrics={metrics} /> : null}

      <section aria-labelledby="runs-history-title" className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-2.5">
            <h2
              id="runs-history-title"
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink"
            >
              Recent runs
            </h2>
            {runs.length > 0 && !errorMessage ? (
              <span className="font-mono text-[10px] text-muted">{runs.length} shown</span>
            ) : null}
          </div>
          <RunFilters active={status} />
        </div>

        {errorMessage ? (
          <ErrorPanel
            title="Could not reach the Control API"
            message={errorMessage}
            hint="Start the Control API (default http://localhost:3200) and reload this page."
          />
        ) : runs.length > 0 ? (
          <div className="space-y-3">
            <RunsTable runs={runs} />
            {nextCursor ? (
              <div className="flex justify-center">
                <Link
                  href={`/?${new URLSearchParams({ ...(status ? { status } : {}), cursor: nextCursor }).toString()}`}
                  className="inline-flex min-h-9 items-center rounded-lg border border-line bg-surface px-4 py-2 text-xs font-medium text-ink transition-colors hover:bg-sand/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                >
                  Load older runs
                </Link>
              </div>
            ) : null}
          </div>
        ) : filtered ? (
          <NoMatchesState />
        ) : (
          <FirstRunEmptyState />
        )}
      </section>
    </section>
  );
}
