/** Small class helpers so buttons, inputs, and panels stay consistent. */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:cursor-not-allowed disabled:opacity-50';

export const buttonPrimary = `${BUTTON_BASE} bg-ember text-white hover:bg-ember-dark`;
export const buttonSecondary = `${BUTTON_BASE} border border-line bg-surface text-ink hover:bg-sand/60`;
export const buttonGhost = `${BUTTON_BASE} text-muted hover:bg-sand/50 hover:text-ink`;

export const inputBase =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-stone transition-colors hover:border-stone/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ember';

export const panelBase = 'rounded-xl border border-line bg-surface';
export const panelMuted = 'rounded-xl border border-line bg-sand/40';
