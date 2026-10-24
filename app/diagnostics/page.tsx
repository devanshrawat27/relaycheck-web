import { ErrorPanel } from '@/components/error-panel';
import { getMetrics, isServiceHealthy, type MetricsResponse } from '@/lib/api';
import { requireSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const API_BASE = (process.env.CONTROL_API_URL ?? 'http://127.0.0.1:3200').replace(/\/$/, '');
const RECEIVER_BASE = (process.env.DEMO_RECEIVER_URL ?? 'http://127.0.0.1:3100').replace(/\/$/, '');

const STATUS_ORDER = ['queued', 'running', 'passed', 'failed', 'error'] as const;

const STATUS_TONE = {
  queued: 'text-muted',
  running: 'text-info-dark',
  passed: 'text-success-dark',
  failed: 'text-danger-dark',
  error: 'text-warn-dark',
} as const;

function ServiceCard({
  name,
  healthy,
  target,
}: {
  name: string;
  healthy: boolean;
  target: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4 shadow-card">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              healthy ? 'bg-success animate-pulse' : 'bg-danger'
            }`}
          />
          <p className="text-xs font-semibold text-ink">{name}</p>
        </div>
        <p className="font-mono text-[11px] text-muted">{target}</p>
      </div>
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
          healthy
            ? 'border-success-border bg-success-soft text-success-dark'
            : 'border-danger-border bg-danger-soft text-danger-dark'
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
    <section aria-labelledby="diagnostics-heading" className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-line/70 pb-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ember-dark">
          RelayCheck / Diagnostics
        </p>
        <h1
          id="diagnostics-heading"
          className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl"
        >
          Is the pipeline healthy?
        </h1>
        <p className="max-w-xl text-xs leading-relaxed text-muted">
          Live service health and aggregate counts — queue depth, outbox backlog, and run
          outcomes. Counts only, never payloads.
        </p>
      </div>

      {/* Services Health */}
      <section aria-labelledby="health-heading" className="space-y-3">
        <h2 id="health-heading" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Services
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <ServiceCard name="Control API" healthy={apiHealthy} target={API_BASE} />
          <ServiceCard name="Demo receiver" healthy={receiverHealthy} target={RECEIVER_BASE} />
        </div>
      </section>

      {errorMessage ? (
        <ErrorPanel
          title="Could not load metrics"
          message={errorMessage}
          hint="Start the Control API (default http://localhost:3200) and reload this page."
        />
      ) : metrics ? (
        <div className="space-y-8">
          {/* Runs by Status */}
          <section aria-labelledby="runs-heading" className="space-y-3">
            <h2 id="runs-heading" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Runs by status
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {STATUS_ORDER.map((status) => (
                <div
                  key={status}
                  className="rounded-xl border border-line bg-surface p-4 shadow-card"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {status}
                  </p>
                  <p className={`mt-2 font-mono text-2xl font-bold tracking-tight ${STATUS_TONE[status]}`}>
                    {metrics?.runs[status] ?? 0}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">persisted runs</p>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Pipeline */}
          <section aria-labelledby="pipeline-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 id="pipeline-heading" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                Delivery pipeline
              </h2>
              <span className="font-mono text-[10px] text-muted">
                Snapshot: {new Date(metrics.generatedAt).toLocaleTimeString('en-GB')}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-line bg-surface p-4 shadow-card">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Work queue</p>
                <p className="mt-2 font-mono text-2xl font-bold text-ink">{metrics.queues.work}</p>
                <p className="mt-1 text-[11px] text-muted">jobs waiting for runner</p>
              </div>

              <div
                className={`rounded-xl border p-4 shadow-card ${
                  metrics.queues.deadLetter > 0
                    ? 'border-warn-border bg-warn-soft/40'
                    : 'border-line bg-surface'
                }`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Dead-letter queue
                </p>
                <p
                  className={`mt-2 font-mono text-2xl font-bold ${
                    metrics.queues.deadLetter > 0 ? 'text-warn-dark' : 'text-ink'
                  }`}
                >
                  {metrics.queues.deadLetter}
                </p>
                <p className="mt-1 text-[11px] text-muted">poison or exhausted jobs</p>
              </div>

              <div
                className={`rounded-xl border p-4 shadow-card ${
                  metrics.outbox.pending > 0
                    ? 'border-warn-border bg-warn-soft/40'
                    : 'border-line bg-surface'
                }`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Outbox pending
                </p>
                <p
                  className={`mt-2 font-mono text-2xl font-bold ${
                    metrics.outbox.pending > 0 ? 'text-warn-dark' : 'text-ink'
                  }`}
                >
                  {metrics.outbox.pending}
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  oldest: {formatAge(metrics.outbox.oldestPendingAgeMs)}
                </p>
              </div>

              <div
                className={`rounded-xl border p-4 shadow-card ${
                  metrics.outbox.failed > 0
                    ? 'border-danger-border bg-danger-soft/40'
                    : 'border-line bg-surface'
                }`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Outbox failed
                </p>
                <p
                  className={`mt-2 font-mono text-2xl font-bold ${
                    metrics.outbox.failed > 0 ? 'text-danger-dark' : 'text-ink'
                  }`}
                >
                  {metrics.outbox.failed}
                </p>
                <p className="mt-1 text-[11px] text-muted">publish retries exhausted</p>
              </div>
            </div>
            {metrics.queues.work < 0 ? (
              <p className="text-xs text-warn-dark">
                Queue depth unavailable (RabbitMQ unreachable).
              </p>
            ) : null}
          </section>
        </div>
      ) : null}
    </section>
  );
}
