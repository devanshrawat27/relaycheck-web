import { getMetrics, getRun, getRuns } from '@/lib/api';

const originalFetch = global.fetch;

function mockFetchOnce(response: Partial<Response> & { json?: () => Promise<unknown> }): void {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ items: [] }),
    ...response,
  }) as unknown as typeof fetch;
}

afterEach(() => {
  global.fetch = originalFetch;
});

describe('Control API client', () => {
  it('requests a bounded run list and returns its items', async () => {
    mockFetchOnce({
      ok: true,
      status: 200,
      json: async () => ({
        items: [
          {
            id: 'run-1',
            scenario: 'duplicate_delivery',
            status: 'passed',
            summary: 'ok',
            createdAt: '2026-10-21T00:00:00.000Z',
            finishedAt: null,
            durationMs: 10,
          },
        ],
      }),
    });

    const runs = await getRuns({ take: 5, status: 'passed' });
    expect(runs).toHaveLength(1);
    expect(runs[0]?.id).toBe('run-1');

    const calledWith = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledWith).toContain('/api/runs?');
    expect(calledWith).toContain('take=5');
    expect(calledWith).toContain('status=passed');
  });

  it('throws a meaningful error when the Control API fails', async () => {
    mockFetchOnce({ ok: false, status: 500 });
    await expect(getRuns()).rejects.toThrow('Control API responded with HTTP 500');
  });

  it('returns null for a missing run (404)', async () => {
    mockFetchOnce({ ok: false, status: 404 });
    await expect(getRun('missing')).resolves.toBeNull();
  });

  it('fetches aggregate operational metrics', async () => {
    mockFetchOnce({
      ok: true,
      status: 200,
      json: async () => ({
        runs: { queued: 1, running: 0, passed: 2, failed: 0, error: 0 },
        outbox: { pending: 0, sending: 0, failed: 0, oldestPendingAgeMs: null },
        queues: { work: 0, deadLetter: 0 },
        generatedAt: '2026-10-22T00:00:00.000Z',
      }),
    });

    const metrics = await getMetrics();
    expect(metrics.runs.passed).toBe(2);
    expect(metrics.queues.deadLetter).toBe(0);
    expect((global.fetch as jest.Mock).mock.calls[0][0] as string).toContain('/api/metrics');
  });

  it('returns run detail when found', async () => {
    mockFetchOnce({
      ok: true,
      status: 200,
      json: async () => ({
        id: 'run-1',
        scenario: 'receiver_failure',
        status: 'passed',
        summary: 'expected failure',
        createdAt: '2026-10-21T00:00:00.000Z',
        finishedAt: null,
        durationMs: 5,
        params: {},
        safeError: null,
        startedAt: null,
        attempts: [],
        assertions: [],
      }),
    });

    const run = await getRun('run-1');
    expect(run?.scenario).toBe('receiver_failure');
  });
});
