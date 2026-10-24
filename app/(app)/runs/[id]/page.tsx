import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CopyRunId } from '@/components/copy-run-id';
import { ErrorPanel } from '@/components/error-panel';
import { AssertionsTable, AttemptsTable, formatDuration } from '@/components/evidence-tables';
import { RunPoller } from '@/components/run-poller';
import { StatusBadge } from '@/components/status-badge';
import { getRun, type AssertionResult } from '@/lib/api';
import { requireSession } from '@/lib/session';

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
      <div className="rounded-xl border border-danger-border bg-danger-soft p-5 text-sm">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-danger-dark">
          Assertion failure
        </p>
        <h2 className="mt-1 text-base font-semibold text-ink">
          Execution completed, but the behaviour is wrong
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-ink/80">
          {failedAssertions.length} required assertion
          {failedAssertions.length === 1 ? '' : 's'} did not pass. This is a product-behaviour
          failure, not an infrastructure problem.
        </p>
        {summary ? <p className="mt-2 font-mono text-xs text-muted">{summary}</p> : null}
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="rounded-xl border border-warn-border bg-warn-soft p-5 text-sm">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-warn-dark">
          Execution error
        </p>
        <h2 className="mt-1 text-base font-semibold text-ink">
          The scenario could not complete reliably
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-ink/80">
          An infrastructure or execution problem prevented a verdict. This is not an assertion
          failure.
        </p>
        {safeError ? <p className="mt-2 font-mono text-xs text-muted">{safeError}</p> : null}
      </div>
    );
  }
  return null;
}

interface RunDetailPageProps {
  params: { id: string };
}

export default async function RunDetailPage({ params }: RunDetailPageProps) {
  const { token } = await requireSession();
  let run;
  let errorMessage: string | null = null;

  try {
    run = await getRun(params.id, token);
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
      {/* Top navigation & action strip */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
        >
          <span>←</span> Back to runs
        </Link>
        <div className="flex items-center gap-3">
          <RunPoller status={run.status} />
          <CopyRunId id={run.id} />
        </div>
      </div>

      {/* Main Run Overview Card */}
      <header className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
        {/* Header Title Bar */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ember-dark">
                  RelayCheck / Run Detail
                </span>
                <span className="rounded bg-sand px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted">
                  local target
                </span>
              </div>
              <h1 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
                {run.scenario}
              </h1>
              {run.summary ? (
                <p className="max-w-2xl text-xs leading-relaxed text-muted pt-1">
                  {run.summary}
                </p>
              ) : null}
            </div>
            <div className="shrink-0">
              <StatusBadge status={run.status} size="lg" />
            </div>
          </div>

          {/* Integrated Metrics Strip */}
          <div className="mt-8 grid gap-4 border-t border-line/70 pt-6 sm:grid-cols-3">
            <div className="rounded-lg border border-line bg-sand/30 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Delivery attempts
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-ink">
                {run.attempts.length}
              </p>
              <p className="mt-1 text-xs text-muted">
                Sender-side HTTP deliveries recorded by runner.
              </p>
            </div>

            <div className="rounded-lg border border-success-border bg-success-soft p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-success">
                Business effects
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-success">
                {effectAssertion ? effectAssertion.actual : '—'}
              </p>
              <p className="mt-1 text-xs text-success/90">
                Receiver-side effects reported by test oracle.
              </p>
            </div>

            <div className="rounded-lg border border-line bg-sand/30 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Total duration
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-ink">
                {formatDuration(run.durationMs)}
              </p>
              <p className="mt-1 text-xs text-muted">
                From runner claim to finalize.
              </p>
            </div>
          </div>

          {/* Execution Timestamps Footer */}
          <dl className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-line/50 pt-4 text-xs text-muted">
            <div className="flex items-center gap-2">
              <dt className="text-muted">Created:</dt>
              <dd className="font-mono font-medium text-ink">{formatTimestamp(run.createdAt)}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="text-muted">Started:</dt>
              <dd className="font-mono font-medium text-ink">{formatTimestamp(run.startedAt)}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="text-muted">Finished:</dt>
              <dd className="font-mono font-medium text-ink">{formatTimestamp(run.finishedAt)}</dd>
            </div>
          </dl>
        </div>
      </header>

      <VerdictExplanation
        status={run.status}
        summary={run.summary}
        safeError={run.safeError}
        failedAssertions={failedAssertions}
      />

      {/* Assertions Table Section */}
      <section aria-labelledby="assertions-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            id="assertions-heading"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
          >
            Assertions
          </h2>
          <span className="font-mono text-[11px] text-muted">
            {run.assertions.length} total · {failedAssertions.length} failed
          </span>
        </div>
        <AssertionsTable assertions={run.assertions} />
      </section>

      {/* Delivery Attempts Table Section */}
      <section aria-labelledby="attempts-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            id="attempts-heading"
            className="font-display text-xl font-normal tracking-tight text-ink sm:text-2xl"
          >
            Delivery attempts
          </h2>
          <span className="font-mono text-[11px] text-muted">
            {run.attempts.length} attempts recorded
          </span>
        </div>
        <AttemptsTable attempts={run.attempts} />
      </section>
    </article>
  );
}
