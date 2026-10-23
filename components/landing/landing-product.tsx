import Link from 'next/link';
import { ArrowRight, Check, FileText, LayoutDashboard, PlayCircle, ShieldCheck } from '@/components/landing/icons';
import { StatusBadge } from '@/components/status-badge';

const RUNS = [
  {
    scenario: 'duplicate_delivery',
    status: 'passed' as const,
    summary: '3 attempts · 1 business effect',
    duration: '156 ms',
  },
  {
    scenario: 'receiver_failure',
    status: 'failed' as const,
    summary: 'Injected 503 · 0 business effects',
    duration: '84 ms',
  },
  {
    scenario: 'duplicate_delivery',
    status: 'passed' as const,
    summary: '5 attempts · 1 business effect',
    duration: '203 ms',
  },
  {
    scenario: 'receiver_timeout',
    status: 'passed' as const,
    summary: 'Timeout recorded · 1 business effect',
    duration: '2.14 s',
  },
  {
    scenario: 'duplicate_delivery',
    status: 'error' as const,
    summary: 'Oracle unreachable · verdict withheld',
    duration: '3.01 s',
  },
];

const BENEFITS = [
  'Attempts are measured separately from business effects',
  'Failed assertions and execution errors stay distinct',
  'Every run keeps its attempts, assertions, and timings',
];

function PreviewFrame() {
  return (
    <div
      role="img"
      aria-label="Illustrative RelayCheck dashboard with a run history table, status badges, and an evidence summary"
      className="overflow-hidden rounded-xl border border-line bg-surface shadow-card"
    >
      <div aria-hidden className="select-none">
        <div className="flex items-center gap-3 border-b border-line bg-sand/50 px-4 py-2.5">
          <span className="flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-[4px] bg-ink" />
            <span className="text-[12px] font-semibold text-ink">RelayCheck</span>
          </span>
          <span className="ml-2 hidden items-center gap-1 rounded-md bg-surface px-2 py-1 text-[10px] font-medium text-muted sm:flex">
            <LayoutDashboard className="h-3 w-3" aria-hidden /> Runs
          </span>
          <span className="hidden items-center gap-1 px-2 py-1 text-[10px] text-muted sm:flex">
            <PlayCircle className="h-3 w-3" aria-hidden /> Run a scenario
          </span>
          <span className="ml-auto rounded-full border border-line bg-surface px-2.5 py-1 text-[9px] text-stone">
            Illustrative example data
          </span>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[13px] font-semibold text-ink">Run history</p>
              <p className="text-[10px] text-muted">Workspace-scoped scenario evidence</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-ember px-2.5 py-1.5 text-[10px] font-semibold text-white">
              Run a scenario
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {['All', 'Passed', 'Failed', 'Error'].map((filter, index) => (
              <span
                key={filter}
                className={
                  index === 0
                    ? 'rounded-md border border-ember-border bg-ember-soft px-2 py-1 text-[9px] font-medium text-ember-dark'
                    : 'rounded-md border border-line bg-surface px-2 py-1 text-[9px] text-muted'
                }
              >
                {filter}
              </span>
            ))}
          </div>

          <div className="mt-3 overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[480px] text-left">
              <thead className="bg-sand/60 font-mono text-[8.5px] uppercase tracking-[0.08em] text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Scenario</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Result</th>
                  <th className="px-3 py-2 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {RUNS.map((run, index) => (
                  <tr key={index} className="border-t border-line/70">
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-ink">
                      {run.scenario}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="px-3 py-2 text-[10px] text-muted">{run.summary}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-muted">
                      {run.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-line bg-paper/60 p-2.5">
              <p className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-muted">
                Delivery attempts
              </p>
              <ul className="mt-1.5 space-y-1">
                {[1, 2, 3].map((n) => (
                  <li
                    key={n}
                    className="flex items-center justify-between rounded bg-surface px-2 py-1 font-mono text-[9px] text-muted"
                  >
                    <span>#{n}</span>
                    <span className="text-success">201</span>
                    <span>{[49, 14, 8][n - 1]} ms</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-line bg-paper/60 p-2.5">
              <p className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-muted">
                Assertions
              </p>
              <ul className="mt-1.5 space-y-1">
                <li className="flex items-center justify-between rounded bg-success-soft px-2 py-1 text-[9px] text-success">
                  attempts = 3 <Check className="h-3 w-3" aria-hidden />
                </li>
                <li className="flex items-center justify-between rounded bg-success-soft px-2 py-1 text-[9px] text-success">
                  effects = 1 <Check className="h-3 w-3" aria-hidden />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingProduct() {
  return (
    <section id="product" className="border-t border-line pt-16 sm:pt-24">
      <div className="grid gap-10 lg:grid-cols-[1.28fr_0.72fr] lg:items-center lg:gap-14">
        <div className="min-w-0">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
            Product preview
          </p>
          <PreviewFrame />
        </div>

        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember-dark">
            A clearer view of what happened
          </p>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
            A run is more than a status code.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Open any run to see the sender-side attempts, receiver-side effects, assertion values,
            and safe error details — all in one evidence trail.
          </p>
          <ul className="mt-6 space-y-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-sm text-ink">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ember-soft text-ember-dark">
                  <Check className="h-2.5 w-2.5" aria-hidden />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-medium">
            <Link
              href="/runs/new"
              className="inline-flex items-center gap-2 text-ember-dark underline-offset-4 hover:underline"
            >
              Run a scenario <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href="#evidence" className="inline-flex items-center gap-2 text-muted hover:text-ink">
              <FileText className="h-4 w-4" aria-hidden /> See the evidence
            </a>
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-[10px] text-stone">
            <ShieldCheck className="h-3 w-3" aria-hidden />
            Dashboard runs are workspace-scoped; the machine token is for local automation only.
          </p>
        </div>
      </div>
    </section>
  );
}
