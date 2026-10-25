import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CopyRunId } from '@/components/copy-run-id';
import { ErrorPanel } from '@/components/error-panel';
import { AssertionsTable, AttemptsTable, formatDuration } from '@/components/evidence-tables';
import { EffectVerdictStrip, RunMetrics, VerdictCallout } from '@/components/run-evidence';
import { RunPoller } from '@/components/run-poller';
import { StatusBadge } from '@/components/status-badge';
import { getRun, type RunDetail } from '@/lib/api';
import { describeRun, extraRunNote } from '@/lib/run-evidence';
import { requireSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

function formatTimestamp(iso: string | null): string {
  if (!iso) {
    return '—';
  }
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

function RunMetaFooter({ run }: { run: RunDetail }) {
  const note = extraRunNote(run);
  return (
    <div className="space-y-2 border-t border-line pt-4">
      <dl className="flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[11px] text-muted">
        <div className="flex items-center gap-2">
          <dt>created</dt>
          <dd className="font-medium text-ink-secondary">{formatTimestamp(run.createdAt)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt>started</dt>
          <dd className="font-medium text-ink-secondary">{formatTimestamp(run.startedAt)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt>finished</dt>
          <dd className="font-medium text-ink-secondary">{formatTimestamp(run.finishedAt)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt>run</dt>
          <dd className="font-medium text-ink-secondary">{run.id.slice(0, 8)}</dd>
        </div>
      </dl>
      {note ? <p className="font-mono text-[11px] text-warn-dark">{note}</p> : null}
    </div>
  );
}

interface RunDetailPageProps {
  params: { id: string };
}

export default async function RunDetailPage({ params }: RunDetailPageProps) {
  const { token } = await requireSession();
  let run: RunDetail | null = null;
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

  const evidence = describeRun(run);

  return (
    <article className="space-y-7 pb-4 sm:space-y-8">
      {/* Utility strip: navigation, live state, run identifier */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> Back to runs
        </Link>
        <div className="flex flex-wrap items-center gap-2.5">
          <RunPoller status={run.status} />
          <CopyRunId id={run.id} />
        </div>
      </div>

      {/* Verdict header: scenario, recorded shape, final status */}
      <header className="border-b border-line pb-6 sm:pb-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ember-dark">
                RelayCheck / Run detail
              </span>
              <span aria-hidden="true" className="text-stone">
                ·
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {run.id.slice(0, 8)}
              </span>
            </div>
            <h1 className="mt-2.5 font-display text-[2rem] font-normal leading-[1.05] tracking-tight text-ink sm:text-[2.75rem]">
              {evidence.label}
            </h1>
            <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{evidence.subline}</p>
          </div>
          <div className="shrink-0 sm:pt-1">
            <StatusBadge status={run.status} size="lg" />
          </div>
        </div>
      </header>

      {/* Three distinct measurements — never collapsed into one score */}
      <RunMetrics evidence={evidence} durationLabel={formatDuration(run.durationMs)} />

      {/* The product's core claim, stated from recorded evidence */}
      <EffectVerdictStrip evidence={evidence} />

      <VerdictCallout
        evidence={evidence}
        safeError={run.safeError}
      />

      <section aria-labelledby="assertions-heading" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="assertions-heading"
            className="font-display text-xl font-normal tracking-tight text-ink sm:text-2xl"
          >
            Assertions
          </h2>
          <span className="font-mono text-[11px] text-muted">
            {run.assertions.length} total · {evidence.failedAssertions.length} failed
          </span>
        </div>
        <AssertionsTable assertions={run.assertions} />
      </section>

      <section aria-labelledby="attempts-heading" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="attempts-heading"
            className="font-display text-xl font-normal tracking-tight text-ink sm:text-2xl"
          >
            Delivery attempts
          </h2>
          <span className="font-mono text-[11px] text-muted">
            {evidence.attempts} recorded · {evidence.accepted} accepted
          </span>
        </div>
        <AttemptsTable attempts={run.attempts} />
      </section>

      <RunMetaFooter run={run} />
    </article>
  );
}
