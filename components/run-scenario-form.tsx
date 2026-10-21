import { createRunAction } from '@/lib/actions';

const PREVIEW_ROWS: { label: string; value: string }[] = [
  { label: 'Deliveries', value: '3 attempts (fixed)' },
  { label: 'Event', value: 'payment.succeeded — the same event ID on every delivery' },
  { label: 'Target', value: 'Configured local demo receiver (fixed, server-side)' },
  { label: 'Timeout', value: '5000 ms per delivery (bounded)' },
  { label: 'Verdict', value: '3 attempts recorded and exactly 1 business effect applied' },
];

/**
 * Plain server-action form (no client JavaScript required). It exposes only
 * the scenario selector — never a destination URL.
 */
export function RunScenarioForm() {
  return (
    <form action={createRunAction} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="scenario" className="block text-sm font-medium text-neutral-200">
          Scenario
        </label>
        <select
          id="scenario"
          name="scenario"
          defaultValue="duplicate_delivery"
          aria-describedby="scenario-help"
          className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:max-w-sm"
        >
          <option value="duplicate_delivery">Duplicate delivery</option>
        </select>
        <p id="scenario-help" className="text-xs text-neutral-400">
          Sends the same event three times and verifies the receiver applies one business effect.
        </p>
      </div>

      <section
        aria-labelledby="preview-heading"
        className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-4 py-4"
      >
        <h2 id="preview-heading" className="text-sm font-semibold text-neutral-200">
          Planned behavior
        </h2>
        <dl className="mt-3 space-y-2 text-sm">
          {PREVIEW_ROWS.map((row) => (
            <div key={row.label} className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-3">
              <dt className="text-neutral-400">{row.label}</dt>
              <dd className="text-neutral-200">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-neutral-500">
          Destination and parameters are chosen by RelayCheck. The form cannot target any other
          host.
        </p>
      </section>

      <button
        type="submit"
        className="inline-flex items-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
      >
        Start run
      </button>
    </form>
  );
}
