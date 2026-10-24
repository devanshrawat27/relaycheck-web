import Link from 'next/link';
import { Github } from './icons';

const REPO = 'https://github.com/devanshrawat27/relaycheck-web';
const README = 'https://github.com/devanshrawat27/relaycheck-web#readme';

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-[#F3EEE7]">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr]">
          <div data-reveal-item>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E46B2D] to-ember-dark text-white shadow-[0_7px_17px_-9px_rgba(168,61,16,0.75)]">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path
                    d="M2.5 10h3l2-4 3 8 2-4h5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="font-display text-lg font-medium tracking-tight text-ink">RelayCheck</span>
            </div>
            <p className="mt-4 max-w-sm text-[14px] leading-[1.75] text-ink-secondary">
              Local-first webhook scenarios with delivery-level evidence. Verify the business
              effect, not just the 2xx.
            </p>
            <p className="mt-4 inline-flex rounded-full border border-line bg-white/70 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
              No exactly-once claims · fail-closed test controls
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ember-dark">Product</p>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              <li>
                <a href="#product" className="text-ink-secondary transition-colors hover:text-ember-dark">
                  Scenarios
                </a>
              </li>
              <li>
                <a href="#features" className="text-ink-secondary transition-colors hover:text-ember-dark">
                  Features
                </a>
              </li>
              <li>
                <a href="#how" className="text-ink-secondary transition-colors hover:text-ember-dark">
                  How it works
                </a>
              </li>
              <li>
                <a href="#evidence" className="text-ink-secondary transition-colors hover:text-ember-dark">
                  Evidence
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ember-dark">
              Developers
            </p>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              <li>
                <a
                  href={REPO}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-ink-secondary transition-colors hover:text-ember-dark"
                >
                  <Github className="h-3.5 w-3.5" /> GitHub repository
                </a>
              </li>
              <li>
                <a
                  href={README}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink-secondary transition-colors hover:text-ember-dark"
                >
                  Documentation
                </a>
              </li>
              <li>
                <Link href="/login" className="text-ink-secondary transition-colors hover:text-ember-dark">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-ink-secondary transition-colors hover:text-ember-dark">
                  Create an account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-11 flex flex-col gap-2 border-t border-line pt-5 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} RelayCheck. All rights reserved.</p>
          <p>Local-first testing tool. Not a payment gateway or delivery service.</p>
        </div>
      </div>
    </footer>
  );
}
