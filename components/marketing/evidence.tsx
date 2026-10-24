import Link from 'next/link';
import { ArrowRight, Check, CircleAlert, FileJson, ShieldCheck } from './icons';
import { EvidenceRunMock } from './product-mocks';

const POINTS = [
  {
    icon: FileJson,
    title: 'Attempts and effects, kept separate',
    body: 'Sender-side delivery attempts and receiver-side business effects are different measurements, shown side by side without merging them.',
  },
  {
    icon: ShieldCheck,
    title: 'Assertions with expected vs actual',
    body: 'Every required assertion stores its expected and actual values, so a verdict can be checked rather than trusted.',
  },
  {
    icon: CircleAlert,
    title: 'Failed is not error',
    body: 'A completed run with a wrong outcome is failed; a run that could not complete reliably is error with safe details.',
  },
];

export function MarketingEvidence() {
  return (
    <section id="evidence" className="relative isolate overflow-hidden border-y border-line bg-[#F3EEE7] text-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_42%,rgba(201,79,22,0.09),transparent_43%),linear-gradient(135deg,rgba(255,255,255,0.55),transparent_50%)]" />
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
        <div data-reveal>
          <p className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ember-dark">
            <span className="h-px w-7 bg-ember" />
            Evidence-first
          </p>
          <h2 className="mt-4 font-display text-3xl font-normal leading-[1.08] tracking-tight text-ink sm:text-[2.75rem]">
            A verdict you can inspect, <span className="text-ember-dark">attempt by attempt.</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[1.8] text-ink-secondary sm:text-base">
            Every run keeps the event ID, responses, timings, assertion values, and the receiver
            effect count. The dashboard is built to show that evidence, not just a green badge.
          </p>

          <ul className="mt-8 divide-y divide-[#DCD4C9] border-y border-[#DCD4C9]">
            {POINTS.map((point, index) => (
              <li key={point.title} className="flex items-start gap-3.5 py-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-ember-border bg-white/75 text-ember-dark shadow-card">
                  <point.icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[9px] tracking-[0.12em] text-ember-dark">0{index + 1}</span>
                    <h3 className="font-display text-[17px] font-medium tracking-tight text-ink">{point.title}</h3>
                  </div>
                  <p className="mt-1 text-[13px] leading-[1.7] text-ink-secondary">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/runs/new"
              className="inline-flex items-center gap-2 rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(201,79,22,0.75)] transition-all hover:-translate-y-0.5 hover:bg-ember-dark"
            >
              Run your first test <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <span className="flex items-center gap-1.5 text-xs text-ink-secondary">
              <Check className="h-3.5 w-3.5 text-success" aria-hidden />
              Evidence persists after the run finishes
            </span>
          </div>
        </div>

        <div className="relative min-w-0" data-reveal data-reveal-delay="120">
          <div aria-hidden className="absolute -inset-5 rounded-[30px] border border-white/80 bg-white/35 shadow-[0_30px_90px_-50px_rgba(74,48,31,0.35)] sm:-inset-7" />
          <div className="relative rounded-[24px] border border-white/90 bg-white/65 p-2.5 shadow-[0_30px_85px_-45px_rgba(74,48,31,0.3)] sm:p-3.5">
            <EvidenceRunMock />
          </div>
        </div>
      </div>
    </section>
  );
}
