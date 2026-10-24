'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  LayoutDashboard,
  LogOut,
  Menu,
  PlayCircle,
  WorkspaceIcon,
  X,
} from '@/components/marketing/icons';

interface WorkspaceSummary {
  id: string;
  name: string;
}

interface AppChromeProps {
  signedIn: boolean;
  email: string;
  role: string;
  workspaceName: string;
  workspaceId: string;
  workspaces: WorkspaceSummary[];
  switchWorkspaceAction: (formData: FormData) => Promise<void>;
  logoutAction: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
}

export function AppChrome({
  signedIn,
  email,
  role,
  workspaceName,
  workspaceId,
  workspaces,
  switchWorkspaceAction,
  logoutAction,
  children,
}: AppChromeProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const runsHref = signedIn ? '/' : '/runs';

  const navItems = [
    {
      href: runsHref,
      label: 'Runs',
      icon: LayoutDashboard,
      active:
        pathname === '/' ||
        pathname === '/runs' ||
        (pathname.startsWith('/runs/') && !pathname.startsWith('/runs/new')),
    },
    { href: '/runs/new', label: 'Run a scenario', icon: PlayCircle, active: pathname === '/runs/new' },
    { href: '/diagnostics', label: 'Diagnostics', icon: Activity, active: pathname.startsWith('/diagnostics') },
    { href: '/workspace', label: 'Members', icon: WorkspaceIcon, active: pathname.startsWith('/workspace') },
  ].filter((item) => (item.label === 'Members' ? signedIn : true));

  const initial = email ? email.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-paper/70 lg:flex">
        <SidebarContent
          signedIn={signedIn}
          email={email}
          role={role}
          initial={initial}
          navItems={navItems}
          logoutAction={logoutAction}
        />
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-paper/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink transition-colors hover:border-line hover:bg-sand/50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {signedIn ? (
              workspaces.length > 1 ? (
                <form action={switchWorkspaceAction} className="flex min-w-0 items-center gap-2">
                  <label htmlFor="workspaceId" className="sr-only">
                    Active workspace
                  </label>
                  <span className="hidden h-6 w-6 items-center justify-center rounded-md bg-sand text-ink sm:flex">
                    <span className="font-mono text-[10px] font-bold">{workspaceName.charAt(0).toUpperCase()}</span>
                  </span>
                  <select
                    id="workspaceId"
                    name="workspaceId"
                    defaultValue={workspaceId}
                    className="h-9 max-w-[220px] truncate rounded-lg border border-line bg-surface px-2.5 text-sm font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ember"
                  >
                    {workspaces.map((workspace) => (
                      <option key={workspace.id} value={workspace.id}>
                        {workspace.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="hidden h-9 items-center rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-muted transition-colors hover:border-line hover:text-ink sm:inline-flex"
                  >
                    Switch
                  </button>
                </form>
              ) : (
                <span
                  className="inline-flex min-w-0 items-center gap-2 rounded-md border border-line/70 bg-sand/40 px-2.5 py-1.5"
                  title={workspaceName}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  <span className="max-w-[200px] truncate text-sm font-medium text-ink">{workspaceName}</span>
                </span>
              )
            ) : (
              <span className="text-sm font-semibold text-ink">RelayCheck</span>
            )}
          </div>

        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ink/30"
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-line bg-paper shadow-elevated">
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              <span className="text-[15px] font-semibold tracking-tight text-ink">RelayCheck</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent
              signedIn={signedIn}
              email={email}
              role={role}
              initial={initial}
              navItems={navItems}
              logoutAction={logoutAction}
              onNavigate={() => setMenuOpen(false)}
            />
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function SidebarContent({
  signedIn,
  email,
  role,
  initial,
  navItems,
  logoutAction,
  onNavigate,
}: {
  signedIn: boolean;
  email: string;
  role: string;
  initial: string;
  navItems: Array<{ href: string; label: string; icon: typeof LayoutDashboard; active: boolean }>;
  logoutAction: (formData: FormData) => Promise<void>;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-line px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember text-white">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
            <path d="M2.5 10h3l2-4 3 8 2-4h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-ink">RelayCheck</span>
      </div>

      <nav aria-label="Primary" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            aria-current={item.active ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              item.active
                ? 'bg-ember-soft text-ember-dark'
                : 'text-muted hover:bg-sand/60 hover:text-ink'
            }`}
          >
            <item.icon className={`h-[18px] w-[18px] ${item.active ? 'text-ember-dark' : 'text-muted'}`} aria-hidden />
            {item.label}
          </Link>
        ))}
      </nav>

      {signedIn ? (
        <div className="shrink-0 border-t border-line px-3 py-4">
          <div className="flex items-center gap-2.5 rounded-lg bg-sand/40 px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand font-mono text-[11px] font-bold text-ink">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink">{email}</p>
              <p className="truncate font-mono text-[10px] uppercase tracking-wider text-muted">{role}</p>
            </div>
          </div>
          <form action={logoutAction} className="mt-2">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-sand/60 hover:text-ink"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
