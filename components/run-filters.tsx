import Link from 'next/link';
import { RUN_STATUSES, type RunStatus } from '@/lib/api';

interface RunFiltersProps {
  active: RunStatus | undefined;
}

function chipClass(active: boolean): string {
  return `inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
    active
      ? 'border-ink bg-ink text-paper'
      : 'border-line bg-surface text-muted hover:border-ink/40 hover:text-ink'
  }`;
}

function statusLabel(status: RunStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Simple server-rendered status filter. Uses plain links so it works
 * without client JavaScript and stays keyboard accessible.
 */
export function RunFilters({ active }: RunFiltersProps) {
  return (
    <nav aria-label="Filter runs by status">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" aria-current={!active ? 'page' : undefined} className={chipClass(!active)}>
            All
          </Link>
        </li>
        {RUN_STATUSES.map((status) => (
          <li key={status}>
            <Link
              href={`/?status=${status}`}
              aria-current={active === status ? 'page' : undefined}
              className={chipClass(active === status)}
            >
              {statusLabel(status)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
