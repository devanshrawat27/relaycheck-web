'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Check, Clock, Github, PlayCircle, Repeat2 } from './icons';
const REPO = 'https://github.com/devanshrawat27/relaycheck-web';
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BENEFITS = ['Local-first testing', 'Every attempt recorded', 'Business effects verified'];
const HERO_EVENT_ID = 'evt_7eb2f396-8bfb-4369…';
const HERO_ATTEMPTS = [49, 14, 8];

function HeroProductScene() {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative mx-auto h-[460px] w-full max-w-[700px] sm:h-[570px] lg:h-[640px] xl:ml-0 xl:h-[690px] xl:max-w-none xl:w-full"
      style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}
      role="img"
      aria-label="Illustrative RelayCheck interface showing a duplicate delivery scenario, three recorded attempts, receiver failures and timeouts, and one verified business effect."
    >
      <div aria-hidden className="absolute inset-[7%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,79,22,0.15),transparent_68%)] blur-3xl" />
      <div aria-hidden className="absolute inset-[7%] opacity-35 [background-image:radial-gradient(rgba(201,79,22,0.2)_1px,transparent_1px)] [background-size:13px_13px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

      <motion.div
        className="absolute inset-x-[1%] bottom-[12%] top-[12%] z-10 overflow-hidden rounded-[20px] border border-line bg-[#FFFEFB] shadow-[0_40px_90px_-36px_rgba(74,48,31,0.43),0_12px_28px_-16px_rgba(74,48,31,0.28)] sm:inset-x-[3%] sm:top-[12%] sm:bottom-[8%] xl:top-[12%] xl:bottom-[14%]"
        style={{ transformStyle: 'flat', transformOrigin: 'center center' }}
        initial={false}
        animate={reduce ? { rotateZ: -1.2 } : { rotateZ: [-1.2, -0.7, -1.2], y: [0, -2, 0], z: [0, 5, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-line bg-[#F7F3ED] px-3">
            <span className="h-2 w-2 rounded-full bg-[#E9A08B]" /><span className="h-2 w-2 rounded-full bg-[#E7C27B]" /><span className="h-2 w-2 rounded-full bg-[#A7C79E]" />
            <span className="ml-2 truncate font-mono text-[7px] tracking-wide text-muted sm:text-[8px]">relaycheck / scenarios / duplicate-delivery</span>
            <span className="ml-auto shrink-0 rounded-full border border-success-border bg-success-soft px-2 py-0.5 font-mono text-[7px] uppercase tracking-wider text-success">local demo</span>
          </div>
          <div className="flex min-h-0 flex-1">
            <aside className="hidden w-[82px] shrink-0 border-r border-line bg-[#FBF9F5] px-2.5 py-3 sm:block lg:w-[112px] xl:w-[150px] xl:px-4 xl:py-5">
              <div className="flex items-center gap-1.5 px-1">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-ember text-[10px] font-bold text-white">R</span>
                <span className="text-[9px] font-semibold tracking-tight text-ink xl:text-[11px]">RelayCheck</span>
              </div>
              <nav aria-label="Illustrative dashboard navigation" className="mt-5 space-y-1 text-[9px] text-muted xl:mt-8 xl:space-y-2 xl:text-[11px]">
                <span className="block rounded-md bg-ember-soft px-2 py-1.5 font-semibold text-ember-dark xl:px-3 xl:py-2.5">◈ Scenarios</span>
                <span className="block px-2 py-1.5 xl:px-3 xl:py-2.5">◷ Runs</span>
                <span className="block px-2 py-1.5 xl:px-3 xl:py-2.5">◇ Targets</span>
                <span className="block px-2 py-1.5 xl:px-3 xl:py-2.5">▤ Evidence</span>
              </nav>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between gap-2 border-b border-line/80 pb-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ember-soft text-ember-dark sm:h-10 sm:w-10"><Repeat2 className="h-4 w-4 sm:h-[18px] sm:w-[18px]" /></span>
                  <div className="min-w-0">
                    <p className="font-mono text-[7px] font-semibold uppercase tracking-[0.15em] text-ember-dark sm:text-[8px]">Core scenario · 01</p>
                    <p className="mt-0.5 truncate font-display text-sm font-semibold tracking-tight text-ink sm:text-base lg:text-lg">Duplicate delivery</p>
                    <p className="hidden text-[8px] text-muted sm:block">Same event ID, recorded across three attempts.</p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-ember px-2 py-1.5 font-sans text-[8px] font-semibold text-white sm:px-3 sm:text-[9px]"><PlayCircle className="h-3.5 w-3.5" /> RUN SCENARIO</span>
              </div>

              <div className="mt-3 grid shrink-0 gap-3 sm:grid-cols-[0.88fr_1.12fr] sm:gap-4 xl:grid-cols-[0.72fr_1.28fr] xl:gap-6">
                <div className="min-w-0 bg-[#FFFEFB] p-2.5 sm:p-0 sm:py-1">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-ink sm:text-[9px]">Scenario input</p>
                    <span className="font-mono text-[7px] text-muted">1 / 3</span>
                  </div>
                  <p className="mt-2 text-[8px] text-muted">Stable event ID</p>
                  <code className="mt-1 block truncate rounded-md border border-line bg-white px-2 py-1.5 font-mono text-[8px] text-ink sm:text-[9px]">{HERO_EVENT_ID}</code>
                  <p className="mt-2 text-[8px] text-muted">Allowed target</p>
                  <div className="mt-1 flex items-center gap-1.5 rounded-md border border-line bg-white px-2 py-1.5 text-[8px] text-ink sm:text-[9px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> demo-receiver (local)
                  </div>
                  <div className="mt-2.5 hidden overflow-hidden rounded-lg border border-line/80 bg-white sm:block">
                    <div className="flex items-center gap-3 border-b border-line bg-sand/40 px-2.5 pt-2 font-sans text-[7px] text-muted">
                      <span className="border-b-2 border-ember pb-1 font-semibold text-ember-dark">Request</span><span className="pb-1">Response</span><span className="pb-1">Headers</span>
                    </div>
                    <div className="px-2.5 py-2 font-mono text-[7px] leading-[1.65] text-ink-secondary">
                      <div><span className="text-muted">1&nbsp; {'{'}</span></div>
                      <div><span className="text-ember-dark">2&nbsp; &quot;eventId&quot;</span>: &quot;{HERO_EVENT_ID}&quot;,</div>
                      <div><span className="text-ember-dark">3&nbsp; &quot;type&quot;</span>: &quot;demo.event&quot;</div>
                      <div><span className="text-muted">4&nbsp; {'}'}</span></div>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 xl:border-l xl:border-line xl:pl-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-ink sm:text-[9px]">Delivery attempts</p>
                    <span className="rounded-full border border-line bg-white px-2 py-0.5 font-mono text-[7px] uppercase tracking-wider text-muted">POST · LOCAL</span>
                  </div>
                  <div className="relative mt-1.5 space-y-1.5 before:absolute before:bottom-5 before:left-[13px] before:top-5 before:w-px before:bg-ember/35">
                    {HERO_ATTEMPTS.map((ms, index) => (
                      <div key={ms} className="relative flex items-center gap-2 rounded-lg border border-line/90 bg-white px-2 py-1.5 shadow-[0_2px_5px_-4px_rgba(74,48,31,0.35)] sm:gap-2.5 sm:px-2.5 sm:py-2">
                        <span className="relative z-[1] grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ember-border bg-[#FFF9F2] font-mono text-[8px] font-bold text-ember-dark">{index + 1}</span>
                        <span className="min-w-0 flex-1"><span className="block truncate text-[8px] font-semibold text-ink sm:text-[9px]">Delivery attempt {index + 1}</span><span className="hidden truncate font-mono text-[7px] text-muted sm:block">same event ID · {HERO_EVENT_ID}</span></span>
                        <span className="shrink-0 rounded-md bg-success-soft px-1.5 py-1 font-mono text-[7px] font-semibold text-success sm:px-2 sm:text-[8px]">201 OK</span>
                        <span className="w-7 shrink-0 text-right font-mono text-[7px] text-muted sm:w-9 sm:text-[8px]">{ms} ms</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-success-border bg-success-soft/80 px-3 py-2.5 sm:px-4 xl:mt-4 xl:py-3">
                <span className="flex min-w-0 items-center gap-2"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success text-white"><Check className="h-3.5 w-3.5" aria-hidden /></span><span className="min-w-0"><span className="block truncate text-[8px] font-semibold text-ink sm:text-[9px] xl:text-[11px]">3 delivery attempts → 1 business effect</span><span className="hidden text-[8px] text-ink-secondary xl:block">Idempotency verified by the local receiver</span></span></span>
                <span className="shrink-0 font-mono text-[7px] font-semibold uppercase tracking-wider text-success sm:text-[8px]">Verified</span>
              </div>
              <p className="mt-2 text-right font-mono text-[7px] uppercase tracking-[0.13em] text-muted">Illustrative example data</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div aria-hidden className="absolute left-0 top-[2%] z-40 hidden w-[24%] lg:block">
        <p className="font-display text-[15px] italic leading-tight text-[#564437] xl:text-[17px]">Inspect real requests<br />and responses</p>
        <svg className="ml-10 mt-1 h-10 w-16 text-ember" viewBox="0 0 64 40" fill="none"><path d="M2 2c8 18 22 23 48 27m0 0-12-10m12 10-14 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>

      <div aria-hidden className="absolute right-0 top-[1%] z-40 hidden w-[22%] text-right lg:block">
        <p className="font-display text-[15px] italic leading-tight text-[#564437] xl:text-[17px]">Run real scenarios<br />with one click</p>
        <svg className="ml-auto mr-8 mt-1 h-10 w-16 -scale-x-100 text-ember" viewBox="0 0 64 40" fill="none"><path d="M2 2c8 18 22 23 48 27m0 0-12-10m12 10-14 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>

      <motion.div className="absolute bottom-[1%] left-0 z-30 hidden w-[39%] -rotate-[3deg] rounded-[18px] border border-line bg-[#FFFEFB] p-3.5 shadow-[0_28px_60px_-25px_rgba(74,48,31,0.42)] xl:block" animate={reduce ? undefined : { y: [0, 4, 0], rotateZ: [-3, -2.5, -3] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
        <div className="flex items-start gap-2.5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-danger-border bg-danger-soft text-danger"><AlertTriangle className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold text-ink">Receiver failure</span><span className="mt-0.5 block text-[8px] leading-relaxed text-ink-secondary">Controlled 503 response · 3 attempts</span></span><span className="rounded-full border border-danger-border bg-danger-soft px-2 py-1 font-mono text-[7px] font-semibold text-danger">INJECTED</span></div>
        <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-2.5">{[1, 2, 3].map((attempt) => <span key={attempt} className="flex min-w-0 flex-1 items-center justify-between rounded-md bg-danger-soft/70 px-2 py-1.5 font-mono text-[7px] text-danger"><span>0{attempt}</span><span className="font-semibold">503</span></span>)}</div>
        <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2 font-mono text-[8px]"><span className="text-muted">Business effects</span><span className="font-semibold text-danger">0 applied</span></div>
      </motion.div>

      <motion.div className="absolute bottom-[0%] right-0 z-30 hidden w-[39%] rotate-[2deg] rounded-[18px] border border-line bg-[#FFFEFB] p-3.5 shadow-[0_28px_60px_-25px_rgba(74,48,31,0.42)] xl:block" animate={reduce ? undefined : { y: [0, -4, 0], rotateZ: [2, 1.4, 2] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}>
        <div className="flex items-start gap-2.5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-warn-border bg-warn-soft text-warn"><Clock className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold text-ink">Receiver timeout</span><span className="mt-0.5 block text-[8px] leading-relaxed text-ink-secondary">Delay the local receiver beyond the deadline.</span></span></div>
        <div className="mt-3 rounded-lg border border-line bg-paper/70 p-2.5"><div className="flex items-center justify-between font-mono text-[7px]"><span className="text-muted">Client timeout</span><span className="font-semibold text-ink">2,000 ms</span></div><div className="relative mt-2 h-2 rounded-full bg-gradient-to-r from-[#F5D5B5] via-[#E9B082] to-[#F8E3D3]"><span className="absolute -top-1 left-[72%] h-4 w-0.5 bg-danger" /><span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-danger shadow-sm" /></div><p className="mt-2 text-right font-mono text-[7px] font-semibold text-danger">Deadline exceeded</p></div>
        <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2 font-mono text-[8px]"><span className="text-muted">Recorded outcome</span><span className="font-semibold text-warn">Timeout attempt</span></div>
      </motion.div>

    </div>
  );
}

export function MarketingHero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[580px] bg-[radial-gradient(54%_75%_at_78%_24%,rgba(201,79,22,0.075),transparent_70%),radial-gradient(60%_60%_at_12%_0%,rgba(255,255,255,0.8),transparent_68%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-7 px-4 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-8 lg:pb-20 lg:pt-20">
        <div className="relative z-20 min-w-0" data-reveal>
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/60 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ember-dark sm:text-[10px]">
                Webhook testing for real-world integrations
              </span>
            </div>
          </motion.div>

          <h1 className="mt-6 font-display text-[2.7rem] font-normal leading-[0.99] tracking-[-0.045em] text-ink sm:text-[3rem] lg:text-[3.1rem] xl:text-[3.25rem]">
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={false}
                animate={{ y: 0 }}
                transition={{ duration: 0.75, ease: EASE, delay: 0.08 }}
              >
                Ship webhook
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="block text-ember-dark"
                initial={false}
                animate={{ y: 0 }}
                transition={{ duration: 0.75, ease: EASE, delay: 0.18 }}
              >
                integrations
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="block text-ink"
                initial={false}
                animate={{ y: 0 }}
                transition={{ duration: 0.75, ease: EASE, delay: 0.25 }}
              >
                with confidence.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-5 max-w-lg font-display text-[17px] leading-[1.7] text-ink-secondary sm:text-lg"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.32 }}
          >
            Replay duplicate deliveries, inject controlled receiver failures, and inspect every
            attempt—so you can verify the business effect before your integration ships.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.44 }}
          >
            <Link
              href="/runs/new"
              className="inline-flex items-center gap-2 rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-ember-dark hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2"
            >
              Get started <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-line hover:bg-sand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40"
            >
              <Github className="h-4 w-4" /> View on GitHub
            </a>
          </motion.div>

          <motion.ul
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line/70 pt-5"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.56 }}
          >
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-1.5 text-xs text-muted">
                <Check className="h-3.5 w-3.5 text-ember" aria-hidden />
                {benefit}
              </li>
            ))}
          </motion.ul>

          <motion.p
            className="mt-4 text-[11px] text-muted"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.66 }}
          >
            Runs against your own local receiver. No production traffic required.
          </motion.p>
        </div>

        <div data-reveal data-reveal-delay="140">
          <HeroProductScene />
        </div>
      </div>
    </section>
  );
}
