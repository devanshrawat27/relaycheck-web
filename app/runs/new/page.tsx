import Link from 'next/link';
import { RunScenarioForm } from '@/components/run-scenario-form';
import { getTargets, type PublicTarget } from '@/lib/api';
import { requireSession } from '@/lib/session';

const ERROR_MESSAGES: Record<string, string> = {
  'unsupported-scenario': 'Choose one of the supported scenarios.',
  'api-unreachable': 'Could not reach the Control API. Make sure it is running and try again.',
  'api-rejected': 'The Control API rejected this run. Check the service logs and try again.',
  'invalid-params':
    'Those parameters are out of bounds for the selected scenario (attempts 1–5, timeout 500–15000 ms, status 400–599, delay 0–10000 ms; delay must exceed the timeout).',
};

interface NewRunPageProps {
  searchParams?: { error?: string | string[] };
}

export default async function NewRunPage({ searchParams }: NewRunPageProps) {
  const { token } = await requireSession();
  let targets: PublicTarget[] = [];
  try {
    targets = await getTargets(token);
  } catch {
    targets = [];
  }
  const raw = Array.isArray(searchParams?.error) ? searchParams?.error[0] : searchParams?.error;
  const errorMessage = raw ? (ERROR_MESSAGES[raw] ?? 'The run could not be started.') : null;

  return (
    <section aria-labelledby="new-run-heading" className="max-w-3xl space-y-10">
      <div className="space-y-3">
        <Link
          href="/"
          className="text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          ← Back to runs
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember">
          RelayCheck / New run
        </p>
        <h1
          id="new-run-heading"
          className="text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl"
        >
          Run a scenario.
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          Start a repeatable webhook test against the local demo receiver. RelayCheck chooses the
          parameters; you choose the behaviour you want to prove.
        </p>
        {errorMessage ? (
          <p
            role="alert"
            className="rounded-xl border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            {errorMessage}
          </p>
        ) : null}
      </div>

      <RunScenarioForm targets={targets} />
    </section>
  );
}


