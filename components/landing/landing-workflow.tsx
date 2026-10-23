import Link from 'next/link';
import { ArrowRight, Check, Repeat2, Send, ShieldCheck } from '@/components/landing/icons';

const STAGES = [
  {
    n: '01',
    icon: Repeat2,
    title: 'Define the scenario',
    body: 'Choose duplicate delivery, controlled failure, or timeout — or set bounded overrides for attempts and latency.',
  },
  {
    n: '02',
    icon: Send,
    title: 'Record every attempt',
    body: 'The runner delivers the same event ID, persists each sender-side attempt, and reports progress through the Control API.',
  },
  {
    n: '03',
    icon: ShieldCheck,
    title: 'Verify the effect',
    body: 'The receiver-side oracle proves the business effect count. A mismatch is failed; an execution problem is error.',
  },
] as const;

function ScenarioMini() {
  return (
    <div className="rounded-lg border border-line bg-surface p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-stone">Scenario</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="rounded-md border border-ember-border bg-ember-soft px-2 py-1 text-[9px] font-medium text-ember-dark">
          duplicate_delivery
        </span>
        <span className="rounded-md border border-line bg-paper px-2 py-1 text-[9px] text-muted">
          receiver_failure
        </span>
        <span className="rounded-md border border-line bg-paper px-2 py-1 text-[9px] text-muted">
          receiver_timeout
        </span>
      </div>
      <p className="mt-2 text-[9px] text-muted">3 deliveries · 2 s timeout</p>
    </div>
  );
}

function AttemptsMini() {
  return (
    <div className="rounded-lg border border-line bg-surface p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-stone">Delivery attempts</p>
      <ul className="mt-2 space-y-1">
        {[1, 2, 3].map((n) => (
          <li
            key={n}
            className="flex items-center justify-between rounded-md bg-paper px-2 py-1 font-mono text-[9px] text-muted"
          >
            <span>#{n}</span>
            <span className="text-success">201</span>
            <span>{n * 8} ms</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[9px] text-muted">Same event ID in every attempt</p>
    </div>
  );
}

function VerdictMini() {
  return (
    <div className="rounded-lg border border-line bg-surface p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-stone">Assertions</p>
      <ul className="mt-2 space-y-1">
        <li className="flex items-center justify-between gap-2 rounded-md bg-success-soft px-2 py-1 text-[9px] text-success">
          <span>attempts = 3</span>
          <Check className="h-3 w-3" aria-hidden />
        </li>
        <li className="flex items-center justify-between gap-2 rounded-md bg-success-soft px-2 py-1 text-[9px] text-success">
          <span>effects = 1</span>
          <Check className="h-3 w-3" aria-hidden />
        </li>
      </ul>
      <p className="mt-2 text-[9px] text-muted">Evidence persisted per attempt</p>
    </div>
  );
}

const MINIS = [ScenarioMini, AttemptsMini, VerdictMini];

export function LandingWorkflow() {
  return (
    <section id="how" className="border-t border-line pt-16 sm:pt-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember-dark">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
            A repeatable run, from request to verdict.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            The same scenario can be re-run after every deploy. Every attempt, assertion, and
            business effect is kept as evidence.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ember-dark underline-offset-4 hover:underline"
        >
          Open the dashboard <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <ol className="mt-10 ml-1 space-y-8 border-l border-line pl-6 md:ml-0 md:grid md:grid-cols-3 md:gap-0 md:space-y-0 md:border-0 md:pl-0">
        {STAGES.map((stage, index) => {
          const Mini = MINIS[index];
          return (
            <li
              key={stage.title}
              className="relative md:px-7 md:first:pl-0 md:last:pr-0 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-line"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] text-ember-dark">{stage.n}</span>
                <stage.icon className="h-4 w-4 text-ember" aria-hidden />
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight text-ink">{stage.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{stage.body}</p>
              <div className="mt-4">
                <Mini />
              </div>

              {index < STAGES.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute -right-3 top-24 hidden h-6 w-6 items-center justify-center rounded-full border border-line bg-paper text-ember-dark md:flex"
                >
                  <ArrowRight className="h-3 w-3" />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      <p className="mt-6 text-right font-mono text-[9px] uppercase tracking-[0.12em] text-stone">
        Example values · not live results
      </p>
    </section>
  );
}
