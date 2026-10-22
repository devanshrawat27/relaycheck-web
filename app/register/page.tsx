import Link from 'next/link';
import { registerAction } from '@/lib/auth-actions';

const ERROR_MESSAGES: Record<string, string> = {
  'email-taken': 'That email is already registered. Try signing in instead.',
  'weak-password': 'Use a password of at least 8 characters.',
  'api-unreachable': 'Could not reach the Control API. Make sure it is running.',
  'invalid-response': 'Unexpected response from the Control API.',
};

interface RegisterPageProps {
  searchParams?: { error?: string | string[] };
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const raw = Array.isArray(searchParams?.error) ? searchParams?.error[0] : searchParams?.error;
  const errorMessage = raw ? (ERROR_MESSAGES[raw] ?? 'Registration failed.') : null;

  return (
    <section className="mx-auto max-w-md space-y-8 py-6">
      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember">
          RelayCheck / Create account
        </p>
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-ink">
          Start your workspace.
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          Accounts isolate runs per workspace. You get a personal workspace on sign-up.
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

      <form action={registerAction} className="space-y-5 rounded-2xl border border-line bg-surface p-6 shadow-card">
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
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full rounded-xl border border-line bg-paper/50 px-3.5 py-2.5 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          />
          <p className="text-xs text-muted">At least 8 characters.</p>
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink"
        >
          Create account
        </button>
        <p className="text-center text-xs text-muted">
          Already registered?{' '}
          <Link href="/login" className="text-ember underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </section>
  );
}
