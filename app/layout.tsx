import type { Metadata } from 'next';
import './globals.css';
import { NavLink } from '@/components/nav-link';
import { logoutAction } from '@/lib/auth-actions';
import { getAuthState } from '@/lib/session';
import { switchWorkspaceAction } from '@/lib/workspace-actions';

export const metadata: Metadata = {
  title: 'RelayCheck',
  description: 'Repeatable webhook scenario tests that verify business outcomes.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const auth = await getAuthState();
  const signedIn = auth.user !== null;
  const workspaces = auth.user?.workspaces ?? [];

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink antialiased">
        <a
          href="#skip"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ember focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <a
              href={signedIn ? '/' : '/welcome'}
              className="group flex shrink-0 items-baseline gap-2 whitespace-nowrap"
            >
              <span className="text-lg font-semibold tracking-tight text-ink">RelayCheck</span>
              <span className="h-1.5 w-1.5 rounded-full bg-ember transition-transform group-hover:scale-150" />
              <span className="hidden whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-muted sm:inline">
                webhook regression lab
              </span>
            </a>

            <div className="flex flex-wrap items-center gap-3">
              <nav aria-label="Primary">
                <ul className="flex flex-wrap items-center gap-1">
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

              {signedIn ? (
                <div className="flex flex-wrap items-center gap-3 border-l border-line pl-3">
                  {workspaces.length > 1 ? (
                    <form action={switchWorkspaceAction} className="flex items-center gap-1.5">
                      <label htmlFor="workspaceId" className="sr-only">
                        Active workspace
                      </label>
                      <select
                        id="workspaceId"
                        name="workspaceId"
                        defaultValue={auth.user?.workspaceId}
                        className="max-w-[190px] rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                      >
                        {workspaces.map((workspace) => (
                          <option key={workspace.id} value={workspace.id}>
                            {workspace.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-ember-border hover:text-ink"
                      >
                        Switch
                      </button>
                    </form>
                  ) : (
                    <span
                      className="hidden max-w-[190px] truncate text-xs text-muted 2xl:inline"
                      title={auth.user?.workspaceName}
                    >
                      {auth.user?.workspaceName}
                    </span>
                  )}
                  <span
                    className="hidden max-w-[180px] truncate text-xs text-muted md:inline"
                    title={auth.user?.email}
                  >
                    {auth.user?.email}
                  </span>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-ember-border hover:text-ink"
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
                    className="hidden rounded-lg bg-ember px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-ember-dark sm:inline-flex"
                  >
                    Get started
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main id="skip" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-8 sm:py-14">
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
