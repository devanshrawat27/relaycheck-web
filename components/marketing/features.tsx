import { Activity, Database, Layers, Repeat2, ShieldCheck, WorkspaceIcon, Zap } from './icons';

const FEATURES = [
  {
    icon: Repeat2,
    title: 'Repeatable scenario execution',
    body: 'Run the same scenario after every deploy and compare the persisted evidence instead of relying on memory.',
    tag: 'deterministic runs',
  },
  {
    icon: Zap,
    title: 'Failure injection',
    body: 'Use controlled receiver errors and delays, gated behind explicit local test mode and bounded by design.',
    tag: 'fail-closed',
  },
  {
    icon: Activity,
    title: 'Attempt-level debugging',
    body: 'Inspect each attempt’s event ID, HTTP status, duration, and safe error detail without digging through logs.',
    tag: 'per attempt',
  },
  {
    icon: ShieldCheck,
    title: 'Idempotency verification',
    body: 'The demo receiver stores a unique consumer + event key, then the oracle confirms the effect count.',
    tag: '1 effect',
  },
  {
    icon: Database,
    title: 'Persistent run history',
    body: 'Runs, attempts, and assertions are stored in PostgreSQL, so evidence survives restarts and browser refreshes.',
    tag: 'persisted',
  },
  {
    icon: WorkspaceIcon,
    title: 'Workspace-based access',
    body: 'When accounts are enabled, runs are scoped to a workspace with owner, admin, and member roles.',
    tag: 'when enabled',
  },
] as const;

export function MarketingFeatures() {
  return (
    <section id="features" className="relative overflow-hidden border-t border-line bg-[#F3EEE7]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_12%,rgba(201,79,22,0.075),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.42),transparent_40%)]" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-9">
          <div className="max-w-2xl" data-reveal>
            <p className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ember-dark">
              <span className="h-px w-7 bg-ember" />
              Developer features
            </p>
            <h2 className="mt-3 font-display text-3xl font-normal leading-[1.08] tracking-tight text-ink sm:text-[2.75rem]">
              Built for the person on call.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-ink-secondary sm:text-base">
              The useful details are all here: what was sent, what came back, what persisted, and
              which assertion decided the result.
            </p>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-ember-border/70 bg-surface/80 px-3.5 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-secondary shadow-card">
            <Layers className="h-3.5 w-3.5 text-ember" aria-hidden /> Evidence, not dashboards alone
          </span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              data-reveal-item
              className="group relative isolate flex min-h-[246px] flex-col overflow-hidden rounded-[22px] border border-[#E9DED1] bg-[#FFFEFC] p-6 shadow-[0_2px_5px_rgba(64,43,25,0.025),0_12px_30px_-22px_rgba(64,43,25,0.18)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#E6B18E] hover:shadow-[0_4px_8px_rgba(64,43,25,0.035),0_24px_48px_-25px_rgba(101,59,31,0.27)] sm:p-7"
            >
              <div aria-hidden className="absolute inset-[5px] -z-10 rounded-[17px] border border-[#F2ECE4] transition-colors duration-300 group-hover:border-[#F0DFD1]" />
              <div aria-hidden className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#DFA77F] to-transparent opacity-65 transition-opacity duration-300 group-hover:opacity-100" />
              <div aria-hidden className="absolute -right-16 -top-20 -z-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(201,79,22,0.075),transparent_70%)] opacity-70 transition-transform duration-500 group-hover:scale-110" />
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-[15px] border border-[#F0D8C7] bg-[linear-gradient(145deg,#FFFEFC_8%,#FDF2E9_100%)] text-ember-dark shadow-[0_5px_12px_-9px_rgba(129,63,28,0.6),inset_0_1px_0_rgba(255,255,255,0.9)] transition-[transform,box-shadow] duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_16px_-10px_rgba(129,63,28,0.58)]">
                  <feature.icon className="h-[19px] w-[19px]" aria-hidden />
                </span>
                <span className="rounded-full border border-[#EDE4DA] bg-[#FBF8F4] px-3 py-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-[#766D63]">
                  {feature.tag}
                </span>
              </div>
              <p className="mt-6 flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-ember-dark">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span aria-hidden className="h-px w-4 bg-[#E7C7B1]" />
                <span className="text-[#93877A]">Capability</span>
              </p>
              <h3 className="mt-2 font-display text-[20px] font-medium leading-[1.25] tracking-[-0.025em] text-ink sm:text-[21px]">
                {feature.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.72] text-[#69635C] sm:text-[15px]">{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
