import { StatusBadge } from '@/components/status-badge';
import {
  Activity,
  Check,
  CircleAlert,
  Copy,
  Layers,
  Repeat2,
  ShieldCheck,
  Terminal,
} from './icons';

const EVENT_ID = 'evt_7eb2f396-8bfb-4369-8887-01ed31b62528';

const ATTEMPTS = [
  { n: 1, status: 201, ms: 49, time: '12:55:01.104', outcome: 'delivered' },
  { n: 2, status: 201, ms: 14, time: '12:55:01.156', outcome: 'delivered' },
  { n: 3, status: 201, ms: 8, time: '12:55:01.172', outcome: 'delivered' },
] as const;

/**
 * Authentic live product mockup for the landing page hero.
 * Shows the actual RelayCheck duplicate delivery test proof:
 * 3 HTTP attempts recorded -> 1 atomic business effect applied.
 */
export function HeroDashboardMock() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Subtle warm backdrop reflection */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-ember-soft/40 via-sand/50 to-transparent blur-xl"
      />

      <div
        role="region"
        aria-label="RelayCheck duplicate delivery scenario run preview"
        className="relative overflow-hidden rounded-xl border border-line bg-surface shadow-elevated"
      >
        {/* Window Chrome Header */}
        <div className="flex items-center justify-between border-b border-line bg-sand/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-line" />
            <span className="flex h-2.5 w-2.5 rounded-full bg-line" />
            <span className="flex h-2.5 w-2.5 rounded-full bg-line" />
            <span className="ml-2 font-mono text-[11px] font-medium text-muted">
              run_2aa23bf6 / duplicate_delivery
            </span>
          </div>
          <span className="rounded border border-line bg-surface px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted">
            Illustrative example data
          </span>
        </div>

        {/* Console Body */}
        <div className="p-5">
          {/* Top Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-ink">
                  duplicate_delivery
                </span>
                <span className="rounded bg-sand px-1.5 py-0.5 font-mono text-[10px] text-muted">
                  local
                </span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-muted">
                event_id: <span className="text-ink">{EVENT_ID.slice(0, 24)}…</span>
              </p>
            </div>
            <StatusBadge status="passed" size="md" />
          </div>

          {/* Core Metric Proof Strip */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <div className="rounded-lg border border-line bg-sand/30 p-2.5">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-muted">
                Deliveries Sent
              </span>
              <span className="mt-1 block font-mono text-xl font-semibold text-ink">3</span>
              <span className="block text-[10px] text-muted">runner HTTP requests</span>
            </div>
            <div className="rounded-lg border border-success-border bg-success-soft p-2.5">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-success">
                Business Effects
              </span>
              <span className="mt-1 block font-mono text-xl font-semibold text-success">1</span>
              <span className="block text-[10px] text-success/90">oracle DB verified</span>
            </div>
            <div className="rounded-lg border border-line bg-sand/30 p-2.5">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-muted">
                Total Duration
              </span>
              <span className="mt-1 block font-mono text-xl font-semibold text-ink">71 ms</span>
              <span className="block text-[10px] text-muted">claim to finalize</span>
            </div>
          </div>

          {/* Delivery Attempts Stream */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                Delivery Evidence Stream
              </span>
              <span className="font-mono text-[10px] text-muted">3 attempts · same ID</span>
            </div>

            <div className="mt-2 space-y-1.5">
              {ATTEMPTS.map((attempt) => (
                <div
                  key={attempt.n}
                  className="flex items-center justify-between rounded-lg border border-line/80 bg-paper/60 px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded font-mono text-[10px] font-semibold text-muted bg-sand">
                      #{attempt.n}
                    </span>
                    <span className="font-mono text-[11px] font-medium text-ink">
                      POST /api/webhooks/demo
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="rounded bg-success-soft px-1.5 py-0.5 text-[10px] font-semibold text-success">
                      {attempt.status} OK
                    </span>
                    <span className="w-12 text-right text-muted">{attempt.ms} ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Assertion Callout */}
          <div className="mt-4 flex items-center justify-between rounded-lg border border-success-border bg-success-soft/70 px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span className="font-mono text-[11px] font-medium text-success">
                business_effect_applied_once
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-success">
              <span>expected: 1</span>
              <span>·</span>
              <span>actual: 1</span>
              <Check className="h-3.5 w-3.5 text-success" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Clean Evidence Showcase Mockup for the Evidence section
 */
export function EvidenceRunMock() {
  return (
    <div className="space-y-3">
      <div
        role="region"
        aria-label="RelayCheck run detail evidence breakdown"
        className="overflow-hidden rounded-xl border border-line bg-surface shadow-card"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-sand/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-ink font-mono text-[10px] font-semibold text-paper">
              R
            </div>
            <div>
              <p className="text-xs font-semibold text-ink">Run Evidence Inspector</p>
              <p className="font-mono text-[9px] text-muted">Illustrative example data</p>
            </div>
          </div>
          <StatusBadge status="passed" size="md" />
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-ember-dark">
                duplicate_delivery
              </span>
              <p className="mt-1 font-mono text-xs font-medium text-ink">
                {EVENT_ID}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                3 delivery attempts recorded, 3 accepted by receiver, 1 business effect applied.
              </p>
            </div>
            <span className="rounded border border-line bg-sand/60 px-2 py-1 font-mono text-[10px] text-muted">
              demo-receiver (local)
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-line bg-sand/30 p-3">
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted">
                Delivery attempts
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-ink">3</p>
              <p className="mt-0.5 text-[10px] text-muted">HTTP deliveries sent</p>
            </div>
            <div className="rounded-lg border border-success-border bg-success-soft p-3">
              <p className="font-mono text-[9px] uppercase tracking-wider text-success">
                Business effects
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-success">1</p>
              <p className="mt-0.5 text-[10px] text-success/90">receiver-side oracle count</p>
            </div>
            <div className="rounded-lg border border-line bg-sand/30 p-3">
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted">
                Duration
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-ink">147 ms</p>
              <p className="mt-0.5 text-[10px] text-muted">from claim to finalize</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                Attempts table
              </p>
              <div className="mt-2 overflow-x-auto rounded-lg border border-line">
                <table className="w-full font-mono text-xs">
                  <thead className="bg-sand/60 text-[9px] uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">#</th>
                      <th className="px-3 py-2 text-left font-medium">HTTP</th>
                      <th className="px-3 py-2 text-left font-medium">Outcome</th>
                      <th className="px-3 py-2 text-right font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {ATTEMPTS.map((attempt) => (
                      <tr key={attempt.n} className="bg-surface">
                        <td className="px-3 py-2 font-medium text-ink">#{attempt.n}</td>
                        <td className="px-3 py-2">
                          <span className="font-semibold text-success">{attempt.status}</span>
                        </td>
                        <td className="px-3 py-2 text-muted">delivered</td>
                        <td className="px-3 py-2 text-right text-muted">{attempt.ms} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                Assertions
              </p>
              <ul className="mt-2 space-y-2">
                {[
                  ['delivery_attempt_count', '3 / 3'],
                  ['deliveries_accepted', '3 / 3'],
                  ['business_effect_applied_once', '1 / 1'],
                ].map(([name, value]) => (
                  <li
                    key={name}
                    className="flex items-center justify-between gap-2 rounded-lg border border-success-border bg-success-soft px-3 py-2 font-mono text-xs"
                  >
                    <span className="truncate text-success/90">{name}</span>
                    <span className="flex shrink-0 items-center gap-1.5 font-semibold text-success">
                      {value} <Check className="h-3 w-3" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-line bg-surface p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <Terminal className="h-3.5 w-3.5 text-ember" /> Failed
          </p>
          <p className="mt-1 text-[11px] text-muted">Assertion mismatch; scenario completed</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <CircleAlert className="h-3.5 w-3.5 text-warn" /> Error
          </p>
          <p className="mt-1 text-[11px] text-muted">Execution problem; verdict withheld</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <ShieldCheck className="h-3.5 w-3.5 text-success" /> Passed
          </p>
          <p className="mt-1 text-[11px] text-muted">All required assertions verified</p>
        </div>
      </div>
    </div>
  );
}
