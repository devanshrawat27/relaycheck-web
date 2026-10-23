'use server';

import { redirect } from 'next/navigation';
import { sessionToken } from './session';

const SUPPORTED_SCENARIOS = ['duplicate_delivery', 'receiver_failure', 'receiver_timeout'] as const;

function isSupportedScenario(value: unknown): boolean {
  return typeof value === 'string' && (SUPPORTED_SCENARIOS as readonly string[]).includes(value);
}

/** Parse an optional bounded integer form field; NaN means "invalid input". */
function optionalInt(formData: FormData, name: string): number | undefined {
  const raw = String(formData.get(name) ?? '').trim();
  if (!raw) {
    return undefined;
  }
  const value = Number(raw);
  return Number.isInteger(value) ? value : Number.NaN;
}

/**
 * Server action behind the run form. The browser supplies the scenario and
 * optional bounded parameters; event IDs and the fixed local target are
 * always generated server-side. Irrelevant parameters are dropped here and
 * re-validated by the Control API. There is deliberately no URL input.
 */
export async function createRunAction(formData: FormData): Promise<void> {
  const scenario = formData.get('scenario');
  if (!isSupportedScenario(scenario)) {
    redirect('/runs/new?error=unsupported-scenario');
  }

  const deliveryCount = optionalInt(formData, 'deliveryCount');
  const timeoutMs = optionalInt(formData, 'timeoutMs');
  const httpStatus = optionalInt(formData, 'httpStatus');
  const delayMs = optionalInt(formData, 'delayMs');
  if ([deliveryCount, timeoutMs, httpStatus, delayMs].some((value) => Number.isNaN(value))) {
    redirect('/runs/new?error=invalid-params');
  }

  const target = String(formData.get('target') ?? '').trim();
  const payload: Record<string, unknown> = { scenario, ...(target ? { target } : {}) };
  if (scenario === 'duplicate_delivery') {
    if (deliveryCount !== undefined) payload.deliveryCount = deliveryCount;
    if (timeoutMs !== undefined) payload.timeoutMs = timeoutMs;
  } else if (scenario === 'receiver_failure') {
    if (httpStatus !== undefined) payload.httpStatus = httpStatus;
    if (timeoutMs !== undefined) payload.timeoutMs = timeoutMs;
  } else {
    if (delayMs !== undefined) payload.delayMs = delayMs;
    if (timeoutMs !== undefined) payload.timeoutMs = timeoutMs;
  }

  const baseUrl = (process.env.CONTROL_API_URL ?? 'http://localhost:3200').replace(/\/$/, '');
  const apiToken = sessionToken() ?? process.env.API_AUTH_TOKEN;

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/runs`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(apiToken ? { authorization: `Bearer ${apiToken}` } : {}),
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
  } catch {
    redirect('/runs/new?error=api-unreachable');
  }

  if (response.status === 400) {
    redirect('/runs/new?error=invalid-params');
  }
  if (response.status !== 202) {
    redirect('/runs/new?error=api-rejected');
  }

  redirect('/');
}

