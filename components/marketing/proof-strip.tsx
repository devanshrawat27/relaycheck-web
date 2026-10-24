import { Activity, Github, Repeat2, ShieldCheck } from './icons';

const REPO = 'https://github.com/devanshrawat27/relaycheck-web';

const CAPABILITIES = [
  { icon: Repeat2, label: 'Repeatable webhook scenarios' },
  { icon: Activity, label: 'Observable delivery attempts' },
  { icon: ShieldCheck, label: 'Verifiable business outcomes' },
] as const;

export function MarketingProofStrip() {
  return (
    <section aria-label="Product capabilities" className="border-y border-line/80 bg-sand/50 backdrop-blur-[2px]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
          Built for the delivery layer
        </p>
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2.5">
          {CAPABILITIES.map((item) => (
            <li key={item.label} data-reveal-item className="flex items-center gap-2 text-[13px] font-medium text-ink/80">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ember-border/60 bg-surface text-ember-dark shadow-card">
                <item.icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              {item.label}
            </li>
          ))}
          <li data-reveal-item>
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
                className="flex items-center gap-2 text-[13px] font-medium text-muted transition-colors hover:text-ink"
            >
              <Github className="h-3.5 w-3.5 text-ink/70" aria-hidden />
              Public source on GitHub
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
