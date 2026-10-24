import Link from 'next/link';
import { RUN_STATUSES, type RunStatus } from '@/lib/api';

interface RunFiltersProps {
  active: RunStatus | undefined;
}

function chipClass(active: boolean): string {
  return `inline-flex min-h-7 items-center rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ember ${
    active
      ? 'bg-surface text-ink font-semibold shadow-xs border border-line'
      : 'text-muted hover:text-ink hover:bg-sand/60'
  }`;
}

function statusLabel(status: RunStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Clean segmented status filter bar. Uses plain links for SSR and accessibility.
 */
export function RunFilters({ active }: RunFiltersProps) {
  return (
    <nav aria-label="Filter runs by status" className="max-w-full overflow-x-auto rounded-lg border border-line bg-sand/40 p-1">
      <ul className="flex w-max flex-nowrap items-center gap-0.5">
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
