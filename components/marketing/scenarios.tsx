import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  Clock,
  LockKeyhole,
  Repeat2,
} from './icons';
import { TiltCard } from './tilt-card';

const EVENT_ID = 'evt_7eb2f396-8bfb-4369-8887-01ed31b62528';
const DISPLAY_EVENT_ID = 'evt_7eb2f396-8bfb-4369…';

const DUPLICATE_ATTEMPTS = [
  { n: 1, status: '201 Created', ms: '49 ms' },
  { n: 2, status: '201 Created', ms: '14 ms' },
  { n: 3, status: '201 Created', ms: '8 ms' },
] as const;

const FAILURE_LOG = [
  { time: '10:24:01', status: '503' },
  { time: '10:24:02', status: '503' },
  { time: '10:24:03', status: '503' },
] as const;

const TIMEOUT_LOG = [
  { time: '10:24:01', status: '2,000 ms' },
  { time: '10:24:04', status: '2,000 ms' },
] as const;

const PARAMETERS = [
  { label: 'Attempts', value: '1–5' },
  { label: 'Timeout', value: '500–15,000 ms' },
  { label: 'Injected status', value: '400–599' },
  { label: 'Injected delay', value: '0–10,000 ms' },
] as const;

export function MarketingScenarios() {
  return (
    <section id="product" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-8 sm:py-24">
      <div
        className="flex flex-col gap-6 border-b border-line pb-9 sm:flex-row sm:items-end sm:justify-between"
        data-reveal
      >
        <div className="max-w-2xl">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ember-dark">
            Scenarios
          </p>
          <h2 className="mt-2.5 font-display text-3xl font-normal leading-tight tracking-tight text-ink sm:text-[2.6rem]">
            Test the failures that matter.
          </h2>
          <p className="mt-3.5 max-w-xl font-display text-[17px] leading-[1.7] text-ink-secondary">
            Exercise real delivery edge cases. Trace every request, response, and verified business
            outcome.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-line bg-surface px-3 py-1.5 shadow-card sm:self-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            4 scenarios · repeatable
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <TiltCard
          tiltStrength={4}
          revealItem
          className="group relative overflow-clip rounded-3xl border border-line bg-gradient-to-br from-surface via-surface to-paper shadow-card transition-shadow duration-300 hover:shadow-elevated"
        >
          <div className="relative z-10 grid lg:grid-cols-[0.9fr_1.1fr] [transform-style:preserve-3d]">
            <div className="flex flex-col border-b border-line p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-ember-border bg-ember-soft text-ember-dark shadow-card">
                  <Repeat2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-ember-dark">
                    Core scenario · 01
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">Idempotency check</p>
                </div>
              </div>

              <h3 className="mt-6 font-display text-2xl font-normal tracking-tight text-ink sm:text-[1.8rem]">
                Duplicate delivery
              </h3>
              <p className="mt-2 max-w-md font-display text-base leading-[1.7] text-ink-secondary">
                Replay a single event ID three times. Confirm every delivery is recorded while the
                receiver applies one business effect.
              </p>

              <div className="mt-6 rounded-xl border border-line bg-sand/45 p-3.5">
                <div className="flex items-center gap-2 text-muted">
                  <Activity className="h-3.5 w-3.5 text-ember-dark" />
                  <span className="text-[11px] font-semibold tracking-[0.04em] text-ink-secondary">
                    One event ID · three attempts
                  </span>
                </div>
                <code className="mt-1.5 block truncate font-mono text-xs font-semibold tracking-tight text-ink" title={EVENT_ID}>
                  {DISPLAY_EVENT_ID}
                </code>
              </div>

              <div className="mt-auto pt-5">
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-success-border bg-success-soft/80 px-3.5 py-3">
                  <span className="flex items-baseline gap-1.5 text-success">
                    <strong className="font-display text-xl font-medium leading-none">3</strong>
                    <span className="text-[11px] font-semibold tracking-wide">attempts</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-success/70" />
                  <span className="flex items-baseline gap-1.5 text-success">
                    <strong className="font-display text-xl font-medium leading-none">1</strong>
                    <span className="text-[11px] font-semibold tracking-wide">business effect</span>
                  </span>
                  <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-success">
                    <Check className="h-3 w-3" /> Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-sand/25 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Delivery evidence
                  </p>
                  <p className="mt-1 text-xs text-muted">POST /api/webhooks/demo</p>
                </div>
                <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted">
                  3 attempts
                </span>
              </div>

              <ul className="mt-5 space-y-2" aria-label="Illustrative duplicate delivery attempts">
                {DUPLICATE_ATTEMPTS.map((attempt) => (
                  <li
                    key={attempt.n}
                    className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-line/90 bg-surface px-3 py-3 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sand font-mono text-[10px] font-semibold text-muted">
                      0{attempt.n}
                    </span>
                    <span className="min-w-0">
                      <code className="block truncate font-mono text-[11px] font-semibold tracking-tight text-ink" title={EVENT_ID}>
                        {DISPLAY_EVENT_ID}
                      </code>
                      <span className="mt-0.5 block text-[10px] font-medium text-muted">same event ID</span>
                    </span>
                    <span className="text-right">
                      <span className="inline-flex rounded-md bg-success-soft px-2 py-1 font-mono text-[9px] font-semibold text-success">
                        {attempt.status}
                      </span>
                      <span className="mt-1 block font-mono text-[9px] tabular-nums text-muted">
                        {attempt.ms}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 flex items-center gap-2 text-[10px] font-semibold tracking-[0.08em] text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                Business effect confirmed
              </p>
            </div>
          </div>
        </TiltCard>

        <div className="grid gap-5 lg:grid-cols-2">
          <TiltCard
            tiltStrength={4}
            revealItem
            className="group relative overflow-clip rounded-2xl border border-line bg-gradient-to-br from-surface to-paper p-5 shadow-card transition-shadow duration-300 hover:shadow-elevated sm:p-6"
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-danger-border bg-danger-soft text-danger">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-danger">
                      Scenario · 02
                    </p>
                    <h3 className="mt-0.5 font-display text-lg font-medium tracking-tight text-ink">
                      Receiver failure
                    </h3>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-danger-border bg-danger-soft px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-danger">
                  503 injected
                </span>
              </div>
              <p className="mt-4 max-w-lg font-display text-base leading-[1.7] text-ink-secondary">
                Inject a controlled 503 response. Inspect each failed delivery and confirm that no
                business effect was applied.
              </p>

              <div className="mt-4 rounded-xl border border-line bg-sand/35 p-3">
                <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                  <span>Attempt log</span>
                  <span>POST · local receiver</span>
                </div>
                <ul className="space-y-1.5">
                  {FAILURE_LOG.map((line, index) => (
                    <li key={line.time} className="flex items-center justify-between gap-3 rounded-lg bg-surface/80 px-2.5 py-2 font-mono text-[9px]">
                      <span className="flex items-center gap-2 text-muted">
                        <span className="text-stone">0{index + 1}</span>
                        {line.time}
                      </span>
                      <span className="rounded bg-danger-soft px-1.5 py-0.5 font-semibold text-danger">
                        {line.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">Outcome</span>
                <span className="text-right text-[13px] font-semibold text-danger">Assertion failed · 0 business effects</span>
              </div>
            </div>
          </TiltCard>

          <TiltCard
            tiltStrength={4}
            revealItem
            className="group relative overflow-clip rounded-2xl border border-line bg-gradient-to-br from-surface to-paper p-5 shadow-card transition-shadow duration-300 hover:shadow-elevated sm:p-6"
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-warn-border bg-warn-soft text-warn">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-warn">
                      Scenario · 03
                    </p>
                    <h3 className="mt-0.5 font-display text-lg font-medium tracking-tight text-ink">
                      Receiver timeout
                    </h3>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-warn-border bg-warn-soft px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-warn">
                  2,000 ms limit
                </span>
              </div>
              <p className="mt-4 max-w-lg font-display text-base leading-[1.7] text-ink-secondary">
                Delay the receiver beyond the 2,000 ms deadline. Review the timeout recorded for
                each attempt.
              </p>

              <div className="mt-4 rounded-xl border border-line bg-sand/35 p-3">
                <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                  <span>Attempt log</span>
                  <span>POST · local receiver</span>
                </div>
                <ul className="space-y-1.5">
                  {TIMEOUT_LOG.map((line, index) => (
                    <li key={line.time} className="flex items-center justify-between gap-3 rounded-lg bg-surface/80 px-2.5 py-2 font-mono text-[9px]">
                      <span className="flex items-center gap-2 text-muted">
                        <span className="text-stone">0{index + 1}</span>
                        {line.time}
                      </span>
                      <span className="rounded bg-warn-soft px-1.5 py-0.5 font-semibold text-warn">
                        timeout · {line.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">Outcome</span>
                <span className="text-right text-[13px] font-semibold text-warn">Timeout recorded · 2 attempts</span>
              </div>
            </div>
          </TiltCard>
        </div>

        <section className="rounded-2xl border border-line bg-sand/35 p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ember-dark">
                <LockKeyhole className="h-3.5 w-3.5" />
                Server-enforced controls
              </div>
              <h3 className="mt-2 font-display text-xl font-normal tracking-tight text-ink sm:text-2xl">
                Bounded by design.
              </h3>
              <p className="mt-1.5 font-display text-base leading-[1.7] text-ink-secondary">
                Adjust supported limits while the event, payload, and destination stay controlled.
              </p>
            </div>

            <dl className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:max-w-[680px]">
              {PARAMETERS.map((param) => (
                <div key={param.label} className="rounded-xl border border-line bg-surface px-3 py-3 shadow-card">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                    {param.label}
                  </dt>
                  <dd className="mt-1.5 font-mono text-[12px] font-semibold text-ink sm:text-[13px]">
                    {param.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-5 flex items-start gap-2.5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
            <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember-dark" />
            <p>
              Event IDs, payloads, and target URLs remain server-controlled. Injected delay must
              exceed the configured timeout.
            </p>
          </div>
        </section>
      </div>

      <p className="mt-8 text-right font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
        Illustrative example data
      </p>
    </section>
  );
}
