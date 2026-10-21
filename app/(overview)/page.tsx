import { ErrorPanel } from '@/components/error-panel';
import { RunFilters } from '@/components/run-filters';
import { StatusBadge } from '@/components/status-badge';
import { getRuns, isRunStatus, type RunListItem, type RunStatus } from '@/lib/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface OverviewPageProps {
  searchParams?: { status?: string | string[] };
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
    <div className="overflow-x-auto rounded-lg border border-neutral-800">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption className="sr-only">Recent scenario runs</caption>
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/60 text-xs uppercase tracking-wide text-neutral-400">
            <th scope="col" className="px-4 py-3 font-medium">
              Scenario
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Run ID
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Created
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Duration
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id} className="border-b border-neutral-800/60 last:border-b-0">
              <td className="px-4 py-3 font-mono text-xs text-neutral-300">{run.scenario}</td>
              <td className="px-4 py-3 font-mono text-xs">
                <Link
                  href={`/runs/${run.id}`}
                  className="text-emerald-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                  title={run.id}
                >
                  {run.id.slice(0, 8)}
                </Link>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={run.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-neutral-400">
                {formatTimestamp(run.createdAt)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-neutral-400">
                {formatDuration(run.durationMs)}
              </td>
              <td className="max-w-[320px] px-4 py-3 text-neutral-300">
                <span className="line-clamp-2">{run.summary ?? '—'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  if (filtered) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-700 px-6 py-10 text-center">
        <h2 className="text-sm font-semibold text-neutral-200">No runs match this filter</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Try a different status, or{' '}
          <Link
            href="/"
            className="text-emerald-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            show all runs
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-neutral-700 px-6 py-10 text-center">
      <h2 className="text-sm font-semibold text-neutral-200">No runs recorded yet</h2>
      <p className="mx-auto mt-2 max-w-prose text-sm text-neutral-400">
        RelayCheck runs repeatable webhook scenarios. The duplicate-delivery scenario sends the
        same event ID three times and verifies the receiver applies exactly one business effect.
      </p>
    </div>
  );
}

export default async function RunsOverviewPage({ searchParams }: OverviewPageProps) {
  const requested = Array.isArray(searchParams?.status)
    ? searchParams?.status[0]
    : searchParams?.status;
  const status: RunStatus | undefined = isRunStatus(requested) ? requested : undefined;

  let runs: RunListItem[] = [];
  let errorMessage: string | null = null;

  try {
    runs = await getRuns({ take: 20, status });
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
  }

  return (
    <section aria-labelledby="runs-heading" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 id="runs-heading" className="text-2xl font-semibold tracking-tight">
            Runs
          </h1>
          <p className="text-sm text-neutral-400">
            Recent scenario runs persisted by the RelayCheck Control API.
          </p>
        </div>
        <Link
          href="/runs/new"
          className="inline-flex shrink-0 items-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          Run a scenario
        </Link>
      </div>

      <RunFilters active={status} />

      {errorMessage ? (
        <ErrorPanel
          title="Could not reach the Control API"
          message={errorMessage}
          hint="Start the Control API (default http://localhost:3200) and reload this page."
        />
      ) : runs.length === 0 ? (
        <EmptyState filtered={status !== undefined} />
      ) : (
        <RunsTable runs={runs} />
      )}
    </section>
  );
}
