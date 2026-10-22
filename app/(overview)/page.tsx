import Link from 'next/link';
import { ErrorPanel } from '@/components/error-panel';
import { RunFilters } from '@/components/run-filters';
import { StatusBadge } from '@/components/status-badge';
import { getRunsPage, isRunStatus, type RunListItem, type RunStatus } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface OverviewPageProps {
  searchParams?: { status?: string | string[]; cursor?: string | string[] };
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatDuration(durationMs: number | null): string {
  if (durationMs === null) {
    return '—';
  }
  return durationMs < 1000 ? `${durationMs} ms` : `${(durationMs / 1000).toFixed(2)} s`;
}

function RunsTable({ runs }: { runs: RunListItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] border-collapse text-left">
          <caption className="sr-only">Recent scenario runs</caption>
          <thead>
            <tr className="border-b border-line bg-paper/60">
              {['Scenario', 'Run', 'Status', 'Created', 'Duration', 'Result'].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr
                key={run.id}
                className="border-b border-line/60 transition-colors last:border-b-0 hover:bg-paper/60"
              >
                <td className="px-5 py-4 font-mono text-xs text-ink">{run.scenario}</td>
                <td className="px-5 py-4 font-mono text-xs">
                  <Link
                    href={`/runs/${run.id}`}
                    className="text-ember underline-offset-4 hover:underline"
                    title={run.id}
                  >
                    {run.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={run.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
                  {formatTimestamp(run.createdAt)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-muted">
                  {formatDuration(run.durationMs)}
                </td>
                <td className="max-w-[340px] px-5 py-4 text-sm leading-snug text-ink/80">
                  <span className="line-clamp-2">{run.summary ?? '—'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  if (filtered) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-14 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">no matches</p>
        <h2 className="mt-2 text-lg font-semibold text-ink">No runs match this filter</h2>
        <p className="mt-2 text-sm text-muted">
          Try a different status, or{' '}
          <Link href="/" className="text-ember underline-offset-4 hover:underline">
            show all runs
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">nothing yet</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">No runs recorded</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        Run the duplicate-delivery scenario: the same event ID three times, one business effect —
        and the evidence to prove it.
      </p>
      <Link
        href="/runs/new"
        className="mt-6 inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ember"
      >
        Run a scenario
      </Link>
    </div>
  );
}

export default async function RunsOverviewPage({ searchParams }: OverviewPageProps) {
  const requested = Array.isArray(searchParams?.status)
    ? searchParams?.status[0]
    : searchParams?.status;
  const status: RunStatus | undefined = isRunStatus(requested) ? requested : undefined;
  const cursor = Array.isArray(searchParams?.cursor)
    ? searchParams?.cursor[0]
    : searchParams?.cursor;

  let runs: RunListItem[] = [];
  let nextCursor: string | null = null;
  let errorMessage: string | null = null;

  try {
    const page = await getRunsPage({ take: 20, status, cursor });
    runs = page.items;
    nextCursor = page.nextCursor;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
  }

  return (
    <section aria-labelledby="runs-heading" className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember">
            RelayCheck / Runs
          </p>
          <h1
            id="runs-heading"
            className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl"
          >
            Evidence for every delivery.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            Persisted scenario runs from the Control API. Duplicate deliveries, controlled
            failures, and timeouts — each with attempts and assertions, never assumptions.
          </p>
        </div>
        <Link
          href="/runs/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ember"
        >
          Run a scenario
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            History
          </h2>
          <RunFilters active={status} />
        </div>

        {errorMessage ? (
          <ErrorPanel
            title="Could not reach the Control API"
            message={errorMessage}
            hint="Start the Control API (default http://localhost:3200) and reload this page."
          />
        ) : runs.length === 0 ? (
          <EmptyState filtered={status !== undefined || cursor !== undefined} />
        ) : (
          <div className="space-y-4">
            <RunsTable runs={runs} />
            {nextCursor ? (
              <div className="flex justify-center">
                <Link
                  href={`/?${new URLSearchParams({
                    ...(status ? { status } : {}),
                    cursor: nextCursor,
                  }).toString()}`}
                  className="inline-flex items-center rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/40"
                >
                  Load older runs
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
