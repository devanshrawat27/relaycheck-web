import { RunScenarioForm } from '@/components/run-scenario-form';

const ERROR_MESSAGES: Record<string, string> = {
  'unsupported-scenario': 'Choose one of the supported scenarios.',
  'api-unreachable': 'Could not reach the Control API. Make sure it is running and try again.',
  'api-rejected': 'The Control API rejected this run. Check the service logs and try again.',
};

interface NewRunPageProps {
  searchParams?: { error?: string | string[] };
}

export default function NewRunPage({ searchParams }: NewRunPageProps) {
  const raw = Array.isArray(searchParams?.error) ? searchParams?.error[0] : searchParams?.error;
  const errorMessage = raw ? (ERROR_MESSAGES[raw] ?? 'The run could not be started.') : null;

  return (
    <section aria-labelledby="new-run-heading" className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 id="new-run-heading" className="text-2xl font-semibold tracking-tight">
          Run a scenario
        </h1>
        <p className="text-sm text-neutral-400">
          Start a repeatable webhook test against the local demo receiver. Review the planned
          behavior before starting.
        </p>
        {errorMessage ? (
          <p role="alert" className="text-sm text-red-300">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <RunScenarioForm />
    </section>
  );
}
