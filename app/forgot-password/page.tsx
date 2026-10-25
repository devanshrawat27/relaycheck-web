import Link from 'next/link';
import { forgotPasswordAction } from '@/lib/auth-actions';

interface ForgotPasswordPageProps {
  searchParams?: { error?: string | string[] };
}

export default function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const error = Array.isArray(searchParams?.error) ? searchParams.error[0] : searchParams?.error;

  return (
    <section className="mx-auto w-full max-w-md px-4 py-16">
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-card">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember-dark">
          Password reset
        </p>
        <h1 className="mt-2 font-display text-3xl font-normal tracking-tight text-ink">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Enter your email and we&apos;ll send a reset link if an account exists.
        </p>

        {error ? (
          <p role="alert" className="mt-4 rounded-lg border border-danger-border bg-danger-soft px-4 py-2.5 text-sm text-danger">
            Enter a valid email address.
          </p>
        ) : null}

        <form action={forgotPasswordAction} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-ember px-5 text-sm font-semibold text-white transition-colors hover:bg-ember-dark"
          >
            Send reset link
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-muted">
          <Link href="/login" className="text-ember-dark underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
