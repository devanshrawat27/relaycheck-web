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
const API_TOKEN = process.env.API_AUTH_TOKEN;

function authHeaders(): Record<string, string> {
  return API_TOKEN ? { authorization: `Bearer ${API_TOKEN}` } : {};
}

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
    headers: { accept: 'application/json', ...authHeaders() },
  });
  if (!response.ok) {
    throw new Error(`Control API responded with HTTP ${response.status}`);
  }
  const body = (await response.json()) as RunsListResponse;
  return body.items;
}

export interface DeliveryAttempt {
  id: number;
  runId: string;
  attemptNumber: number;
  eventId: string;
  httpStatus: number | null;
  outcome: 'delivered' | 'error' | 'timeout';
  durationMs: number;
  errorDetail: string | null;
  createdAt: string;
}

export interface AssertionResult {
  id: number;
  runId: string;
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
  createdAt: string;
}

export interface RunDetail extends RunListItem {
  params: Record<string, unknown>;
  safeError: string | null;
  startedAt: string | null;
  attempts: DeliveryAttempt[];
  assertions: AssertionResult[];
}

export const RUN_STATUSES: RunStatus[] = ['queued', 'running', 'passed', 'failed', 'error'];

export function isRunStatus(value: unknown): value is RunStatus {
  return typeof value === 'string' && (RUN_STATUSES as string[]).includes(value);
}

export interface MetricsResponse {
  runs: Record<string, number>;
  outbox: {
    pending: number;
    sending: number;
    failed: number;
    oldestPendingAgeMs: number | null;
  };
  queues: { work: number; deadLetter: number };
  generatedAt: string;
}

/** Aggregate operational metrics (counts only). */
export async function getMetrics(): Promise<MetricsResponse> {
  const response = await fetch(`${BASE_URL}/api/metrics`, {
    cache: 'no-store',
    headers: { accept: 'application/json', ...authHeaders() },
  });
  if (!response.ok) {
    throw new Error(`Control API responded with HTTP ${response.status}`);
  }
  return (await response.json()) as MetricsResponse;
}

/** Best-effort service health probe for the diagnostics page. */
export async function isServiceHealthy(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(2500) });
    return response.ok;
  } catch {
    return false;
  }
}

/** Run detail, or null when the run does not exist (404). */
export async function getRun(id: string): Promise<RunDetail | null> {
  const response = await fetch(`${BASE_URL}/api/runs/${encodeURIComponent(id)}`, {
    cache: 'no-store',
    headers: { accept: 'application/json', ...authHeaders() },
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Control API responded with HTTP ${response.status}`);
  }
  return (await response.json()) as RunDetail;
}

