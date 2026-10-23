import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl rounded-xl border border-line bg-surface px-8 py-12 text-center shadow-card">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-dark">404</p>
      <h1 className="mt-2 font-display text-2xl font-normal tracking-tight text-ink">Not found</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        The page or run you requested does not exist. It may have been removed, or the ID may be
        incorrect.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ember-dark"
      >
        Back to runs
      </Link>
    </section>
  );
}
