import type { Metadata } from 'next';
import { AppShell } from '@/components/app-shell';
import { LandingPage } from '@/components/marketing/landing-page';
import { RunsOverview } from '@/components/runs-overview';
import { getAuthState } from '@/lib/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Webhook reliability, verified - RelayCheck',
  description:
    'Simulate duplicate deliveries, receiver failures, and timeouts. Verify idempotency and inspect every delivery attempt with evidence you can trust.',
};

interface HomePageProps {
  searchParams?: { status?: string | string[]; cursor?: string | string[] };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const auth = await getAuthState();
  const authenticated = auth.authRequired && auth.user !== null;

  if (!authenticated) {
    return <LandingPage />;
  }

  return (
    <AppShell>
      <RunsOverview searchParams={searchParams} />
    </AppShell>
  );
}
