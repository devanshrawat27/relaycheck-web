import { RunsOverviewContent } from '@/components/runs-overview-content';
import {
  getMetrics,
  getRunsPage,
  isRunStatus,
  type MetricsResponse,
  type RunListItem,
  type RunStatus,
} from '@/lib/api';
import { sessionToken } from '@/lib/session';

interface RunsOverviewProps {
  searchParams?: { status?: string | string[]; cursor?: string | string[] };
}

export async function RunsOverview({ searchParams }: RunsOverviewProps) {
  const requested = Array.isArray(searchParams?.status)
    ? searchParams.status[0]
    : searchParams?.status;
  const status: RunStatus | undefined = isRunStatus(requested) ? requested : undefined;
  const cursor = Array.isArray(searchParams?.cursor)
    ? searchParams.cursor[0]
    : searchParams?.cursor;

  const token = sessionToken();

  let runs: RunListItem[] = [];
  let nextCursor: string | null = null;
  let errorMessage: string | null = null;
  let metrics: MetricsResponse | null = null;

  try {
    const page = await getRunsPage({ take: 20, status, cursor }, token);
    runs = page.items;
    nextCursor = page.nextCursor;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
  }

  // Best-effort: the compact overview is hidden when metrics are unavailable.
  try {
    metrics = await getMetrics(token);
  } catch {
    metrics = null;
  }

  return (
    <RunsOverviewContent
      status={status}
      cursor={cursor}
      runs={runs}
      nextCursor={nextCursor}
      errorMessage={errorMessage}
      metrics={metrics}
    />
  );
}
