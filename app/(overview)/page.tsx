import { RunsOverviewContent } from '@/components/runs-overview-content';
import { getRunsPage, isRunStatus, type RunListItem, type RunStatus } from '@/lib/api';
import { requireSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

interface OverviewPageProps {
  searchParams?: { status?: string | string[]; cursor?: string | string[] };
}

export default async function RunsOverviewPage({ searchParams }: OverviewPageProps) {
  const requested = Array.isArray(searchParams?.status)
    ? searchParams.status[0]
    : searchParams?.status;
  const status: RunStatus | undefined = isRunStatus(requested) ? requested : undefined;
  const cursor = Array.isArray(searchParams?.cursor)
    ? searchParams.cursor[0]
    : searchParams?.cursor;

  const { token } = await requireSession();

  let runs: RunListItem[] = [];
  let nextCursor: string | null = null;
  let errorMessage: string | null = null;

  try {
    const page = await getRunsPage({ take: 20, status, cursor }, token);
    runs = page.items;
    nextCursor = page.nextCursor;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
  }

  return (
    <RunsOverviewContent
      status={status}
      cursor={cursor}
      runs={runs}
      nextCursor={nextCursor}
      errorMessage={errorMessage}
    />
  );
}
