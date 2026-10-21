import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
      <p className="text-sm text-neutral-400">
        The page or run you requested does not exist. It may have been removed, or the ID may be
        incorrect.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-500 hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
      >
        Back to runs
      </Link>
    </section>
  );
}
