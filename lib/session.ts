import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const SESSION_COOKIE = 'relaycheck_session';

export interface WorkspaceSummary {
  id: string;
  name: string;
  role: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  workspaceId: string;
  workspaceName: string;
  workspaceRole: string;
  workspaces: WorkspaceSummary[];
}

export interface AuthState {
  authRequired: boolean;
  user: AuthUser | null;
}

const API_BASE = (process.env.CONTROL_API_URL ?? 'http://127.0.0.1:3200').replace(/\/$/, '');

export function sessionToken(): string | undefined {
  return cookies().get(SESSION_COOKIE)?.value;
}

/** Reads the auth state from the Control API using the session cookie. */
export async function getAuthState(): Promise<AuthState> {
  const token = sessionToken();
  try {
    const response = await fetch(`${API_BASE}/api/auth/me`, {
      cache: 'no-store',
      headers: token ? { authorization: `Bearer ${token}` } : {},
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) {
      return { authRequired: false, user: null };
    }
    return (await response.json()) as AuthState;
  } catch {
    // API unreachable: pages render their own error states.
    return { authRequired: false, user: null };
  }
}

/**
 * Page-level guard: when the API requires authentication, an unauthenticated
 * visitor is redirected to /login. Returns the token for downstream calls.
 */
export async function requireSession(): Promise<{ state: AuthState; token?: string }> {
  const state = await getAuthState();
  if (state.authRequired && !state.user) {
    redirect('/login');
  }
  return { state, token: sessionToken() };
}

