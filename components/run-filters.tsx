import Link from 'next/link';
import { RUN_STATUSES, type RunStatus } from '@/lib/api';

interface RunFiltersProps {
  active: RunStatus | undefined;
}

function chipClass(active: boolean): string {
  return `rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
    active
      ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300'
      : 'border-neutral-700 bg-neutral-900/40 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
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
