'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, sessionToken } from './session';

const API_BASE = (process.env.CONTROL_API_URL ?? 'http://127.0.0.1:3200').replace(/\/$/, '');
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

async function issueSession(
  path: '/api/auth/login' | '/api/auth/register',
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });
  } catch {
    return { ok: false, reason: 'api-unreachable' };
  }

  if (response.status === 409) {
    return { ok: false, reason: 'email-taken' };
  }
  if (!response.ok) {
    return { ok: false, reason: 'invalid-credentials' };
  }

  const body = (await response.json()) as { token?: unknown };
  if (typeof body.token !== 'string') {
    return { ok: false, reason: 'invalid-response' };
  }
  cookies().set(SESSION_COOKIE, body.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  return { ok: true };
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  if (!email || !password) {
    redirect('/login?error=missing-fields');
  }
  const result = await issueSession('/api/auth/login', email, password);
  if (!result.ok) {
    redirect(`/login?error=${result.reason}`);
  }
  redirect('/');
}

export async function registerAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  if (!email || password.length < 8) {
    redirect('/register?error=weak-password');
  }
  const result = await issueSession('/api/auth/register', email, password);
  if (!result.ok) {
    redirect(`/register?error=${result.reason}`);
  }
  redirect('/');
}

export async function logoutAction(): Promise<void> {
  const token = sessionToken();
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: token ? { authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
    });
  } catch {
    // Best effort: the local cookie is cleared regardless.
  }
  cookies().delete(SESSION_COOKIE);
  redirect('/login');
}

async function post(path: string, body: unknown): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function forgotPasswordAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) {
    redirect('/forgot-password?error=missing');
  }
  await post('/api/auth/forgot-password', { email });
  redirect('/login?sent=1');
}

export async function resetPasswordAction(formData: FormData): Promise<void> {
  const token = String(formData.get('token') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!token || password.length < 8) {
    redirect('/reset-password?error=invalid');
  }
  if (!(await post('/api/auth/reset-password', { token, password }))) {
    redirect('/reset-password?error=invalid');
  }
  redirect('/login?reset=1');
}
