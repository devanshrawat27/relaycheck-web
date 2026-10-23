import { existsSync, readFileSync, unlinkSync } from 'node:fs';

const STACK_FILE = '.e2e-stack.json';

export default async function globalTeardown(): Promise<void> {
  if (!existsSync(STACK_FILE)) {
    return;
  }
  const pids = JSON.parse(readFileSync(STACK_FILE, 'utf8')) as number[];
  for (const pid of pids) {
    try {
      process.kill(pid);
      console.log(`[e2e] stopped pid ${pid}`);
    } catch {
      // Already exited.
    }
  }
  unlinkSync(STACK_FILE);
}
