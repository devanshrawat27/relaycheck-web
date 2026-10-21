export type RunStatus = 'queued' | 'running' | 'passed' | 'failed' | 'error';

export interface RunListItem {
  id: string;
  scenario: string;
  status: RunStatus;
  summary: string | null;
  createdAt: string;
  finishedAt: string | null;
  durationMs: number | null;
}

export interface RunsListResponse {
  items: RunListItem[];
}

const BASE_URL = (process.env.CONTROL_API_URL ?? 'http://localhost:3200').replace(/\/$/, '');

/**
 * Server-side client for the Control API. The dashboard never talks to
 * PostgreSQL or the queue directly, and never fabricates run data.
 */
export async function getRuns(options: { take?: number; status?: RunStatus } = {}): Promise<RunListItem[]> {
  const params = new URLSearchParams();
  params.set('take', String(options.take ?? 20));
  if (options.status) {
    params.set('status', options.status);
  }
  const response = await fetch(`${BASE_URL}/api/runs?${params.toString()}`, {
    cache: 'no-store',
    headers: { accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Control API responded with HTTP ${response.status}`);
  }
  const body = (await response.json()) as RunsListResponse;
  return body.items;
}

export const RUN_STATUSES: RunStatus[] = ['queued', 'running', 'passed', 'failed', 'error'];

export function isRunStatus(value: unknown): value is RunStatus {
  return typeof value === 'string' && (RUN_STATUSES as string[]).includes(value);
}
