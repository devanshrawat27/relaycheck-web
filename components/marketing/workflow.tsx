'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CircleCheck, PlayCircle, Send, Settings } from './icons';
import { TiltCard } from './tilt-card';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STEPS = [
  {
    n: '01',
    title: 'Configure',
    body: 'Choose a scenario, select an allowed target, and set the run parameters through the form.',
    icon: Settings,
  },
  {
    n: '02',
    title: 'Execute',
    body: 'Start the run and watch the worker record each delivery attempt as it happens.',
    icon: Send,
  },
  {
    n: '03',
    title: 'Verify',
    body: 'Inspect response codes, timings, assertion values, and available receiver-side effects.',
    icon: CircleCheck,
  },
  {
    n: '04',
    title: 'Improve',
    body: 'Use the recorded evidence to fix the integration before the next deploy ships.',
    icon: PlayCircle,
  },
] as const;

const SCENARIO_OPTIONS = [
  { value: 'duplicate_delivery', label: 'Duplicate delivery' },
  { value: 'receiver_failure', label: 'Receiver failure' },
  { value: 'receiver_timeout', label: 'Receiver timeout' },
] as const;

function DemoConfigure() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="mt-4 w-full rounded-lg border border-line bg-paper/50 p-3 text-left">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">Scenario</p>
        <p className="font-mono text-[9px] text-muted">{selected + 1} / 3</p>
      </div>
      <div role="radiogroup" aria-label="Scenario" className="mt-1.5 space-y-0.5">
        {SCENARIO_OPTIONS.map((option, index) => {
          const isSelected = selected === index;
          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-sand/60 focus-within:bg-sand/60"
            >
              <input
                type="radio"
                name="demo-scenario"
                value={option.value}
                checked={isSelected}
                onChange={() => setSelected(index)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isSelected ? 'border-ember' : 'border-line'
                }`}
              >
                {isSelected ? <span className="h-1.5 w-1.5 rounded-full bg-ember" /> : null}
              </span>
              <span className={`text-[11px] transition-colors ${isSelected ? 'font-medium text-ink' : 'text-muted'}`}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function DemoExecute() {
  return (
    <div className="mt-4 w-full rounded-lg border border-line bg-paper/50 p-3 text-left font-mono">
      <p className="text-[9px] uppercase tracking-[0.12em] text-muted">Delivery attempts</p>
      <div className="mt-1.5 space-y-1 text-[10px]">
        {[['1', '49 ms'], ['2', '14 ms'], ['3', '8 ms']].map(([n, ms]) => (
          <div key={n} className="flex items-center justify-between rounded bg-surface px-2 py-1">
            <span className="text-muted">#{n}</span>
            <span className="flex items-center gap-2">
              <span className="rounded bg-success-soft px-1.5 py-0.5 font-semibold text-success">200 OK</span>
              <span className="text-muted">{ms}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoVerify() {
  return (
    <div className="mt-4 w-full rounded-lg border border-line bg-paper/50 p-3 text-left">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="text-[12px] font-semibold text-ink">3 attempts → 1 business effect</span>
      </div>
      <p className="mt-1.5 pl-7 font-mono text-[10px] text-success">Idempotency verified</p>
    </div>
  );
}

function DemoImprove() {
  const metrics = [
    ['Passed', '3 / 3'],
    ['Attempts', '3'],
    ['Effects', '1'],
    ['Duration', '156 ms'],
  ];
  return (
    <div className="mt-4 grid w-full grid-cols-2 gap-1.5 text-left">
      {metrics.map(([label, value]) => (
        <div key={label} className="rounded-md border border-line bg-paper/50 px-2 py-1.5">
          <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted">{label}</p>
          <p className="mt-0.5 font-mono text-[12px] font-semibold text-ink">{value}</p>
        </div>
      ))}
    </div>
  );
}

function StepDemo({ step }: { step: string }) {
  if (step === 'Configure') return <DemoConfigure />;
  if (step === 'Execute') return <DemoExecute />;
  if (step === 'Verify') return <DemoVerify />;
  return <DemoImprove />;
}

export function MarketingWorkflow() {
  return (
    <section id="how" className="border-y border-line bg-sand/45 backdrop-blur-[1px]">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember-dark">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl font-normal leading-tight tracking-tight text-ink sm:text-[2.6rem]">
            A simple workflow, complete visibility.
          </h2>
          <p className="mt-4 font-display text-[17px] leading-[1.7] text-ink-secondary">
            RelayCheck is built around one loop: run the same scenario, inspect the evidence, and
            make the integration more reliable.
          </p>
        </div>

        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-px lg:block"
          >
            <div className="h-full w-full bg-gradient-to-r from-ember/20 via-ember/60 to-ember/20" />
            <span className="absolute top-1/2 left-0 h-2 w-2 -translate-y-1/2 rounded-full bg-ember shadow-[0_0_14px_rgba(201,79,22,0.7)] motion-safe:animate-flow" />
          </div>

          <ol className="relative grid gap-y-8 lg:grid-cols-4 lg:gap-x-0 lg:[perspective:1200px]">
            {STEPS.map((step) => (
              <motion.li
                key={step.title}
                data-reveal-item
                whileHover={{
                  y: -3,
                  z: 16,
                  transition: { duration: 0.35, ease: EASE },
                }}
                className="group/step flex flex-col items-center lg:px-6"
              >
                <div className="relative z-10 [perspective:700px]" style={{ transform: 'translateZ(32px)' }}>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-2 rounded-[19px] bg-ember/20 opacity-0 blur-lg transition-opacity duration-300 group-hover/step:opacity-100"
                  />
                  <motion.div
                    whileHover={{
                      rotateX: -12,
                      rotateY: 12,
                      scale: 1.08,
                      z: 24,
                      transition: { type: 'spring', stiffness: 280, damping: 17 },
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative flex h-12 w-12 items-center justify-center rounded-[15px] border border-white/30 bg-gradient-to-br from-[#E26A2B] via-ember to-ember-dark text-white shadow-[0_12px_24px_-9px_rgba(168,61,16,0.72),inset_0_1px_0_rgba(255,255,255,0.34)] transition-shadow duration-300 group-hover/step:shadow-[0_16px_28px_-8px_rgba(168,61,16,0.78),inset_0_1px_0_rgba(255,255,255,0.42)]"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-[2px] rounded-[12px] border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),transparent_58%)]"
                    />
                    <step.icon className="relative z-10 h-[21px] w-[21px] drop-shadow-[0_1px_1px_rgba(90,33,9,0.32)]" />
                  </motion.div>
                </div>

                <TiltCard tiltStrength={10} className="group relative mt-4 flex min-h-[320px] w-full flex-col items-start overflow-clip rounded-2xl border border-line bg-gradient-to-b from-surface via-surface to-paper px-6 pb-6 pt-8 shadow-card transition-shadow duration-300 hover:shadow-elevated lg:min-h-[420px] lg:items-center lg:text-center">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center overflow-hidden font-display text-[13rem] font-normal leading-none tracking-[-0.08em] text-transparent"
                    style={{ transform: 'translateZ(-12px)', WebkitTextStroke: '1.5px rgba(201, 79, 22, 0.075)' }}
                  >
                    {step.n}
                  </span>
                  <div
                    className="relative z-10 flex w-full flex-col items-start [transform-style:preserve-3d] lg:items-center lg:text-center"
                    style={{ transform: 'translateZ(24px)' }}
                  >
                    <h3 className="text-lg font-semibold tracking-tight text-ink">{step.title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{step.body}</p>
                    <div className="w-full" style={{ transform: 'translateZ(18px)' }}>
                      <StepDemo step={step.title} />
                    </div>
                  </div>
                </TiltCard>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="mx-auto mt-14 max-w-4xl">
          <div className="flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember-soft text-ember-dark">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ember-dark">
                  Evidence scope
                </p>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                  Remote targets provide HTTP delivery evidence only. Receiver-side business-effect
                  verification depends on the supported demo receiver integration.
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ember-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2"
            >
              Open the dashboard <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
