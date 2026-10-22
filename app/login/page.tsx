import Link from 'next/link';
import { loginAction } from '@/lib/auth-actions';

const ERROR_MESSAGES: Record<string, string> = {
  'invalid-credentials': 'Invalid email or password.',
  'missing-fields': 'Enter both your email and password.',
  'api-unreachable': 'Could not reach the Control API. Make sure it is running.',
  'invalid-response': 'Unexpected response from the Control API.',
};

interface LoginPageProps {
  searchParams?: { error?: string | string[] };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const raw = Array.isArray(searchParams?.error) ? searchParams?.error[0] : searchParams?.error;
  const errorMessage = raw ? (ERROR_MESSAGES[raw] ?? 'Sign-in failed.') : null;

  return (
    <section className="mx-auto max-w-md space-y-8 py-6">
      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember">
          RelayCheck / Sign in
        </p>
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-ink">
          Welcome back.
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          Sign in to run scenarios and inspect evidence in your workspace.
        </p>
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="rounded-xl border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          {errorMessage}
        </p>
      ) : null}

      <form action={loginAction} className="space-y-5 rounded-2xl border border-line bg-surface p-6 shadow-card">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-800">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-line bg-paper/50 px-3.5 py-2.5 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-800">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-line bg-paper/50 px-3.5 py-2.5 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          />
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink"
        >
          Sign in
        </button>
        <p className="text-center text-xs text-muted">
          No account?{' '}
          <Link href="/register" className="text-ember underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </section>
  );
}
