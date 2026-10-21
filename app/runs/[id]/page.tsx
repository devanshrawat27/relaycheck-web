import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CopyRunId } from '@/components/copy-run-id';
import { ErrorPanel } from '@/components/error-panel';
import { AssertionsTable, AttemptsTable, formatDuration } from '@/components/evidence-tables';
import { RunPoller } from '@/components/run-poller';
import { StatusBadge } from '@/components/status-badge';
import { getRun, type AssertionResult } from '@/lib/api';

export const dynamic = 'force-dynamic';

const EFFECT_ASSERTION = 'business_effect_applied_once';

function formatTimestamp(iso: string | null): string {
  if (!iso) {
    return '—';
  }
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

function VerdictExplanation({
  status,
  summary,
  safeError,
  failedAssertions,
}: {
  status: string;
  summary: string | null;
  safeError: string | null;
  failedAssertions: AssertionResult[];
}) {
  if (status === 'failed') {
    return (
      <div className="rounded-lg border border-red-800/60 bg-red-950/30 px-4 py-3 text-sm">
        <h2 className="font-semibold text-red-200">Assertion failure</h2>
        <p className="mt-1 text-red-100/80">
          Execution completed, but {failedAssertions.length} required assertion
          {failedAssertions.length === 1 ? '' : 's'} did not pass. This is a product-behavior
          failure, not an infrastructure problem.
        </p>
        {summary ? <p className="mt-2 font-mono text-xs text-red-100/70">{summary}</p> : null}
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="rounded-lg border border-amber-800/60 bg-amber-950/30 px-4 py-3 text-sm">
        <h2 className="font-semibold text-amber-200">Execution error</h2>
        <p className="mt-1 text-amber-100/80">
          The scenario could not complete reliably (an infrastructure or execution problem), so no
          verdict was produced from assertions.
        </p>
        {safeError ? <p className="mt-2 font-mono text-xs text-amber-100/70">{safeError}</p> : null}
      </div>
    );
  }
  return null;
}

function CountPanel({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 font-mono text-lg text-neutral-100">{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{hint}</p>
    </div>
  );
}

interface RunDetailPageProps {
  params: { id: string };
}

export default async function RunDetailPage({ params }: RunDetailPageProps) {
  let run;
  let errorMessage: string | null = null;

  try {
    run = await getRun(params.id);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    run = null;
  }

  if (errorMessage) {
    return (
      <ErrorPanel
        title="Could not load this run"
        message={errorMessage}
        hint="Start the Control API (default http://localhost:3200) and reload this page."
      />
    );
  }

  if (!run) {
    notFound();
  }

  const failedAssertions = run.assertions.filter((assertion) => !assertion.passed);
  const effectAssertion = run.assertions.find((assertion) => assertion.name === EFFECT_ASSERTION);

  return (
    <article className="space-y-8">
      <div className="space-y-3">
        <Link
          href="/"
          className="text-xs text-neutral-400 underline-offset-4 hover:text-neutral-200 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          ← Back to runs
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Run detail</h1>
            <p className="font-mono text-xs text-neutral-400">{run.scenario}</p>
          </div>
          <StatusBadge status={run.status} />
        </div>
        <CopyRunId id={run.id} />
        <RunPoller status={run.status} />
      </div>

      <VerdictExplanation
        status={run.status}
        summary={run.summary}
        safeError={run.safeError}
        failedAssertions={failedAssertions}
      />

      <section aria-labelledby="counts-heading" className="space-y-3">
        <h2 id="counts-heading" className="text-sm font-semibold text-neutral-200">
          Measurement summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <CountPanel
            label="Delivery attempts"
            value={String(run.attempts.length)}
            hint="Sender-side HTTP deliveries recorded by the runner."
          />
          <CountPanel
            label="Business effects"
            value={effectAssertion ? effectAssertion.actual : '—'}
            hint="Receiver-side effects reported by the test oracle."
          />
          <CountPanel
            label="Duration"
            value={formatDuration(run.durationMs)}
            hint="From claim to finalize."
          />
        </div>
        <dl className="grid gap-2 text-xs text-neutral-400 sm:grid-cols-3">
          <div className="flex gap-2">
            <dt>Created:</dt>
            <dd className="text-neutral-300">{formatTimestamp(run.createdAt)}</dd>
          </div>
          <div className="flex gap-2">
            <dt>Started:</dt>
            <dd className="text-neutral-300">{formatTimestamp(run.startedAt)}</dd>
          </div>
          <div className="flex gap-2">
            <dt>Finished:</dt>
            <dd className="text-neutral-300">{formatTimestamp(run.finishedAt)}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="assertions-heading" className="space-y-3">
        <h2 id="assertions-heading" className="text-sm font-semibold text-neutral-200">
          Assertions
        </h2>
        <AssertionsTable assertions={run.assertions} />
      </section>

      <section aria-labelledby="attempts-heading" className="space-y-3">
        <h2 id="attempts-heading" className="text-sm font-semibold text-neutral-200">
          Delivery attempts
        </h2>
        <AttemptsTable attempts={run.attempts} />
      </section>
    </article>
  );
}
