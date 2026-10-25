import Link from 'next/link';
import { resendVerificationAction, verifyEmailAction } from '@/lib/auth-actions';

interface VerifyEmailPageProps {
  searchParams?: { token?: string | string[]; error?: string | string[]; sent?: string | string[] };
}

export default function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const token = Array.isArray(searchParams?.token) ? searchParams.token[0] : searchParams?.token;
  const error = Array.isArray(searchParams?.error) ? searchParams.error[0] : searchParams?.error;
  const sent = Array.isArray(searchParams?.sent) ? searchParams.sent[0] : searchParams?.sent;

  return (
    <section className="mx-auto w-full max-w-md px-4 py-16">
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-card">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember-dark">
          Email verification
        </p>
        <h1 className="mt-2 font-display text-3xl font-normal tracking-tight text-ink">
          Verify your email
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Confirm your address to finish setting up your RelayCheck account.
        </p>

        {error ? (
          <p role="alert" className="mt-4 rounded-lg border border-danger-border bg-danger-soft px-4 py-2.5 text-sm text-danger">
            That verification link is invalid or expired. Request a new one below.
          </p>
        ) : null}
        {sent ? (
          <p className="mt-4 rounded-lg border border-success-border bg-success-soft px-4 py-2.5 text-sm text-success">
            Verification email sent. Check your inbox.
          </p>
        ) : null}

        {token ? (
          <form action={verifyEmailAction} className="mt-6">
            <input type="hidden" name="token" value={token} />
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-ember px-5 text-sm font-semibold text-white transition-colors hover:bg-ember-dark"
            >
              Verify email
            </button>
          </form>
        ) : (
          <form action={resendVerificationAction} className="mt-6 space-y-4">
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
              Resend verification email
            </button>
          </form>
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
