export default function Loading() {
  return (
    <section aria-busy="true" aria-live="polite" className="space-y-10">
      <div className="space-y-3">
        <div className="h-3 w-32 animate-pulse rounded bg-line" />
        <div className="h-11 w-full max-w-xl animate-pulse rounded-xl bg-line/80" />
        <p className="text-sm text-muted">Loading runs…</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 animate-pulse rounded bg-line" />
          <div className="h-8 w-64 animate-pulse rounded-full bg-line/70" />
        </div>
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
          <div className="h-10 border-b border-line bg-sand/60" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse border-b border-line/60 bg-surface last:border-b-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
