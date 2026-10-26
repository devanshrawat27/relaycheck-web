import type { ReactNode } from 'react';
import { cx, panelBase, panelMuted } from '@/lib/ui';

/** Neutral surface with a subtle border. */
export function Panel({
  children,
  muted = false,
  className,
}: {
  children: ReactNode;
  muted?: boolean;
  className?: string;
}) {
  return <div className={cx(muted ? panelMuted : panelBase, className)}>{children}</div>;
}

/** Eyebrow + title + description used at the top of a panel. */
export function PanelHeader({
  eyebrow,
  title,
  titleId,
  description,
}: {
  eyebrow?: string;
  title: string;
  titleId?: string;
  description?: string;
}) {
  return (
    <div className="border-b border-line/70 px-5 py-4">
      {eyebrow ? (
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ember-dark">
          {eyebrow}
        </p>
      ) : null}
      <h2 id={titleId} className="mt-1 text-sm font-semibold text-ink">
        {title}
      </h2>
      {description ? <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p> : null}
    </div>
  );
}

/** Section heading with an optional trailing action. */
export function SectionHeading({
  eyebrow,
  title,
  titleId,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  titleId?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-1">
        {eyebrow ? (
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ember-dark">
            {eyebrow}
          </p>
        ) : null}
        <h1
          id={titleId}
          className="font-display text-3xl font-normal leading-tight tracking-tight text-ink sm:text-4xl"
        >
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 self-start sm:self-auto">{action}</div> : null}
    </div>
  );
}

type Tone = 'neutral' | 'success' | 'danger' | 'warn' | 'info' | 'accent';

const BADGE_TONES: Record<Tone, string> = {
  neutral: 'border-line bg-sand/70 text-muted',
  success: 'border-success-border bg-success-soft text-success-dark',
  danger: 'border-danger-border bg-danger-soft text-danger-dark',
  warn: 'border-warn-border bg-warn-soft text-warn-dark',
  info: 'border-info-border bg-info-soft text-info-dark',
  accent: 'border-ember-border bg-ember-soft text-ember-dark',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Compact stat used in overview strips. */
export function Metric({
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: Tone;
}) {
  const valueTone =
    tone === 'success'
      ? 'text-success-dark'
      : tone === 'danger'
        ? 'text-danger-dark'
        : tone === 'warn'
          ? 'text-warn-dark'
          : tone === 'info'
            ? 'text-info-dark'
            : 'text-ink';
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-3">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className={cx('mt-1.5 text-2xl font-semibold tabular-nums tracking-tight', valueTone)}>
        {value}
      </p>
      {detail ? <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{detail}</p> : null}
    </div>
  );
}

/** Accessible disclosure for secondary detail. Uses native <details>. */
export function Collapsible({
  title,
  subtitle,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-line bg-surface"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember sm:px-5">
        <span className="min-w-0">
          <span className="block">{title}</span>
          {subtitle ? (
            <span className="mt-0.5 block text-xs font-normal text-muted">{subtitle}</span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 font-mono text-muted transition-transform group-open:rotate-90"
        >
          ›
        </span>
      </summary>
      <div className="border-t border-line/70 px-4 py-4 sm:px-5">{children}</div>
    </details>
  );
}
