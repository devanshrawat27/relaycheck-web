import type { RunStatus } from '@/lib/api';

interface StatusStyle {
  label: string;
  icon: string;
  className: string;
}

/**
 * Status is communicated with label + icon + color — never color alone
 * (DESIGN.md). Labels match the API contract exactly.
 */
const STATUS_STYLES: Record<RunStatus, StatusStyle> = {
  queued: {
    label: 'Queued',
    icon: '•',
    className: 'border-neutral-600 bg-neutral-800/40 text-neutral-300',
  },
  running: {
    label: 'Running',
    icon: '↻',
    className: 'border-sky-600/60 bg-sky-950/40 text-sky-300',
  },
  passed: {
    label: 'Passed',
    icon: '✓',
    className: 'border-emerald-600/60 bg-emerald-950/40 text-emerald-300',
  },
  failed: {
    label: 'Failed',
    icon: '✕',
    className: 'border-red-600/60 bg-red-950/40 text-red-300',
  },
  error: {
    label: 'Error',
    icon: '!',
    className: 'border-amber-600/60 bg-amber-950/40 text-amber-300',
  },
};

export function StatusBadge({ status }: { status: RunStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style.className}`}
    >
      <span aria-hidden="true" className="font-mono leading-none">
        {style.icon}
      </span>
      <span>{style.label}</span>
    </span>
  );
}
