import { spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const STACK_FILE = '.e2e-stack.json';

function serviceDir(envName: string, sibling: string): string {
  return process.env[envName] ?? path.resolve(process.cwd(), '..', sibling);
}

const dirs = {
  api: serviceDir('E2E_API_DIR', 'relaycheck-api'),
  demo: serviceDir('E2E_DEMO_DIR', 'relaycheck-demo-receiver'),
  runner: serviceDir('E2E_RUNNER_DIR', 'relaycheck-runner'),
};

const PLATFORM_DB =
  process.env.DATABASE_URL ?? 'postgresql://relaycheck:relaycheck@127.0.0.1:5432/relaycheck';
const DEMO_DB =
  process.env.E2E_DEMO_DATABASE_URL ??
  'postgresql://relaycheck:relaycheck@127.0.0.1:5432/relaycheck_demo';
const AMQP_URL = process.env.AMQP_URL ?? 'amqp://guest:guest@127.0.0.1:5672';
const INTERNAL_API_TOKEN = 'e2e-internal-token';
const API_AUTH_TOKEN = 'e2e-machine-token';

const pids: number[] = [];

function start(name: string, cwd: string, env: Record<string, string>): void {
  const child = spawn(process.execPath, ['dist/main'], {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'ignore',
  });
  if (child.pid) {
    pids.push(child.pid);
    console.log(`[e2e] started ${name} (pid ${child.pid})`);
  }
}

async function waitHealthy(name: string, url: string, timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (response.ok) {
        console.log(`[e2e] ${name} healthy`);
        return;
      }
    } catch {
      // Not ready yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`${name} did not become healthy at ${url}`);
}

export default async function globalSetup(): Promise<void> {
  for (const [name, dir] of Object.entries(dirs)) {
    if (!existsSync(path.join(dir, 'dist', 'main.js'))) {
      throw new Error(`${name} is not built at ${dir}. Run "npm run build" there first.`);
    }
  }

  start('demo-receiver', dirs.demo, {
    PORT: '3100',
    HOST: '127.0.0.1',
    DATABASE_URL: DEMO_DB,
    RELAYCHECK_TEST_MODE: 'true',
  });
  start('control-api', dirs.api, {
    PORT: '3200',
    HOST: '127.0.0.1',
    DATABASE_URL: PLATFORM_DB,
    AMQP_URL,
    INTERNAL_API_TOKEN,
    API_AUTH_TOKEN,
    AUTH_REQUIRED: 'true',
  });

  await waitHealthy('demo-receiver', 'http://127.0.0.1:3100/api/health');
  await waitHealthy('control-api', 'http://127.0.0.1:3200/api/health');

  start('runner', dirs.runner, {
    CONTROL_API_URL: 'http://127.0.0.1:3200',
    INTERNAL_API_TOKEN,
    DEMO_RECEIVER_URL: 'http://127.0.0.1:3100',
    AMQP_URL,
  });

  writeFileSync(STACK_FILE, JSON.stringify(pids));
}
