import Link from 'next/link';
import { ArrowRight, Github } from './icons';
import { CtaAtmosphere } from './cta-atmosphere';

const REPO = 'https://github.com/devanshrawat27/relaycheck-web';

export function MarketingCta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
      <div className="relative isolate overflow-hidden rounded-[28px] border border-[#39342F] bg-[#211F1C] p-8 shadow-[0_34px_90px_-48px_rgba(44,30,20,0.6)] sm:p-12 lg:p-14" data-reveal>
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(255,255,255,0.025),transparent_52%)]" />
        <CtaAtmosphere />
        <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F08B55]">
              <span className="h-px w-7 bg-[#F08B55]" />
              Before production
            </p>
            <h2 className="mt-4 font-display text-3xl font-normal leading-[1.08] tracking-tight text-paper sm:text-[2.75rem] lg:text-[3rem]">
              Know how your webhooks behave <span className="text-[#F08B55]">before production.</span>
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-[1.8] text-[#C7C0B6] sm:text-base">
              Run a scenario, inspect the evidence, and understand the result.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/runs/new"
              className="inline-flex items-center gap-2 rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-ember-dark hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2"
            >
              Run your first test <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.045] px-5 py-3 text-sm font-medium text-paper transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <Github className="h-4 w-4" /> View source on GitHub
            </a>
          </div>
        </div>
        <p className="relative mt-8 border-t border-white/10 pt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#B9B2A8] sm:text-[10px]">
          Local-first · no exactly-once claims · fail-closed test controls
        </p>
      </div>
    </section>
  );
}
