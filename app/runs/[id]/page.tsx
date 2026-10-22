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
      <div className="rounded-2xl border border-danger/25 bg-danger-soft px-5 py-4 text-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-danger">
          assertion failure
        </p>
        <h2 className="mt-1 text-base font-semibold text-ink">
          Execution completed, but the behaviour is wrong
        </h2>
        <p className="mt-1 text-ink/75">
          {failedAssertions.length} required assertion
          {failedAssertions.length === 1 ? '' : 's'} did not pass. This is a product-behaviour
          failure, not an infrastructure problem.
        </p>
        {summary ? <p className="mt-2 font-mono text-xs text-ink/60">{summary}</p> : null}
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="rounded-2xl border border-warn/25 bg-warn-soft px-5 py-4 text-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-warn">
          execution error
        </p>
        <h2 className="mt-1 text-base font-semibold text-ink">
          The scenario could not complete reliably
        </h2>
        <p className="mt-1 text-ink/75">
          An infrastructure or execution problem prevented a verdict. This is not an assertion
          failure.
        </p>
        {safeError ? <p className="mt-2 font-mono text-xs text-ink/60">{safeError}</p> : null}
      </div>
    );
  }
  return null;
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-5 py-4 shadow-card">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-mono text-2xl font-medium tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
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
      <Link
        href="/"
        className="text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
      >
        ← Back to runs
      </Link>

      <header className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember">
              RelayCheck / Run detail
            </p>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              {run.scenario}
            </h1>
            <CopyRunId id={run.id} />
            <RunPoller status={run.status} />
          </div>
          <StatusBadge status={run.status} size="lg" />
        </div>

        {run.summary ? (
          <p className="mt-5 max-w-2xl border-t border-line/70 pt-4 text-sm leading-relaxed text-ink/80">
            {run.summary}
          </p>
        ) : null}
      </header>

      <VerdictExplanation
        status={run.status}
        summary={run.summary}
        safeError={run.safeError}
        failedAssertions={failedAssertions}
      />

      <section aria-labelledby="counts-heading" className="space-y-4">
        <h2
          id="counts-heading"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
        >
          Measurement summary
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            label="Delivery attempts"
            value={String(run.attempts.length)}
            hint="Sender-side HTTP deliveries recorded by the runner."
          />
          <Stat
            label="Business effects"
            value={effectAssertion ? effectAssertion.actual : '—'}
            hint="Receiver-side effects reported by the test oracle."
          />
          <Stat
            label="Duration"
            value={formatDuration(run.durationMs)}
            hint="From claim to finalize."
          />
        </div>
        <dl className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted">
          <div className="flex gap-2">
            <dt>Created</dt>
            <dd className="font-mono text-ink/80">{formatTimestamp(run.createdAt)}</dd>
          </div>
          <div className="flex gap-2">
            <dt>Started</dt>
            <dd className="font-mono text-ink/80">{formatTimestamp(run.startedAt)}</dd>
          </div>
          <div className="flex gap-2">
            <dt>Finished</dt>
            <dd className="font-mono text-ink/80">{formatTimestamp(run.finishedAt)}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="assertions-heading" className="space-y-4">
        <h2
          id="assertions-heading"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
        >
          Assertions
        </h2>
        <AssertionsTable assertions={run.assertions} />
      </section>

      <section aria-labelledby="attempts-heading" className="space-y-4">
        <h2
          id="attempts-heading"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
        >
          Delivery attempts
        </h2>
        <AttemptsTable attempts={run.attempts} />
      </section>
    </article>
  );
}

