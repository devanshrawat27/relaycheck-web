import Link from 'next/link';
import { ArrowRight, Check, CircleAlert, FileJson, ShieldCheck } from '@/components/landing/icons';

const POINTS = [
  'Sender attempts and receiver effects are separate measurements.',
  'A completed run with a wrong outcome is failed; an unreliable run is error.',
  'Safe error details are persisted without stack traces or provider internals.',
];

export function LandingEvidence() {
  return (
    <section id="evidence" className="pt-16 sm:pt-24">
      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-ink text-paper shadow-card">
        <div className="grid gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember-border">
              Evidence, not assumptions
            </p>
            <h2 className="mt-3 font-display text-3xl font-normal leading-tight tracking-tight sm:text-4xl">
              The verdict is the effect count.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/65">
              A 2xx response only means the request arrived. RelayCheck asks the receiver-side
              oracle what actually changed, then stores the values that prove it.
            </p>
            <ul className="mt-6 space-y-3">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[13px] leading-5 text-paper/75">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#EBC6A8]" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:border-ember-border/50 hover:bg-white/10"
            >
              Inspect a run <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="min-w-0 space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/50">
                  <FileJson className="h-3.5 w-3.5" aria-hidden /> delivery_attempts
                </p>
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[9px] text-paper/60">
                  3 rows
                </span>
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[380px] font-mono text-[10px]">
                  <thead className="text-[8.5px] uppercase tracking-[0.08em] text-paper/35">
                    <tr>
                      <th className="py-1 pr-3 text-left font-medium">#</th>
                      <th className="py-1 pr-3 text-left font-medium">event_id</th>
                      <th className="py-1 pr-3 text-left font-medium">http</th>
                      <th className="py-1 pr-3 text-left font-medium">outcome</th>
                      <th className="py-1 text-right font-medium">ms</th>
                    </tr>
                  </thead>
                  <tbody className="text-paper/70">
                    {[1, 2, 3].map((n) => (
                      <tr key={n} className="border-t border-white/10">
                        <td className="py-1.5 pr-3 text-paper/40">{n}</td>
                        <td className="py-1.5 pr-3">evt_7eb2f396…</td>
                        <td className="py-1.5 pr-3">201</td>
                        <td className="py-1.5 pr-3 text-[#EBC6A8]">delivered</td>
                        <td className="py-1.5 text-right">{[49, 14, 8][n - 1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/50">
                <FileJson className="h-3.5 w-3.5" aria-hidden /> assertion_results
              </p>
              <ul className="mt-3 space-y-1.5">
                <li className="flex items-center justify-between gap-3 rounded-lg border border-success/25 bg-success/10 px-3 py-2 font-mono text-[10px]">
                  <span className="text-paper/70">delivery_attempt_count</span>
                  <span className="text-paper/50">3 / 3</span>
                  <span className="flex items-center gap-1 text-[#BFE6CE]">
                    passed <Check className="h-3 w-3" aria-hidden />
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3 rounded-lg border border-success/25 bg-success/10 px-3 py-2 font-mono text-[10px]">
                  <span className="text-paper/70">business_effect_applied_once</span>
                  <span className="text-paper/50">1 / 1</span>
                  <span className="flex items-center gap-1 text-[#BFE6CE]">
                    passed <Check className="h-3 w-3" aria-hidden />
                  </span>
                </li>
              </ul>
              <p className="mt-3 flex items-start gap-2 border-t border-white/10 pt-2.5 text-[10px] leading-4 text-paper/45">
                <CircleAlert className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                A failed assertion and an execution error are reported as different verdicts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
