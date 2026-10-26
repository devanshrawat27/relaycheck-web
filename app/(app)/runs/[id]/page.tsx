import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CopyRunId } from '@/components/copy-run-id';
import { ErrorPanel } from '@/components/error-panel';
import { AssertionsTable, AttemptsTable, formatDuration } from '@/components/evidence-tables';
import { EffectVerdictStrip, RunMetrics, VerdictCallout } from '@/components/run-evidence';
import { RunPoller } from '@/components/run-poller';
import { StatusBadge } from '@/components/status-badge';
import { Collapsible } from '@/components/ui';
import { getRun, type RunDetail } from '@/lib/api';
import { describeRun, extraRunNote } from '@/lib/run-evidence';
import { requireSession } from '@/lib/session';
import { buttonPrimary, buttonSecondary } from '@/lib/ui';

export const dynamic = 'force-dynamic';

function formatTimestamp(iso: string | null): string {
  if (!iso) {
    return '—';
  }
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

const PARAM_LABELS: Array<{ key: string; label: string }> = [
  { key: 'eventId', label: 'Event ID' },
  { key: 'orderId', label: 'Order ID' },
  { key: 'targetName', label: 'Target' },
  { key: 'targetUrl', label: 'Target URL' },
  { key: 'deliveryCount', label: 'Delivery attempts' },
  { key: 'timeoutMs', label: 'Timeout (ms)' },
  { key: 'httpStatus', label: 'Injected status' },
  { key: 'delayMs', label: 'Injected delay (ms)' },
  { key: 'eventType', label: 'Event type' },
];

function TechnicalDetails({ run }: { run: RunDetail }) {
  const params = run.params ?? {};
  const rows = PARAM_LABELS.filter(({ key }) => params[key] !== undefined && params[key] !== null).map(
    ({ key, label }) => ({ label, value: String(params[key]) }),
  );
  const note = extraRunNote(run);

  return (
    <Collapsible
      title="Technical details"
      subtitle="Timestamps, run parameters, and the full run identifier."
    >
      <div className="space-y-4">
        {note ? (
          <p className="rounded-lg border border-warn-border bg-warn-soft px-3 py-2 font-mono text-[11px] text-warn-dark">
            {note}
          </p>
        ) : null}
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
          <div className="flex items-center justify-between gap-3 border-b border-line/60 pb-1.5">
            <dt className="text-muted">Created</dt>
            <dd className="font-mono text-ink-secondary">{formatTimestamp(run.createdAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-line/60 pb-1.5">
            <dt className="text-muted">Started</dt>
            <dd className="font-mono text-ink-secondary">{formatTimestamp(run.startedAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-line/60 pb-1.5">
            <dt className="text-muted">Finished</dt>
            <dd className="font-mono text-ink-secondary">{formatTimestamp(run.finishedAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-line/60 pb-1.5">
            <dt className="text-muted">Run ID</dt>
            <dd className="break-all font-mono text-ink-secondary">{run.id}</dd>
          </div>
        </dl>
        {rows.length > 0 ? (
          <div>
            <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Run parameters
            </p>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
              {rows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-3 border-b border-line/50 pb-1.5">
                  <dt className="text-muted">{row.label}</dt>
                  <dd className="break-all text-right font-mono text-ink-secondary">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </Collapsible>
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
    <article className="space-y-6 pb-4 sm:space-y-7">
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
      <header className="border-b border-line pb-5 sm:pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ember-dark">
                RelayCheck / Run detail
              </span>
              <span aria-hidden="true" className="text-stone">
                ·
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {run.id.slice(0, 8)}
              </span>
            </div>
            <h1 className="mt-2 font-display text-[2rem] font-normal leading-[1.05] tracking-tight text-ink sm:text-[2.75rem]">
              {evidence.label}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">{evidence.subline}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:pt-1">
            <StatusBadge status={run.status} size="lg" />
          </div>
        </div>
      </header>

      {/* Three distinct measurements — never collapsed into one score */}
      <RunMetrics evidence={evidence} durationLabel={formatDuration(run.durationMs)} />

      {/* The product's core claim, stated from recorded evidence */}
      <EffectVerdictStrip evidence={evidence} />

      <VerdictCallout evidence={evidence} safeError={run.safeError} />

      <section aria-labelledby="assertions-heading" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="assertions-heading" className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
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
          <h2 id="attempts-heading" className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
            Delivery attempts
          </h2>
          <span className="font-mono text-[11px] text-muted">
            {evidence.attempts} recorded · {evidence.accepted} accepted
          </span>
        </div>
        <AttemptsTable attempts={run.attempts} />
      </section>

      <TechnicalDetails run={run} />

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <Link href="/runs/new" className={`${buttonPrimary} min-h-9 px-4 py-2 text-sm`}>
          Run another test
        </Link>
        <Link href="/" className={`${buttonSecondary} min-h-9 px-4 py-2 text-sm`}>
          Back to runs
        </Link>
      </div>
    </article>
  );
}
