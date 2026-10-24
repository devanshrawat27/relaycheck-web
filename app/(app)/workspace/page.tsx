import Link from 'next/link';
import { ErrorPanel } from '@/components/error-panel';
import { getWorkspaceMembers, type WorkspaceMembers } from '@/lib/api';
import { requireSession } from '@/lib/session';
import {
  inviteMemberAction,
  removeMemberAction,
  updateMemberRoleAction,
} from '@/lib/workspace-actions';

export const dynamic = 'force-dynamic';

const ROLE_BADGE: Record<string, string> = {
  owner: 'border-ember-border bg-ember-soft text-ember-dark',
  admin: 'border-info-border bg-info-soft text-info-dark',
  member: 'border-line bg-sand/60 text-muted',
};

const ERROR_MESSAGES: Record<string, string> = {
  'invite-failed': 'Could not create the invitation (check your role).',
  'role-failed': 'Could not change that role.',
  'remove-failed': 'Could not remove that member.',
  'switch-failed': 'Could not switch workspace.',
};

interface WorkspacePageProps {
  searchParams?: {
    invited?: string | string[];
    error?: string | string[];
  };
}

export default async function WorkspacePage({ searchParams }: WorkspacePageProps) {
  const { state, token } = await requireSession();
  const user = state.user;
  const invited = Array.isArray(searchParams?.invited)
    ? searchParams?.invited[0]
    : searchParams?.invited;
  const errorCode = Array.isArray(searchParams?.error)
    ? searchParams?.error[0]
    : searchParams?.error;

  let data: WorkspaceMembers | null = null;
  let errorMessage: string | null = null;
  try {
    data = await getWorkspaceMembers(token);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
  }

  const role = user?.workspaceRole ?? 'member';
  const canInvite = role === 'owner' || role === 'admin';
  const canManageRoles = role === 'owner';

  return (
    <section aria-labelledby="workspace-heading" className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-line/70 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ember-dark">
            RelayCheck / Workspace
          </p>
          <span className="rounded-full border border-line bg-sand/60 px-2.5 py-0.5 font-mono text-[11px] text-muted">
            Your role: <span className="font-semibold text-ink">{role}</span>
          </span>
        </div>
        <h1
          id="workspace-heading"
          className="max-w-3xl truncate font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl"
        >
          {data?.workspaceName ?? 'Workspace'}
        </h1>
        <p className="max-w-xl text-xs leading-relaxed text-muted">
          Members only see runs from this workspace. Roles: owners manage everything, admins
          manage members, members create and inspect runs.
        </p>
      </div>

      {errorCode ? (
        <p role="alert" className="rounded-xl border border-danger-border bg-danger-soft px-4 py-3 text-xs text-danger-dark">
          {ERROR_MESSAGES[errorCode] ?? 'Action failed.'}
        </p>
      ) : null}

      {invited ? (
        <div className="rounded-xl border border-line bg-surface p-5 shadow-card">
          <h2 className="text-xs font-semibold text-ink">Invitation created</h2>
          <p className="mt-1 text-xs text-muted">
            Share this one-time link (valid 7 days). It joins the recipient to this workspace.
          </p>
          <code className="mt-3 block select-all break-all rounded-lg border border-line bg-sand/50 px-3 py-2 font-mono text-xs text-ink">
            /join?token={invited}
          </code>
        </div>
      ) : null}

      {errorMessage ? (
        <ErrorPanel
          title="Could not load workspace members"
          message={errorMessage}
          hint="Make sure the Control API is running with AUTH_REQUIRED=true."
        />
      ) : data ? (
        <div className="space-y-8">
          {canInvite ? (
            <section aria-labelledby="invite-heading" className="space-y-3">
              <h2
                id="invite-heading"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
              >
                Invite a member
              </h2>
              <form
                action={inviteMemberAction}
                className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5 shadow-card sm:flex-row sm:items-end"
              >
                <div className="flex-1 space-y-1.5">
                  <label htmlFor="invite-email" className="block text-xs font-medium text-muted">
                    Email (optional)
                  </label>
                  <input
                    id="invite-email"
                    name="email"
                    type="email"
                    placeholder="teammate@example.com"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-xs text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ember"
                  />
                </div>
                <div className="space-y-1.5 sm:w-36">
                  <label htmlFor="invite-role" className="block text-xs font-medium text-muted">
                    Role
                  </label>
                  <select
                    id="invite-role"
                    name="role"
                    defaultValue="member"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-xs text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ember"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-ember px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-ember-dark active:scale-95"
                >
                  Create invite
                </button>
              </form>
            </section>
          ) : null}

          <section aria-labelledby="members-heading" className="space-y-3">
            <h2
              id="members-heading"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
            >
              Members
            </h2>
            <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <caption className="sr-only">Workspace members</caption>
                  <thead>
                    <tr className="border-b border-line bg-sand/50">
                      {['Member', 'Role', 'Joined', 'Actions'].map((heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {data.members.map((member) => (
                      <tr
                        key={member.userId}
                        className="transition-colors hover:bg-sand/20"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand font-mono text-[10px] font-bold text-ink">
                              {member.email.charAt(0).toUpperCase()}
                            </span>
                            <span className="text-xs font-medium text-ink">{member.email}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                              ROLE_BADGE[member.role] ?? ROLE_BADGE.member
                            }`}
                          >
                            {member.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-xs text-muted">
                          {new Date(member.joinedAt).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap items-center gap-2">
                            {canManageRoles ? (
                              <form action={updateMemberRoleAction} className="flex items-center gap-1.5">
                                <input type="hidden" name="userId" value={member.userId} />
                                <label htmlFor={`role-${member.userId}`} className="sr-only">
                                  Role for {member.email}
                                </label>
                                <select
                                  id={`role-${member.userId}`}
                                  name="role"
                                  defaultValue={member.role}
                                  className="rounded-lg border border-line bg-surface px-2 py-1 text-xs text-ink"
                                >
                                  <option value="owner">owner</option>
                                  <option value="admin">admin</option>
                                  <option value="member">member</option>
                                </select>
                                <button
                                  type="submit"
                                  className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-muted hover:border-line hover:text-ink"
                                >
                                  Update
                                </button>
                              </form>
                            ) : null}
                            {canInvite && member.userId !== user?.id && member.role !== 'owner' ? (
                              <form action={removeMemberAction}>
                                <input type="hidden" name="userId" value={member.userId} />
                                <button
                                  type="submit"
                                  className="rounded-lg border border-danger-border px-2.5 py-1 text-xs font-medium text-danger hover:bg-danger-soft"
                                >
                                  Remove
                                </button>
                              </form>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {role === 'member' ? (
              <p className="text-xs text-muted">
                Only owners and admins can invite or manage members.
              </p>
            ) : null}
          </section>
        </div>
      ) : null}

      <p className="text-xs text-muted">
        Need another workspace?{' '}
        <Link href="/register" className="font-medium text-ember-dark underline-offset-4 hover:underline">
          Create an account
        </Link>{' '}
        gives each user a personal workspace; join others via invitation links.
      </p>
    </section>
  );
}
