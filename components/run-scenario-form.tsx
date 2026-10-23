import { createRunAction } from '@/lib/actions';
import type { PublicTarget } from '@/lib/api';

const SCENARIOS: { value: string; label: string; description: string; expected: string }[] = [
  {
    value: 'duplicate_delivery',
    label: 'Duplicate delivery',
    description: 'The same event ID is delivered three times to the receiver.',
    expected: 'Expects 3 attempts and exactly 1 business effect.',
  },
  {
    value: 'receiver_failure',
    label: 'Controlled receiver failure',
    description: 'The receiver is made to return a controlled 503.',
    expected: 'Expects that error and no business effect.',
  },
  {
    value: 'receiver_timeout',
    label: 'Receiver timeout',
    description: 'The receiver is made to respond slower than the client timeout.',
    expected: 'Expects a recorded timeout attempt.',
  },
];

/**
 * Plain server-action form (no client JavaScript required). It exposes only
 * the scenario selector — never a destination URL.
 */
export function RunScenarioForm({ targets }: { targets: PublicTarget[] }) {
  const targetOptions =
    targets.length > 0
      ? targets
      : [{ name: 'demo-receiver', kind: 'demo' as const, oracle: true }];

  return (
    <form action={createRunAction} className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Choose a scenario
        </legend>
        <div className="grid gap-3">
          {SCENARIOS.map((scenario, index) => (
            <label key={scenario.value} className="block cursor-pointer">
              <input
                type="radio"
                name="scenario"
                value={scenario.value}
                defaultChecked={index === 0}
                className="peer sr-only"
              />
              <span className="flex items-start justify-between gap-5 rounded-2xl border border-line bg-surface px-5 py-4 transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-checked:[&>span:last-child]:opacity-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember hover:border-ink/40">
                <span className="space-y-1.5">
                  <span className="block text-sm font-semibold">{scenario.label}</span>
                  <span className="block text-xs leading-relaxed opacity-70">
                    {scenario.description}
                  </span>
                  <span className="block pt-1 font-mono text-[11px] uppercase tracking-[0.12em] opacity-60">
                    {scenario.expected}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-current opacity-30"
                />
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <section
        aria-labelledby="preview-heading"
        className="rounded-2xl border border-line bg-surface p-5 shadow-card"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Bounded by design</p>
        <h2 id="preview-heading" className="mt-1 text-base font-semibold text-ink">
          What every run guarantees
        </h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Target</dt>
            <dd className="mt-1 text-ink/80">Fixed local demo receiver, chosen server-side</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Parameters
            </dt>
            <dd className="mt-1 text-ink/80">Generated per run — never user-controlled</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Bounds</dt>
            <dd className="mt-1 text-ink/80">Bounded attempts, timeouts, and retries</dd>
          </div>
        </dl>
        <p className="mt-4 border-t border-line/70 pt-3 text-xs text-muted">
          The form cannot target any other host. Fault scenarios require the receiver to run in
          test mode.
        </p>
      </section>

      <section
        aria-labelledby="target-heading"
        className="rounded-2xl border border-line bg-surface p-5 shadow-card"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Delivery target
        </p>
        <h2 id="target-heading" className="mt-1 text-base font-semibold text-ink">
          Configured targets only
        </h2>
        <p className="mt-1 text-xs text-muted">
          The API never accepts a URL. Only targets registered in the server configuration can be
          selected.
        </p>
        <div className="mt-4 space-y-1.5 sm:max-w-sm">
          <label htmlFor="target" className="block text-xs font-medium text-muted">
            Target
          </label>
          <select
            id="target"
            name="target"
            defaultValue="demo-receiver"
            className="w-full rounded-xl border border-line bg-paper/50 px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          >
            {targetOptions.map((target) => (
              <option key={target.name} value={target.name}>
                {target.name}
                {target.kind === 'demo'
                  ? ' (demo receiver)'
                  : target.oracle
                    ? ' (remote, oracle)'
                    : ' (remote, status only)'}
              </option>
            ))}
          </select>
          {targetOptions.some((target) => target.kind === 'remote') ? (
            <p className="text-xs text-warn">
              Remote targets verify delivery status only; no business-effect oracle is available.
            </p>
          ) : null}
        </div>
      </section>

      <section
        aria-labelledby="advanced-heading"
        className="rounded-2xl border border-line bg-surface p-5 shadow-card"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Advanced (optional)
        </p>
        <h2 id="advanced-heading" className="mt-1 text-base font-semibold text-ink">
          Bounded overrides
        </h2>
        <p className="mt-1 text-xs text-muted">
          Only the fields relevant to the selected scenario are sent. Bounds are enforced
          server-side; the Control API rejects anything outside them.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
              className="w-full rounded-xl border border-line bg-paper/50 px-3 py-2 font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
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
              className="w-full rounded-xl border border-line bg-paper/50 px-3 py-2 font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
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
              className="w-full rounded-xl border border-line bg-paper/50 px-3 py-2 font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
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
              className="w-full rounded-xl border border-line bg-paper/50 px-3 py-2 font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink"
        >
          Start run
          <span aria-hidden="true">→</span>
        </button>
        <p className="text-xs text-muted">Creates a queued run and returns to the history.</p>
      </div>
    </form>
  );
}
