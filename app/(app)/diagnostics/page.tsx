import { ErrorPanel } from '@/components/error-panel';
import { Metric, Panel, SectionHeading } from '@/components/ui';
import { getMetrics, isServiceHealthy, type MetricsResponse } from '@/lib/api';
import { requireSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const API_BASE = (process.env.CONTROL_API_URL ?? 'http://127.0.0.1:3200').replace(/\/$/, '');
const RECEIVER_BASE = (process.env.DEMO_RECEIVER_URL ?? 'http://127.0.0.1:3100').replace(/\/$/, '');

const STATUS_ORDER = ['queued', 'running', 'passed', 'failed', 'error'] as const;

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

function ServiceCard({
  name,
  healthy,
  target,
  guidance,
}: {
  name: string;
  healthy: boolean;
  target: string;
  guidance: string;
}) {
  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${healthy ? 'bg-success' : 'bg-danger'}`}
            />
            <p className="text-xs font-semibold text-ink">{name}</p>
          </div>
          <p className="truncate font-mono text-[11px] text-muted">{target}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
            healthy
              ? 'border-success-border bg-success-soft text-success-dark'
              : 'border-danger-border bg-danger-soft text-danger-dark'
          }`}
        >
          <span aria-hidden="true">{healthy ? '✓' : '✕'}</span>
          <span>{healthy ? 'Healthy' : 'Unreachable'}</span>
        </span>
      </div>
      {!healthy ? <p className="mt-3 text-xs leading-relaxed text-muted">{guidance}</p> : null}
    </Panel>
  );
}

function GuidanceList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <ul className="space-y-1.5 rounded-lg border border-warn-border bg-warn-soft px-4 py-3 text-xs leading-relaxed text-warn-dark">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true">→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
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

  const guidance: string[] = [];
  if (metrics) {
    if (metrics.queues.work < 0) {
      guidance.push('RabbitMQ is unreachable. Check the broker and AMQP_URL, then reload.');
    }
    if (metrics.queues.deadLetter > 0) {
      guidance.push('Dead-letter messages exist. Inspect and replay or purge them with the runner DLQ tooling.');
    }
    if (metrics.outbox.failed > 0) {
      guidance.push('Publish retries were exhausted for some runs. Check RabbitMQ connectivity and the API logs.');
    }
    if (metrics.outbox.pending > 0) {
      guidance.push('The outbox has pending jobs. They publish automatically once the broker is reachable.');
    }
  }

  return (
    <section aria-labelledby="diagnostics-heading" className="space-y-6">
      <div className="border-b border-line/80 pb-5">
        <SectionHeading
          eyebrow="RelayCheck / Diagnostics"
          title="Pipeline health"
          titleId="diagnostics-heading"
          description="Live service health and aggregate counts — queue depth, outbox backlog, and run outcomes. Counts only, never payloads."
        />
      </div>

      <section aria-labelledby="health-heading" className="space-y-3">
        <h2 id="health-heading" className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
          Services
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <ServiceCard
            name="Control API"
            healthy={apiHealthy}
            target={API_BASE}
            guidance="Start the Control API and reload. Pages that depend on it will show their own error state."
          />
          <ServiceCard
            name="Demo receiver"
            healthy={receiverHealthy}
            target={RECEIVER_BASE}
            guidance="Start the demo receiver in test mode. Fault and timeout scenarios require it."
          />
        </div>
      </section>

      {errorMessage ? (
        <ErrorPanel
          title="Could not load metrics"
          message={errorMessage}
          hint="Start the Control API (default http://localhost:3200) and reload this page."
        />
      ) : metrics ? (
        <div className="space-y-6">
          <GuidanceList items={guidance} />

          <section aria-labelledby="runs-heading" className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="runs-heading" className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
                Runs by status
              </h2>
              <span className="font-mono text-[10px] text-muted">
                Snapshot {new Date(metrics.generatedAt).toLocaleTimeString('en-GB')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {STATUS_ORDER.map((status) => (
                <Metric
                  key={status}
                  label={status}
                  value={String(metrics?.runs[status] ?? 0)}
                  tone={
                    status === 'passed'
                      ? 'success'
                      : status === 'failed'
                        ? 'danger'
                        : status === 'error'
                          ? 'warn'
                          : status === 'running'
                            ? 'info'
                            : 'neutral'
                  }
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="pipeline-heading" className="space-y-3">
            <h2 id="pipeline-heading" className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
              Delivery pipeline
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric
                label="Work queue"
                value={metrics.queues.work < 0 ? '—' : String(metrics.queues.work)}
                detail={metrics.queues.work < 0 ? 'Broker unreachable' : 'Jobs awaiting the runner'}
                tone={metrics.queues.work < 0 ? 'warn' : 'neutral'}
              />
              <Metric
                label="Dead-letter queue"
                value={String(metrics.queues.deadLetter)}
                detail="Poison or exhausted jobs"
                tone={metrics.queues.deadLetter > 0 ? 'warn' : 'neutral'}
              />
              <Metric
                label="Outbox pending"
                value={String(metrics.outbox.pending)}
                detail={`Oldest: ${formatAge(metrics.outbox.oldestPendingAgeMs)}`}
                tone={metrics.outbox.pending > 0 ? 'warn' : 'neutral'}
              />
              <Metric
                label="Outbox failed"
                value={String(metrics.outbox.failed)}
                detail="Publish retries exhausted"
                tone={metrics.outbox.failed > 0 ? 'danger' : 'neutral'}
              />
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
