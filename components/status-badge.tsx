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
    className: 'border-line bg-line/40 text-muted',
  },
  running: {
    label: 'Running',
    icon: '↻',
    className: 'border-info/20 bg-info-soft text-info',
  },
  passed: {
    label: 'Passed',
    icon: '✓',
    className: 'border-success/20 bg-success-soft text-success',
  },
  failed: {
    label: 'Failed',
    icon: '✕',
    className: 'border-danger/20 bg-danger-soft text-danger',
  },
  error: {
    label: 'Error',
    icon: '!',
    className: 'border-warn/20 bg-warn-soft text-warn',
  },
};

export function StatusBadge({ status, size = 'md' }: { status: RunStatus; size?: 'md' | 'lg' }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border font-semibold ${style.className} ${
        size === 'lg' ? 'px-4 py-2 text-sm' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span aria-hidden="true" className="font-mono leading-none">
        {style.icon}
      </span>
      <span>{style.label}</span>
    </span>
  );
}
