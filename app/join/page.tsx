import { requireSession } from '@/lib/session';
import { acceptInvitationAction } from '@/lib/workspace-actions';

interface JoinPageProps {
  searchParams?: { token?: string | string[]; error?: string | string[] };
}

export default async function JoinPage({ searchParams }: JoinPageProps) {
  await requireSession();
  const token = Array.isArray(searchParams?.token) ? searchParams?.token[0] : searchParams?.token;
  const error = Array.isArray(searchParams?.error) ? searchParams?.error[0] : searchParams?.error;

  return (
    <section className="mx-auto max-w-md space-y-8 py-6">
      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-dark">
          RelayCheck / Invitation
        </p>
        <h1 className="font-display text-4xl font-normal leading-[1.05] tracking-tight text-ink">
          Join the workspace.
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          Accepting the invitation adds you to the workspace so you can see and run its scenarios.
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          This invitation is invalid, already used, or expired.
        </p>
      ) : null}

      {token ? (
        <form
          action={acceptInvitationAction}
          className="space-y-5 rounded-xl border border-line bg-surface p-6 shadow-card"
        >
          <input type="hidden" name="token" value={token} />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-ember px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ember-dark"
          >
            Accept invitation
          </button>
        </form>
      ) : (
        <p className="text-sm text-muted">No invitation token was provided.</p>
      )}
    </section>
  );
}
