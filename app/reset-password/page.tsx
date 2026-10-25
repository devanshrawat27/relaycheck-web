import Link from 'next/link';
import { resetPasswordAction } from '@/lib/auth-actions';

interface ResetPasswordPageProps {
  searchParams?: { token?: string | string[]; error?: string | string[] };
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const token = Array.isArray(searchParams?.token) ? searchParams.token[0] : searchParams?.token;
  const error = Array.isArray(searchParams?.error) ? searchParams.error[0] : searchParams?.error;

  return (
    <section className="mx-auto w-full max-w-md px-4 py-16">
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-card">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember-dark">
          Password reset
        </p>
        <h1 className="mt-2 font-display text-3xl font-normal tracking-tight text-ink">
          Choose a new password
        </h1>

        {error ? (
          <p role="alert" className="mt-4 rounded-lg border border-danger-border bg-danger-soft px-4 py-2.5 text-sm text-danger">
            That reset link is invalid or expired.
          </p>
        ) : null}

        {token ? (
          <form action={resetPasswordAction} className="mt-6 space-y-4">
            <input type="hidden" name="token" value={token} />
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              />
              <p className="text-xs text-muted">At least 8 characters.</p>
            </div>
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-ember px-5 text-sm font-semibold text-white transition-colors hover:bg-ember-dark"
            >
              Reset password
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-muted">No reset token provided.</p>
        )}

        <p className="mt-5 text-center text-xs text-muted">
          <Link href="/login" className="text-ember-dark underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
