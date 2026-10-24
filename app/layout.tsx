import type { Metadata } from 'next';
import './globals.css';
import { NavLink } from '@/components/nav-link';
import { SiteChrome } from '@/components/site-chrome';
import { logoutAction } from '@/lib/auth-actions';
import { getAuthState } from '@/lib/session';
import { switchWorkspaceAction } from '@/lib/workspace-actions';

export const metadata: Metadata = {
  title: 'RelayCheck — Webhook Regression Lab',
  description: 'Repeatable webhook scenario tests that verify business outcomes.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const auth = await getAuthState();
  const signedIn = auth.user !== null;
  const workspaces = auth.user?.workspaces ?? [];
  const userInitial = auth.user?.email ? auth.user.email.charAt(0).toUpperCase() : 'U';

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink antialiased">
        <SiteChrome
          header={
            <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
              <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
                {/* Brand & Nav lockup */}
                <div className="flex items-center gap-6">
                  <a
                    href={signedIn ? '/' : '/welcome'}
                    className="group flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember text-white shadow-xs">
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                        <path
                          d="M2.5 10h3l2-4 3 8 2-4h5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[15px] font-semibold tracking-tight text-ink">
                      RelayCheck
                    </span>
                    <span className="hidden rounded bg-sand px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted sm:inline">
                      Lab
                    </span>
                  </a>

                  {/* Navigation tabs */}
                  <nav aria-label="Primary" className="flex items-center">
                    <ul className="flex items-center gap-1">
                      {signedIn || !auth.authRequired ? (
                        <>
                          <li>
                            <NavLink href="/">Runs</NavLink>
                          </li>
                          <li>
                            <NavLink href="/runs/new">Run a scenario</NavLink>
                          </li>
                          <li>
                            <NavLink href="/diagnostics">Diagnostics</NavLink>
                          </li>
                          {signedIn ? (
                            <li>
                              <NavLink href="/workspace">Workspace</NavLink>
                            </li>
                          ) : null}
                        </>
                      ) : (
                        <li>
                          <NavLink href="/welcome">Overview</NavLink>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>

                {/* Right utility & user info */}
                <div className="flex items-center gap-3">
                  {signedIn ? (
                    <div className="flex items-center gap-2.5">
                      {workspaces.length > 1 ? (
                        <form action={switchWorkspaceAction} className="flex items-center gap-1">
                          <label htmlFor="workspaceId" className="sr-only">
                            Active workspace
                          </label>
                          <select
                            id="workspaceId"
                            name="workspaceId"
                            defaultValue={auth.user?.workspaceId}
                            className="h-8 max-w-[150px] truncate rounded-lg border border-line bg-surface px-2.5 text-xs text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ember"
                          >
                            {workspaces.map((workspace) => (
                              <option key={workspace.id} value={workspace.id}>
                                {workspace.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="h-8 rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-muted transition-colors hover:border-line hover:text-ink"
                          >
                            Switch
                          </button>
                        </form>
                      ) : (
                        <span
                          className="hidden items-center gap-1.5 rounded-md border border-line/70 bg-sand/40 px-2.5 py-1 font-mono text-[11px] text-muted md:inline-flex"
                          title={auth.user?.workspaceName}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-success" />
                          <span className="max-w-[130px] truncate">{auth.user?.workspaceName}</span>
                        </span>
                      )}

                      {/* User capsule */}
                      <div
                        className="hidden items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 sm:flex"
                        title={auth.user?.email}
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand font-mono text-[10px] font-bold text-ink">
                          {userInitial}
                        </span>
                        <span className="max-w-[140px] truncate text-xs font-medium text-ink">
                          {auth.user?.email}
                        </span>
                      </div>

                      <form action={logoutAction}>
                        <button
                          type="submit"
                          className="inline-flex h-8 items-center rounded-lg border border-line bg-surface px-3 text-xs font-medium text-muted transition-colors hover:border-line hover:bg-sand/40 hover:text-ink"
                        >
                          Sign out
                        </button>
                      </form>
                    </div>
                  ) : auth.authRequired ? (
                    <div className="flex items-center gap-2">
                      <NavLink href="/login">Sign in</NavLink>
                      <a
                        href="/register"
                        className="inline-flex h-8 items-center rounded-lg bg-ember px-3.5 text-xs font-semibold text-white transition-colors hover:bg-ember-dark"
                      >
                        Get started
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </header>
          }
          footer={
            <footer className="mt-auto border-t border-line/70 bg-paper">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <p>Local-first testing tool. Not a payment gateway or delivery service.</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em]">
                  verify effects, not just 2xx
                </p>
              </div>
            </footer>
          }
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
