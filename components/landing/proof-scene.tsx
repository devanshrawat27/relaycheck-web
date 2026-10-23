'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Check, Database, Repeat2, ShieldCheck } from '@/components/landing/icons';
import { StatusBadge } from '@/components/status-badge';

const ATTEMPTS = [
  { n: 1, status: 201, ms: 49 },
  { n: 2, status: 201, ms: 14 },
  { n: 3, status: 201, ms: 8 },
] as const;

const EVENT_ID = 'evt_7eb2f396-8bfb-4369-8887-01ed31b62528';

/**
 * Illustrative evidence scene for the landing page. No live data is fetched;
 * every value is labelled as an example. The scan pauses when off-screen and
 * is disabled for reduced-motion users by the motion-safe utility.
 */
export function ProofScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(Boolean(entry?.isIntersecting) && !document.hidden),
      { threshold: 0.1 },
    );
    observer.observe(node);
    const onVisibility = () => setActive(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[560px]">
      <p className="mb-2 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
        Illustrative example data
      </p>

      <div className="relative grid gap-3 lg:block lg:h-[530px]">
        <svg
          aria-hidden
          viewBox="0 0 560 530"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        >
          <path
            d="M330 250C420 250 430 210 455 200"
            stroke="#E8E0D5"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M455 288C455 340 470 360 500 366"
            stroke="#E8E0D5"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="331" cy="250" r="2.2" fill="#C94F16" />
          <circle cx="454" cy="201" r="2.2" fill="#C94F16" />
          <circle cx="454" cy="290" r="2.2" fill="#C94F16" />
          <circle cx="499" cy="365" r="2.2" fill="#C94F16" />
        </svg>

        {active ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-4 top-14 bottom-24 hidden overflow-hidden lg:block"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-ember to-transparent opacity-60 motion-safe:animate-scan-soft" />
          </div>
        ) : null}

        <div className="rounded-xl border border-line bg-surface p-4 shadow-card lg:absolute lg:left-0 lg:top-0 lg:w-[52%] lg:max-w-[300px]">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Event</p>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-ember-border bg-ember-soft px-2 py-0.5 font-mono text-[9px] text-ember-dark">
              duplicate_delivery
            </span>
          </div>
          <p className="mt-2 truncate font-mono text-[11px] text-ink" title={EVENT_ID}>
            {EVENT_ID}
          </p>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-muted">
            <Repeat2 className="h-3.5 w-3.5 text-ember" aria-hidden />
            Same event ID delivered three times
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-4 shadow-card lg:absolute lg:left-0 lg:top-[128px] lg:w-[57%] lg:max-w-[330px]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold text-ink">Delivery attempts</p>
            <span className="rounded-md bg-sand px-2 py-0.5 font-mono text-[9px] text-muted">
              3 recorded
            </span>
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {ATTEMPTS.map((attempt) => (
              <li
                key={attempt.n}
                className="flex items-center justify-between gap-2 rounded-lg border border-line/80 bg-paper/70 px-2.5 py-1.5 font-mono text-[10px]"
              >
                <span className="text-stone">#{attempt.n}</span>
                <span className="truncate text-ink">POST /api/webhooks/demo</span>
                <span className="text-success">{attempt.status}</span>
                <span className="w-9 text-right text-muted">{attempt.ms} ms</span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 border-t border-line/70 pt-2 text-[9.5px] leading-4 text-muted">
            Every attempt is persisted, even when the receiver treats it as a duplicate.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-4 shadow-card lg:absolute lg:right-0 lg:top-[62px] lg:w-[40%] lg:max-w-[224px]">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-success-soft text-success">
              <Database className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-ink">Demo receiver</p>
              <p className="font-mono text-[9px] text-muted">idempotent write</p>
            </div>
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            Business effects
          </p>
          <p className="mt-1 font-mono text-4xl font-medium leading-none text-success">1</p>
          <p className="mt-2 text-[10px] leading-4 text-muted">
            Unique key: <span className="font-mono text-ink">consumer + event ID</span>
          </p>
          <div className="mt-3 flex items-center gap-1.5 rounded-md bg-success-soft px-2 py-1 text-[9px] font-medium text-success">
            <Check className="h-3 w-3" aria-hidden />
            Duplicate deliveries absorbed
          </div>
        </div>

        <div className="rounded-xl border border-ink/10 bg-ink p-4 text-paper shadow-card lg:absolute lg:bottom-0 lg:right-0 lg:w-[52%] lg:max-w-[270px]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#EBC6A8]" aria-hidden />
              <p className="text-[11px] font-semibold">Assertions</p>
            </div>
            <StatusBadge status="passed" />
          </div>
          <dl className="mt-3 space-y-1.5 font-mono text-[10px]">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-paper/55">delivery_attempt_count</dt>
              <dd className="text-paper">3 = 3</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-paper/55">business_effect_applied_once</dt>
              <dd className="text-paper">1 = 1</dd>
            </div>
          </dl>
          <p className="mt-3 border-t border-white/10 pt-2 text-[9.5px] leading-4 text-paper/55">
            A 2xx response is not the verdict. The effect count is.
          </p>
        </div>
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-stone lg:hidden">
        <ArrowDown className="h-3 w-3" aria-hidden />
        Three deliveries, one business effect
      </p>
    </div>
  );
}
