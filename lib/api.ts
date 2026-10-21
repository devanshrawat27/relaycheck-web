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
export async function getRuns(take = 20): Promise<RunListItem[]> {
  const response = await fetch(`${BASE_URL}/api/runs?take=${take}`, {
    cache: 'no-store',
    headers: { accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Control API responded with HTTP ${response.status}`);
  }
  const body = (await response.json()) as RunsListResponse;
  return body.items;
}
