import type { ReactNode } from 'react';
import { AppChrome } from '@/components/app-chrome';
import { logoutAction } from '@/lib/auth-actions';
import { getAuthState } from '@/lib/session';
import { switchWorkspaceAction } from '@/lib/workspace-actions';

export async function AppShell({ children }: { children: ReactNode }) {
  const auth = await getAuthState();
  const signedIn = auth.user !== null;
  const user = auth.user;

  return (
    <AppChrome
      signedIn={signedIn}
      email={user?.email ?? ''}
      role={user?.workspaceRole ?? ''}
      workspaceName={user?.workspaceName ?? ''}
      workspaceId={user?.workspaceId ?? ''}
      workspaces={user?.workspaces ?? []}
      switchWorkspaceAction={switchWorkspaceAction}
      logoutAction={logoutAction}
    >
      {children}
    </AppChrome>
  );
}
