interface ErrorPanelProps {
  title: string;
  message: string;
  hint?: string;
}

export function ErrorPanel({ title, message, hint }: ErrorPanelProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-amber-700/60 bg-amber-950/30 px-4 py-4 text-sm"
    >
      <h2 className="font-semibold text-amber-200">{title}</h2>
      <p className="mt-1 text-amber-100/80">{message}</p>
      {hint ? <p className="mt-2 text-xs text-amber-100/60">{hint}</p> : null}
    </div>
  );
}
