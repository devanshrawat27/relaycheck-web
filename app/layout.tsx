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
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-paper"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <a href="/" className="group flex items-baseline gap-2">
              <span className="text-lg font-semibold tracking-tight text-ink">
                RelayCheck
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-ember transition-transform group-hover:scale-150" />
              <span className="hidden text-[11px] uppercase tracking-[0.18em] text-muted sm:inline">
                webhook regression lab
              </span>
            </a>
            <nav aria-label="Primary">
              <ul className="flex items-center gap-1">
                <li>
                  <NavLink href="/">Runs</NavLink>
                </li>
                <li>
                  <NavLink href="/runs/new">Run a scenario</NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-8 sm:py-14">
          {children}
        </main>

        <footer className="border-t border-line/70">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>Local-first testing tool. Not a payment gateway or delivery service.</p>
            <p className="font-mono uppercase tracking-[0.16em]">verify effects, not just 2xx</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
