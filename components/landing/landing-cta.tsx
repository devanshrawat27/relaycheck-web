import Link from 'next/link';
import { ArrowRight } from '@/components/landing/icons';

export function LandingCta() {
  return (
    <section className="mt-16 border-t border-line pt-12 sm:mt-24 sm:pt-16">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember-dark">
            Ready when you are
          </p>
          <h2 className="mt-3 font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
            Prove the effect, not just the 2xx.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Start with the duplicate-delivery proof, then re-run it after every deploy. Keep the
            evidence next to the code.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-ember px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ember-dark"
          >
            Open the dashboard <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ember-border"
          >
            Create an account
          </Link>
        </div>
      </div>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
        Local-first · no exactly-once claims · fail-closed test controls
      </p>
    </section>
  );
}
