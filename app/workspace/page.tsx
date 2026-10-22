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
  owner: 'bg-ember-soft text-ember',
  admin: 'bg-info-soft text-info',
  member: 'bg-line/50 text-muted',
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
    <section aria-labelledby="workspace-heading" className="space-y-10">
      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember">
          RelayCheck / Workspace
        </p>
        <h1
          id="workspace-heading"
          className="text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl"
        >
          {data?.workspaceName ?? 'Workspace'}
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          Members only see runs from this workspace. Roles: owners manage everything, admins
          manage members, members create and inspect runs.
        </p>
        <p className="text-xs text-muted">
          Your role: <span className="font-mono text-ink">{role}</span>
        </p>
      </div>

      {errorCode ? (
        <p role="alert" className="rounded-xl border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger">
          {ERROR_MESSAGES[errorCode] ?? 'Action failed.'}
        </p>
      ) : null}

      {invited ? (
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <h2 className="text-sm font-semibold text-ink">Invitation created</h2>
          <p className="mt-1 text-xs text-muted">
            Share this one-time link (valid 7 days). It joins the recipient to this workspace.
          </p>
          <code className="mt-3 block select-all break-all rounded-xl bg-ink/5 px-3 py-2 font-mono text-xs text-ink">
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
        <>
          {canInvite ? (
            <section aria-labelledby="invite-heading" className="space-y-4">
              <h2
                id="invite-heading"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
              >
                Invite a member
              </h2>
              <form
                action={inviteMemberAction}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 shadow-card sm:flex-row sm:items-end"
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
                    className="w-full rounded-xl border border-line bg-paper/50 px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="invite-role" className="block text-xs font-medium text-muted">
                    Role
                  </label>
                  <select
                    id="invite-role"
                    name="role"
                    defaultValue="member"
                    className="rounded-xl border border-line bg-paper/50 px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink"
                >
                  Create invite
                </button>
              </form>
            </section>
          ) : null}

          <section aria-labelledby="members-heading" className="space-y-4">
            <h2
              id="members-heading"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
            >
              Members
            </h2>
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <caption className="sr-only">Workspace members</caption>
                  <thead>
                    <tr className="border-b border-line bg-paper/60">
                      {['Email', 'Role', 'Joined', 'Actions'].map((heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.members.map((member) => (
                      <tr
                        key={member.userId}
                        className="border-b border-line/60 transition-colors last:border-b-0 hover:bg-paper/50"
                      >
                        <td className="px-5 py-3.5 text-sm text-ink">{member.email}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
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
                                  className="rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:border-ink/40 hover:text-ink"
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
                                  className="rounded-full border border-danger/25 px-2.5 py-1 text-xs text-danger hover:bg-danger-soft"
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
        </>
      ) : null}

      <p className="text-xs text-muted">
        Need another workspace? <Link href="/register" className="text-ember underline-offset-4 hover:underline">Create an account</Link>{' '}
        gives each user a personal workspace; join others via invitation links.
      </p>
    </section>
  );
}
