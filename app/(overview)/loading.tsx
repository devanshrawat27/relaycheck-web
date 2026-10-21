export default function Loading() {
  return (
    <section aria-busy="true" aria-live="polite" className="space-y-6">
      <div className="space-y-1">
        <div className="h-7 w-24 animate-pulse rounded bg-neutral-800" />
        <p className="text-sm text-neutral-400">Loading runs…</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-neutral-800">
        <div className="h-10 border-b border-neutral-800 bg-neutral-900/60" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-12 animate-pulse border-b border-neutral-800/60 bg-neutral-900/30 last:border-b-0"
          />
        ))}
      </div>
    </section>
  );
}
