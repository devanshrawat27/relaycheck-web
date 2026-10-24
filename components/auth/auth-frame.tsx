import Link from 'next/link';
import type { ReactNode } from 'react';
import { Activity, ShieldCheck } from '@/components/marketing/icons';

type AuthMode = 'login' | 'register';

const COPY: Record<AuthMode, { eyebrow: string; title: string; description: string; action: string }> = {
  login: {
    eyebrow: 'Your workspace is waiting',
    title: 'Welcome back.',
    description: 'Pick up where the evidence left off. Your runs and assertions are right where you saved them.',
    action: 'New to RelayCheck?',
  },
  register: {
    eyebrow: 'Start with a clear signal',
    title: 'Make your first run count.',
    description: 'Create a workspace for repeatable webhook checks, delivery evidence, and outcomes you can trust.',
    action: 'Already have an account?',
  },
};

function BrandMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ember text-white shadow-[0_7px_18px_-9px_rgba(201,79,22,0.8)]">
      <Activity className="h-[18px] w-[18px]" />
    </span>
  );
}

export function AuthFrame({ mode, children }: { mode: AuthMode; children: ReactNode }) {
  const copy = COPY[mode];
  const alternateHref = mode === 'login' ? '/register' : '/login';
  const alternateLabel = mode === 'login' ? 'Create your account' : 'Sign in instead';

  return (
    <div className="auth-page relative isolate h-[100svh] overflow-hidden px-4 py-2 sm:px-8 sm:py-3">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,79,22,0.09),transparent_56%)]" />
      <div className="auth-page__inner mx-auto flex h-full w-full max-w-[1120px] flex-col">
        <header className="auth-page__header mb-2 flex h-9 shrink-0 items-center px-1">
          <Link href="/" className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember">
            <BrandMark />
            <span className="text-[16px] font-semibold tracking-[-0.04em] text-ink">RelayCheck</span>
          </Link>
        </header>

        <main className="auth-page__card grid min-h-0 flex-1 grid-rows-[30%_70%] overflow-hidden rounded-[28px] border border-[#E8DED2] bg-[#FFFEFC] shadow-[0_28px_80px_-42px_rgba(62,43,28,0.3),0_2px_8px_rgba(62,43,28,0.035)] lg:grid-cols-[0.96fr_1.04fr] lg:grid-rows-1">
          <section className="auth-page__left relative isolate flex min-h-0 flex-col justify-center overflow-hidden bg-[#23211F] px-5 py-3 text-white sm:px-8 sm:py-5 lg:px-12 lg:py-8">
            <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_4%,rgba(201,79,22,0.29),transparent_45%),radial-gradient(ellipse_at_100%_100%,rgba(166,98,53,0.15),transparent_48%)]" />
            <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#E9C4A9]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E87A43] shadow-[0_0_12px_rgba(232,122,67,0.8)]" />
                {copy.eyebrow}
              </div>
              <h2 className="auth-page__left-title mt-4 max-w-md font-display text-[30px] font-normal leading-[1.08] tracking-[-0.035em] text-[#FFFCF8] sm:mt-5 sm:text-[42px] lg:text-[46px]">
                {mode === 'login' ? <>Every delivery<br /><span className="text-[#E9A77E]">tells a story.</span></> : <>Give every event<br /><span className="text-[#E9A77E]">a fair test.</span></>}
              </h2>
              <p className="auth-page__left-description mt-3 max-w-[390px] text-[12px] leading-[1.65] text-[#C8C1BA] sm:mt-4 sm:text-sm sm:leading-[1.8]">{copy.description}</p>
            </div>
          </section>

          <section className="auth-page__right flex min-h-0 flex-col justify-center overflow-hidden px-5 py-3 sm:px-8 sm:py-5 lg:px-[4.5rem] lg:py-8">
            <div className="mx-auto w-full max-w-[390px]">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-ember-dark">
                {mode === 'login' ? 'Sign in to RelayCheck' : 'Create your workspace'}
              </p>
              <h1 className="auth-page__form-title mt-2 font-display text-[30px] font-normal leading-[1.05] tracking-[-0.04em] text-ink sm:mt-3 sm:text-[42px]">{copy.title}</h1>
              <p className="auth-page__right-description mt-2 text-[12px] leading-[1.55] text-[#736D64] sm:mt-3 sm:text-sm sm:leading-[1.75]">
                {mode === 'login' ? 'Sign in to run scenarios and inspect evidence in your workspace.' : 'Accounts isolate runs per workspace. Your personal workspace is ready as soon as you sign up.'}
              </p>

              <div className="mt-4 sm:mt-6">{children}</div>

              <p className="mt-3 text-center text-[11px] text-[#777168] sm:mt-5 sm:text-xs">
                {copy.action}{' '}
                <Link href={alternateHref} className="font-semibold text-ember-dark underline decoration-[#EBC6A8] underline-offset-4 transition-colors hover:text-ember">{alternateLabel}</Link>
              </p>
              <div className="auth-page__footer-proof mt-4 flex items-center justify-center gap-2 border-t border-[#EFE8DF] pt-3 text-center font-mono text-[7px] font-medium uppercase tracking-[0.1em] text-[#8B8379] sm:mt-6 sm:pt-4 sm:text-[8px]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#8C765E]" />
                Local-first testing · your evidence stays yours
              </div>
            </div>
          </section>
        </main>

      </div>
    </div>
  );
}
