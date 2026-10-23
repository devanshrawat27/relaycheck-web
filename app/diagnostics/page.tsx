import { ErrorPanel } from '@/components/error-panel';
import { getMetrics, isServiceHealthy, type MetricsResponse } from '@/lib/api';
import { requireSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const API_BASE = (process.env.CONTROL_API_URL ?? 'http://127.0.0.1:3200').replace(/\/$/, '');
const RECEIVER_BASE = (process.env.DEMO_RECEIVER_URL ?? 'http://127.0.0.1:3100').replace(/\/$/, '');

const STATUS_ORDER = ['queued', 'running', 'passed', 'failed', 'error'] as const;

const STATUS_TONE = {
  queued: 'muted',
  running: 'info',
  passed: 'success',
  failed: 'danger',
  error: 'warn',
} as const;

function Card({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string;
  hint: string;
  tone?: 'default' | 'success' | 'info' | 'warn' | 'danger' | 'muted';
}) {
  const toneClass =
    tone === 'danger'
      ? 'text-danger'
      : tone === 'warn'
        ? 'text-warn'
        : tone === 'success'
          ? 'text-success'
          : tone === 'info'
            ? 'text-info'
            : tone === 'muted'
              ? 'text-muted'
              : 'text-ink';
  return (
    <div className="rounded-xl border border-line bg-surface px-5 py-4 shadow-card">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className={`mt-2 font-mono text-2xl font-medium tracking-tight ${toneClass}`}>{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

function HealthRow({ name, healthy, target }: { name: string; healthy: boolean; target: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-3.5 shadow-card">
      <div>
        <p className="text-sm font-semibold text-ink">{name}</p>
        <p className="font-mono text-xs text-muted">{target}</p>
      </div>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          healthy ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
        }`}
      >
        <span aria-hidden="true">{healthy ? '✓' : '✕'}</span>
        <span>{healthy ? 'Healthy' : 'Unreachable'}</span>
      </span>
    </div>
  );
}

function formatAge(ageMs: number | null): string {
  if (ageMs === null) {
    return 'none';
  }
  if (ageMs < 1000) {
    return `${ageMs} ms`;
  }
  if (ageMs < 60_000) {
    return `${(ageMs / 1000).toFixed(1)} s`;
  }
  return `${Math.round(ageMs / 60_000)} min`;
}

export default async function DiagnosticsPage() {
  const { token } = await requireSession();
  const [apiHealthy, receiverHealthy] = await Promise.all([
    isServiceHealthy(`${API_BASE}/api/health`),
    isServiceHealthy(`${RECEIVER_BASE}/api/health`),
  ]);

  let metrics: MetricsResponse | null = null;
  let errorMessage: string | null = null;
  try {
    metrics = await getMetrics(token);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
  }

  return (
    <section aria-labelledby="diagnostics-heading" className="space-y-10">
      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-dark">
          RelayCheck / Diagnostics
        </p>
        <h1
          id="diagnostics-heading"
          className="font-display text-4xl font-normal leading-[1.05] tracking-tight text-ink sm:text-5xl"
        >
          Is the pipeline healthy?
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          Live service health and aggregate counts — queue depth, outbox backlog, and run
          outcomes. Counts only, never payloads.
        </p>
      </div>

      <section aria-labelledby="health-heading" className="space-y-4">
        <h2 id="health-heading" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Services
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <HealthRow name="Control API" healthy={apiHealthy} target={API_BASE} />
          <HealthRow name="Demo receiver" healthy={receiverHealthy} target={RECEIVER_BASE} />
        </div>
      </section>

      {errorMessage ? (
        <ErrorPanel
          title="Could not load metrics"
          message={errorMessage}
          hint="Start the Control API (default http://localhost:3200) and reload this page."
        />
      ) : metrics ? (
        <>
          <section aria-labelledby="runs-heading" className="space-y-4">
            <h2 id="runs-heading" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Runs by status
            </h2>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {STATUS_ORDER.map((status) => (
                <Card
                  key={status}
                  label={status}
                  value={String(metrics.runs[status] ?? 0)}
                  hint="persisted runs"
                  tone={STATUS_TONE[status]}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="pipeline-heading" className="space-y-4">
            <h2 id="pipeline-heading" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Delivery pipeline
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Card label="Work queue" value={String(metrics.queues.work)} hint="jobs waiting for the runner" />
              <Card
                label="Dead-letter queue"
                value={String(metrics.queues.deadLetter)}
                hint="poison or exhausted jobs"
                tone={metrics.queues.deadLetter > 0 ? 'warn' : 'default'}
              />
              <Card
                label="Outbox pending"
                value={String(metrics.outbox.pending)}
                hint={`oldest: ${formatAge(metrics.outbox.oldestPendingAgeMs)}`}
                tone={metrics.outbox.pending > 0 ? 'warn' : 'default'}
              />
              <Card
                label="Outbox failed"
                value={String(metrics.outbox.failed)}
                hint="publish retries exhausted"
                tone={metrics.outbox.failed > 0 ? 'danger' : 'default'}
              />
            </div>
            <p className="text-xs text-muted">
              Snapshot generated {new Date(metrics.generatedAt).toLocaleString('en-GB')}.
              {metrics.queues.work < 0
                ? ' Queue depth unavailable (RabbitMQ unreachable).'
                : ''}
            </p>
          </section>
        </>
      ) : null}
    </section>
  );
}

