'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const POLL_INTERVAL_MS = 2000;
const MAX_TICKS = 60; // bounded: at most ~2 minutes of polling

/**
 * Bounded auto-refresh while a run is queued/running. Stops automatically
 * once the run reaches a terminal state (the page re-renders with a new
 * status prop, which cleans up this effect).
 */
export function RunPoller({ status }: { status: string }) {
  const router = useRouter();
  const active = status === 'queued' || status === 'running';

  useEffect(() => {
    if (!active) {
      return;
    }
    let ticks = 0;
    const timer = setInterval(() => {
      ticks += 1;
      if (ticks > MAX_TICKS) {
        clearInterval(timer);
        return;
      }
      router.refresh();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [active, router]);

  if (!active) {
    return null;
  }

  return (
    <p
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-full bg-info-soft px-3 py-1 text-xs text-info"
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-info" />
      Waiting for the runner — this page refreshes automatically (bounded to about 2 minutes).
    </p>
  );
}
