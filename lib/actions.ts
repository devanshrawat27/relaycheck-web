'use server';

import { redirect } from 'next/navigation';

const SUPPORTED_SCENARIOS = ['duplicate_delivery', 'receiver_failure', 'receiver_timeout'] as const;

function isSupportedScenario(value: unknown): boolean {
  return typeof value === 'string' && (SUPPORTED_SCENARIOS as readonly string[]).includes(value);
}

/**
 * Server action behind the run form. Only the scenario identifier is ever
 * accepted from the browser — all delivery parameters (event IDs, delivery
 * count, timeout, and the fixed local target) are generated server-side by
 * the Control API and the runner. There is deliberately no URL input.
 *
 * Errors are surfaced as a redirect code on the form page so the form works
 * without client JavaScript (progressive enhancement).
 */
export async function createRunAction(formData: FormData): Promise<void> {
  const scenario = formData.get('scenario');
  if (!isSupportedScenario(scenario)) {
    redirect('/runs/new?error=unsupported-scenario');
  }

  const baseUrl = (process.env.CONTROL_API_URL ?? 'http://localhost:3200').replace(/\/$/, '');

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/runs`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ scenario }),
      cache: 'no-store',
    });
  } catch {
    redirect('/runs/new?error=api-unreachable');
  }

  if (response.status !== 202) {
    redirect('/runs/new?error=api-rejected');
  }

  redirect('/');
}
