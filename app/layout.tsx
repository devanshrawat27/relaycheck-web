import type { Metadata } from 'next';
import './globals.css';
import { NavLink } from '@/components/nav-link';

export const metadata: Metadata = {
  title: 'RelayCheck',
  description: 'Repeatable webhook scenario tests that verify business outcomes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-neutral-950 text-neutral-100 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-neutral-100 focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-neutral-900"
        >
          Skip to content
        </a>

        <header className="border-b border-neutral-800">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                RelayCheck
              </p>
              <p className="mt-0.5 text-sm text-neutral-400">
                Webhook correctness and regression testing
              </p>
            </div>
            <nav aria-label="Primary">
              <ul className="flex items-center gap-1">
                <li>
                  <NavLink href="/">Runs</NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>

        <footer className="border-t border-neutral-800">
          <div className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-neutral-500 sm:px-6">
            Local-first testing tool. RelayCheck is not a payment gateway or a production
            delivery service.
          </div>
        </footer>
      </body>
    </html>
  );
}
