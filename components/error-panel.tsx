interface ErrorPanelProps {
  title: string;
  message: string;
  hint?: string;
}

export function ErrorPanel({ title, message, hint }: ErrorPanelProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-warn/25 bg-warn-soft px-5 py-4 text-sm"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-warn">needs attention</p>
      <h2 className="mt-1 text-base font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-ink/80">{message}</p>
      {hint ? <p className="mt-2 text-xs text-ink/60">{hint}</p> : null}
    </div>
  );
}
