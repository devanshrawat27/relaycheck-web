'use server';

import { redirect } from 'next/navigation';
import { sessionToken } from './session';

const API_BASE = (process.env.CONTROL_API_URL ?? 'http://127.0.0.1:3200').replace(/\/$/, '');

async function call(
  path: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  body?: unknown,
): Promise<Response> {
  const token = sessionToken();
  return fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });
}

export async function switchWorkspaceAction(formData: FormData): Promise<void> {
  const workspaceId = String(formData.get('workspaceId') ?? '');
  if (!workspaceId) {
    redirect('/');
  }
  const response = await call('/api/workspace/switch', 'POST', { workspaceId });
  if (!response.ok) {
    redirect('/workspace?error=switch-failed');
  }
  redirect('/');
}

export async function inviteMemberAction(formData: FormData): Promise<void> {
  const role = String(formData.get('role') ?? 'member');
  const email = String(formData.get('email') ?? '').trim();
  const response = await call('/api/workspace/invitations', 'POST', {
    role,
    ...(email ? { email } : {}),
  });
  if (!response.ok) {
    redirect('/workspace?error=invite-failed');
  }
  const body = (await response.json()) as { token?: unknown };
  if (typeof body.token !== 'string') {
    redirect('/workspace?error=invite-failed');
  }
  redirect(`/workspace?invited=${encodeURIComponent(body.token)}`);
}

export async function updateMemberRoleAction(formData: FormData): Promise<void> {
  const userId = String(formData.get('userId') ?? '');
  const role = String(formData.get('role') ?? '');
  const response = await call(`/api/workspace/members/${encodeURIComponent(userId)}`, 'PATCH', {
    role,
  });
  if (!response.ok) {
    redirect('/workspace?error=role-failed');
  }
  redirect('/workspace');
}

export async function removeMemberAction(formData: FormData): Promise<void> {
  const userId = String(formData.get('userId') ?? '');
  const response = await call(`/api/workspace/members/${encodeURIComponent(userId)}`, 'DELETE');
  if (!response.ok) {
    redirect('/workspace?error=remove-failed');
  }
  redirect('/workspace');
}

export async function acceptInvitationAction(formData: FormData): Promise<void> {
  const token = String(formData.get('token') ?? '');
  const response = await call('/api/workspace/accept-invitation', 'POST', { token });
  if (!response.ok) {
    redirect(`/join?token=${encodeURIComponent(token)}&error=invalid`);
  }
  redirect('/');
}
