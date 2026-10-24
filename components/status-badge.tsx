import type { RunStatus } from '@/lib/api';

interface StatusStyle {
  label: string;
  icon: string;
  className: string;
  dotColor?: string;
}

/**
 * Status is communicated with label + icon + color — never color alone
 * (DESIGN.md). Labels match the API contract exactly.
 */
const STATUS_STYLES: Record<RunStatus, StatusStyle> = {
  queued: {
    label: 'Queued',
    icon: '•',
    className: 'border-line bg-sand/70 text-muted',
  },
  running: {
    label: 'Running',
    icon: '↻',
    className: 'border-info-border bg-info-soft text-info-dark animate-pulse',
  },
  passed: {
    label: 'Passed',
    icon: '✓',
    className: 'border-success-border bg-success-soft text-success-dark',
  },
  failed: {
    label: 'Failed',
    icon: '✕',
    className: 'border-danger-border bg-danger-soft text-danger-dark',
  },
  error: {
    label: 'Error',
    icon: '!',
    className: 'border-warn-border bg-warn-soft text-warn-dark',
  },
};

export function StatusBadge({ status, size = 'md' }: { status: RunStatus; size?: 'md' | 'lg' }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-medium tracking-tight ${style.className} ${
        size === 'lg' ? 'px-3.5 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'
      }`}
    >
      <span aria-hidden="true" className="font-sans font-bold leading-none">
        {style.icon}
      </span>
      <span>{style.label}</span>
    </span>
  );
}
