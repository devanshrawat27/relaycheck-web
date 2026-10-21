import { createRunAction } from '@/lib/actions';

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
export function RunScenarioForm() {
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
