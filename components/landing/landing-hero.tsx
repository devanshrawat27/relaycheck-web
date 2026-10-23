import Link from 'next/link';
import { ArrowRight, FlaskConical, LockKeyhole, ShieldCheck } from '@/components/landing/icons';
import { ProofScene } from './proof-scene';

const FACTS = [
  { icon: ShieldCheck, label: 'Fail-closed test oracle' },
  { icon: LockKeyhole, label: 'Local-first by design' },
  { icon: FlaskConical, label: 'No exactly-once claims' },
];

export function LandingHero() {
  return (
    <section id="top" className="relative">
      <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-lg border border-ember-border bg-ember-soft px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ember-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
            Webhook correctness, with evidence
          </p>

          <h1 className="mt-6 max-w-xl text-balance font-display text-[2.65rem] font-normal leading-[1.04] tracking-tight text-ink sm:text-[3rem] lg:text-[3rem] xl:text-[3.55rem]">
            Duplicate deliveries.
            <br />
            One business effect.
            <br />
            <span className="text-ember-dark">Proof.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            RelayCheck runs repeatable webhook scenarios against a local receiver, records every
            delivery attempt, and verifies that duplicate events produce exactly one business
            effect — with evidence you can inspect.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-ember px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ember-dark"
            >
              Open the dashboard <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ember-border"
            >
              See how it works
            </a>
            <Link
              href="/register"
              className="text-sm font-medium text-ember-dark underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted">
            Runs locally against your own receiver. No production traffic or exactly-once promise.
          </p>

          <ul className="mt-9 grid gap-3 border-t border-line pt-6 sm:grid-cols-3">
            {FACTS.map((fact) => (
              <li key={fact.label} className="flex items-start gap-2.5">
                <fact.icon className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden />
                <span className="text-[12px] leading-5 text-muted">{fact.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <ProofScene />
        </div>
      </div>
    </section>
  );
}
