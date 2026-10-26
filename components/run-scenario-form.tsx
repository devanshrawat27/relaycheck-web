'use client';

import { useState } from 'react';
import { createRunAction } from '@/lib/actions';
import type { PublicTarget } from '@/lib/api';
import { Collapsible, Panel, PanelHeader } from '@/components/ui';
import { buttonPrimary, inputBase } from '@/lib/ui';

const SCENARIOS = [
  {
    value: 'duplicate_delivery',
    label: 'Duplicate delivery',
    description:
      'The same event ID is delivered several times. A correct receiver applies the business effect once, no matter how often it is retried.',
    expected: 'Expects the configured attempts and exactly 1 business effect.',
    tag: 'core proof',
  },
  {
    value: 'receiver_failure',
    label: 'Controlled receiver failure',
    description:
      'The receiver returns a controlled error status. Verify the run records the failed deliveries and applies no business effect.',
    expected: 'Expects the injected error status and no business effect.',
    tag: 'fault injection',
  },
  {
    value: 'receiver_timeout',
    label: 'Receiver timeout',
    description:
      'The receiver responds slower than the client timeout. Verify the attempt is recorded as a timeout instead of a success.',
    expected: 'Expects a recorded timeout attempt.',
    tag: 'latency boundary',
  },
] as const;

type ScenarioValue = (typeof SCENARIOS)[number]['value'];

interface FormState {
  scenario: ScenarioValue;
  target: string;
  deliveryCount: string;
  timeoutMs: string;
  httpStatus: string;
  delayMs: string;
}

function scenarioMeta(value: ScenarioValue) {
  return SCENARIOS.find((scenario) => scenario.value === value) ?? SCENARIOS[0];
}

function Summary({ state, targetLabel }: { state: FormState; targetLabel: string }) {
  const meta = scenarioMeta(state.scenario);
  const lines: Array<{ label: string; value: string }> = [
    { label: 'Scenario', value: meta.label },
    { label: 'Target', value: targetLabel },
  ];

  if (state.scenario === 'duplicate_delivery') {
    lines.push({ label: 'Delivery attempts', value: state.deliveryCount || '3 (default)' });
  }
  if (state.scenario === 'receiver_failure') {
    lines.push({ label: 'Injected status', value: state.httpStatus || '503 (default)' });
  }
  if (state.scenario === 'receiver_timeout') {
    lines.push({ label: 'Injected delay', value: state.delayMs || '2000 ms (default)' });
  }
  lines.push({ label: 'Per-delivery timeout', value: state.timeoutMs ? `${state.timeoutMs} ms` : 'scenario default' });

  return (
    <Panel className="bg-sand/30">
      <PanelHeader
        eyebrow="Before you start"
        title="Review what will run"
        description={meta.expected}
      />
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 px-5 py-4 text-xs sm:grid-cols-2">
        {lines.map((line) => (
          <div key={line.label} className="flex items-center justify-between gap-3 border-b border-line/60 pb-1.5 last:border-b-0 sm:last:border-b">
            <dt className="text-muted">{line.label}</dt>
            <dd className="font-mono font-medium text-ink">{line.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/**
 * Plain server-action form with a small client summary. Exposes scenario
 * selection, a configured target name, and bounded overrides — never a
 * destination URL. Server-side validation and API contracts are unchanged.
 */
export function RunScenarioForm({ targets }: { targets: PublicTarget[] }) {
  const targetOptions =
    targets.length > 0
      ? targets
      : [{ name: 'demo-receiver', kind: 'demo' as const, oracle: true }];

  const [state, setState] = useState<FormState>({
    scenario: 'duplicate_delivery',
    target: targetOptions[0]!.name,
    deliveryCount: '',
    timeoutMs: '',
    httpStatus: '',
    delayMs: '',
  });

  function handleChange(event: React.FormEvent<HTMLFormElement>): void {
    const data = new FormData(event.currentTarget);
    const scenario = String(data.get('scenario') ?? 'duplicate_delivery') as ScenarioValue;
    setState({
      scenario,
      target: String(data.get('target') ?? targetOptions[0]!.name),
      deliveryCount: String(data.get('deliveryCount') ?? ''),
      timeoutMs: String(data.get('timeoutMs') ?? ''),
      httpStatus: String(data.get('httpStatus') ?? ''),
      delayMs: String(data.get('delayMs') ?? ''),
    });
  }

  const selectedTarget = targetOptions.find((target) => target.name === state.target);
  const targetLabel = selectedTarget
    ? `${selectedTarget.name}${selectedTarget.kind === 'demo' ? ' (local demo receiver)' : selectedTarget.oracle ? ' (remote with oracle)' : ' (remote, status only)'}`
    : state.target;

  return (
    <form action={createRunAction} onChange={handleChange} className="space-y-6">
      {/* 1. Scenario selection — the first decision. */}
      <fieldset className="space-y-3">
        <legend className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ember-dark">
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
              <div className="scenario-card flex h-full flex-col justify-between rounded-xl border border-line bg-surface p-4 transition-colors group-hover:border-stone/50">
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
                  <h2 className="mt-3 text-[15px] font-semibold leading-snug tracking-tight text-ink">
                    {scenario.label}
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                    {scenario.description}
                  </p>
                </div>
                <div className="mt-4 border-t border-line/60 pt-2.5">
                  <p className="font-mono text-[10px] leading-relaxed text-muted">{scenario.expected}</p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 2. Target — names only, never a URL. */}
      <Panel>
        <PanelHeader
          eyebrow="Delivery target"
          title="Choose a configured target"
          description="The API never accepts a URL. Only targets configured on the server can be selected."
        />
        <div className="space-y-2 px-5 py-4">
          <label htmlFor="target" className="block text-xs font-medium text-ink">
            Target
          </label>
          <select id="target" name="target" defaultValue={targetOptions[0]!.name} className={inputBase}>
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
      </Panel>

      {/* 3. Advanced bounds — collapsed by default. */}
      <Collapsible
        title="Advanced parameters (optional)"
        subtitle="Bounded overrides, validated on the server. Irrelevant fields are ignored per scenario."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="deliveryCount" className="block text-xs font-medium text-muted">
              Delivery attempts (duplicate only, 1–5)
            </label>
            <input id="deliveryCount" name="deliveryCount" type="number" min={1} max={5} placeholder="3" className={inputBase} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="timeoutMs" className="block text-xs font-medium text-muted">
              Timeout per delivery (500–15000 ms)
            </label>
            <input id="timeoutMs" name="timeoutMs" type="number" min={500} max={15000} step={100} placeholder="scenario default" className={inputBase} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="httpStatus" className="block text-xs font-medium text-muted">
              Injected status (failure only, 400–599)
            </label>
            <input id="httpStatus" name="httpStatus" type="number" min={400} max={599} placeholder="503" className={inputBase} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="delayMs" className="block text-xs font-medium text-muted">
              Injected delay (timeout only, must exceed timeout)
            </label>
            <input id="delayMs" name="delayMs" type="number" min={0} max={10000} step={100} placeholder="2000" className={inputBase} />
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          Bounded by design: finite timeouts, generated IDs, and a fixed configured target. Fault
          scenarios require the local demo receiver in test mode.
        </p>
      </Collapsible>

      {/* 4. Final summary before submission. */}
      <Summary state={state} targetLabel={targetLabel} />

      {/* 5. Action row. */}
      <div className="flex flex-wrap items-center gap-4 border-t border-line/70 pt-5">
        <button type="submit" className={`${buttonPrimary} min-h-10 px-5 py-2.5 text-sm`}>
          Start run <span aria-hidden="true">→</span>
        </button>
        <p className="text-xs text-muted">Creates a queued run and returns to the run list.</p>
      </div>
    </form>
  );
}
