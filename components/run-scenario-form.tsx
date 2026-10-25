import { createRunAction } from '@/lib/actions';
import type { PublicTarget } from '@/lib/api';

const SCENARIOS = [
  {
    value: 'duplicate_delivery',
    label: 'Duplicate delivery',
    description: 'The same event ID is delivered three times to the receiver.',
    expected: 'Expects 3 attempts and exactly 1 business effect.',
    tag: 'core proof',
  },
  {
    value: 'receiver_failure',
    label: 'Controlled receiver failure',
    description: 'The receiver is made to return a controlled 503.',
    expected: 'Expects that error and no business effect.',
    tag: 'fault injection',
  },
  {
    value: 'receiver_timeout',
    label: 'Receiver timeout',
    description: 'The receiver is made to respond slower than the client timeout.',
    expected: 'Expects a recorded timeout attempt.',
    tag: 'latency boundary',
  },
];

/**
 * Plain server-action form (no client JavaScript required).
 * Exposes scenario selection and bounded overrides — never a destination URL.
 */
export function RunScenarioForm({ targets }: { targets: PublicTarget[] }) {
  const targetOptions =
    targets.length > 0
      ? targets
      : [{ name: 'demo-receiver', kind: 'demo' as const, oracle: true }];

  return (
    <form action={createRunAction} className="space-y-8">
      {/* 1. Scenario Selection */}
      <fieldset className="space-y-4">
        <legend className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          Choose a scenario
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {SCENARIOS.map((scenario, index) => (
            <label key={scenario.value} className="scenario-option group relative block cursor-pointer">
              <input
                type="radio"
                name="scenario"
                value={scenario.value}
                defaultChecked={index === 0}
                className="peer sr-only"
              />
              <div className="scenario-card flex h-full flex-col justify-between rounded-xl border border-line bg-surface p-4 transition-all hover:border-line hover:shadow-card peer-checked:shadow-card">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="scenario-tag rounded bg-sand px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted">
                      {scenario.tag}
                    </span>
                    <span
                      aria-hidden="true"
                      className="scenario-dot flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-line bg-surface"
                    >
                      <span className="scenario-dot-inner h-1.5 w-1.5 rounded-full bg-white opacity-0" />
                    </span>
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold leading-snug tracking-tight text-ink">
                    {scenario.label}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                    {scenario.description}
                  </p>
                </div>
                <div className="mt-4 border-t border-line/60 pt-2.5">
                  <p className="font-mono text-[10px] leading-relaxed text-muted">
                    {scenario.expected}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 2. Target & Configuration */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Delivery Target Section */}
        <section
          aria-labelledby="target-heading"
          className="rounded-xl border border-line bg-surface p-5 shadow-card"
        >
          <div className="border-b border-line/70 pb-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Delivery target
            </p>
            <h2 id="target-heading" className="mt-1 text-sm font-semibold text-ink">
              Configured targets only
            </h2>
            <p className="mt-1 text-xs text-muted">
              The API never accepts a URL. Only pre-configured targets can be chosen.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <label htmlFor="target" className="block text-xs font-medium text-ink">
              Target
            </label>
            <select
              id="target"
              name="target"
              defaultValue="demo-receiver"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ember"
            >
              {targetOptions.map((target) => (
                <option key={target.name} value={target.name}>
                  {target.name}
                  {target.kind === 'demo'
                    ? ' (local demo receiver)'
                    : target.oracle
                      ? ' (remote with oracle)'
                      : ' (remote, status only)'}
                </option>
              ))}
            </select>
            {targetOptions.some((target) => target.kind === 'remote') ? (
              <p className="text-xs text-warn-dark">
                Remote targets verify delivery status only; no business-effect oracle is available.
              </p>
            ) : null}
          </div>
        </section>

        {/* Bounded Safeguards Section */}
        <section
          aria-labelledby="preview-heading"
          className="rounded-xl border border-line bg-sand/30 p-5"
        >
          <div className="border-b border-line/70 pb-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Bounded by design
            </p>
            <h2 id="preview-heading" className="mt-1 text-sm font-semibold text-ink">
              What every run guarantees
            </h2>
            <p className="mt-1 text-xs text-muted">
              Safe execution boundaries are enforced server-side.
            </p>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-2.5 text-xs">
            <div className="rounded-lg border border-line bg-surface p-2.5">
              <dt className="font-mono text-[9px] uppercase tracking-wider text-muted">Target</dt>
              <dd className="mt-1 text-ink font-medium">Local receiver</dd>
            </div>
            <div className="rounded-lg border border-line bg-surface p-2.5">
              <dt className="font-mono text-[9px] uppercase tracking-wider text-muted">Parameters</dt>
              <dd className="mt-1 text-ink font-medium">Generated per run</dd>
            </div>
            <div className="rounded-lg border border-line bg-surface p-2.5">
              <dt className="font-mono text-[9px] uppercase tracking-wider text-muted">Bounds</dt>
              <dd className="mt-1 text-ink font-medium">Finite timeouts</dd>
            </div>
          </dl>
          <p className="mt-3 text-[11px] text-muted">
            The form cannot target arbitrary hosts. Fault scenarios require local test mode.
          </p>
        </section>
      </div>

      {/* 3. Advanced Bounded Overrides */}
      <section
        aria-labelledby="advanced-heading"
        className="rounded-xl border border-line bg-surface p-5 shadow-card"
      >
        <div className="border-b border-line/70 pb-3">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Advanced (optional)
          </p>
          <h2 id="advanced-heading" className="mt-1 text-sm font-semibold text-ink">
            Bounded overrides
          </h2>
          <p className="mt-1 text-xs text-muted">
            Only the fields relevant to the selected scenario are sent. Bounds are enforced server-side.
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <label htmlFor="deliveryCount" className="block text-xs font-medium text-muted">
              Delivery attempts (duplicate only, 1–5)
            </label>
            <input
              id="deliveryCount"
              name="deliveryCount"
              type="number"
              min={1}
              max={5}
              placeholder="3"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ember"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="timeoutMs" className="block text-xs font-medium text-muted">
              Timeout per delivery (500–15000 ms)
            </label>
            <input
              id="timeoutMs"
              name="timeoutMs"
              type="number"
              min={500}
              max={15000}
              step={100}
              placeholder="scenario default"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ember"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="httpStatus" className="block text-xs font-medium text-muted">
              Injected status (failure only, 400–599)
            </label>
            <input
              id="httpStatus"
              name="httpStatus"
              type="number"
              min={400}
              max={599}
              placeholder="503"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ember"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="delayMs" className="block text-xs font-medium text-muted">
              Injected delay (timeout only, must exceed timeout)
            </label>
            <input
              id="delayMs"
              name="delayMs"
              type="number"
              min={0}
              max={10000}
              step={100}
              placeholder="2000"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ember"
            />
          </div>
        </div>
      </section>

      {/* 4. Action Row */}
      <div className="flex flex-wrap items-center gap-4 border-t border-line/70 pt-6">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-ember px-6 py-2.5 text-xs font-semibold text-white transition-all hover:bg-ember-dark hover:shadow-xs active:scale-95"
        >
          Start run
          <span aria-hidden="true">→</span>
        </button>
        <p className="text-xs text-muted">Creates a queued run and returns to the history.</p>
      </div>
    </form>
  );
}
