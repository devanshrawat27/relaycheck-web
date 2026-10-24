import { RunsOverview } from '@/components/runs-overview';
import { requireSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

interface RunsPageProps {
  searchParams?: { status?: string | string[]; cursor?: string | string[] };
}

export default async function RunsPage({ searchParams }: RunsPageProps) {
  await requireSession();
  return <RunsOverview searchParams={searchParams} />;
}
