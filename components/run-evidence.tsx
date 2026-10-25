import type { RunEvidence } from '@/lib/run-evidence';

function MetricCard({
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  detail: string;
  tone?: 'neutral' | 'success' | 'danger';
}) {
  const surface =
    tone === 'success'
      ? 'border-success-border bg-success-soft'
      : tone === 'danger'
        ? 'border-danger-border bg-danger-soft'
        : 'border-line bg-sand/35';
  const labelTone =
    tone === 'success' ? 'text-success' : tone === 'danger' ? 'text-danger-dark' : 'text-muted';
  const valueTone =
    tone === 'success' ? 'text-success-dark' : tone === 'danger' ? 'text-danger-dark' : 'text-ink';
  const detailTone =
    tone === 'success'
      ? 'text-success/90'
      : tone === 'danger'
        ? 'text-danger-dark/80'
        : 'text-muted';

  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${surface}`}>
      <p className={`font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${labelTone}`}>
        {label}
      </p>
      <p className={`mt-2 font-mono text-[28px] font-semibold leading-none tracking-tight sm:text-[32px] ${valueTone}`}>
        {value}
      </p>
      <p className={`mt-2.5 text-xs leading-relaxed ${detailTone}`}>{detail}</p>
    </div>
  );
}

/**
 * Sender attempts, receiver effects, and duration are deliberately separate
 * measurements (PRD). They are never combined into a single "success" number.
 */
export function RunMetrics({
  evidence,
  durationLabel,
}: {
  evidence: RunEvidence;
  durationLabel: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
      <MetricCard
        label="Delivery attempts"
        value={String(evidence.attempts)}
        detail="Sender-side HTTP deliveries recorded by the runner."
      />
      <MetricCard
        label="Business effects"
        value={evidence.businessEffects === null ? '—' : String(evidence.businessEffects)}
        detail={
          evidence.businessEffects === null
            ? 'No receiver-side count was recorded for this run.'
            : 'Receiver-side effects reported by the test oracle.'
        }
        tone={
          evidence.effectVerdict === 'single'
            ? 'success'
            : evidence.effectVerdict === 'duplicate' || evidence.effectVerdict === 'missing'
              ? 'danger'
              : 'neutral'
        }
      />
      <MetricCard
        label="Total duration"
        value={durationLabel}
        detail="From runner claim to finalize."
      />
    </div>
  );
}

const TONES = {
  verified: {
    wrap: 'border-success-border bg-success-soft',
    icon: 'bg-success text-white',
    glyph: '✓',
    eyebrow: 'text-success',
    footer: 'text-success-dark',
  },
  failed: {
    wrap: 'border-danger-border bg-danger-soft',
    icon: 'bg-danger text-white',
    glyph: '✕',
    eyebrow: 'text-danger-dark',
    footer: 'text-danger-dark',
  },
  unknown: {
    wrap: 'border-line bg-sand/40',
    icon: 'bg-stone text-white',
    glyph: '·',
    eyebrow: 'text-muted',
    footer: 'text-muted',
  },
} as const;

/**
 * The single sentence the product exists to prove: sender attempts on one
 * side, receiver business effects on the other. Every number is derived from
 * persisted attempts and the runner's effect assertion.
 */
export function EffectVerdictStrip({ evidence }: { evidence: RunEvidence }) {
  if (!evidence.terminal) {
    return null;
  }

  const tone =
    evidence.effectVerdict === 'single'
      ? TONES.verified
      : evidence.effectVerdict === 'unknown'
        ? TONES.unknown
        : TONES.failed;

  const detail =
    evidence.effectVerdict === 'single'
      ? 'Idempotency verified: duplicate deliveries did not repeat the business effect.'
      : evidence.effectVerdict === 'duplicate'
        ? 'Each duplicate delivery applied the effect again. The receiver is not idempotent.'
        : evidence.effectVerdict === 'missing'
          ? 'No business effect was recorded. The receiver accepted the delivery but applied nothing.'
          : 'The receiver-side business-effect count was not recorded, so this run has no effect verdict.';

  const tag =
    evidence.effectVerdict === 'single'
      ? 'Verified'
      : evidence.effectVerdict === 'unknown'
        ? 'Unknown'
        : 'Failed';

  return (
    <section
      aria-label="Delivery to business-effect result"
      className={`flex flex-col gap-3 rounded-xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${tone.wrap}`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${tone.icon}`}
        >
          {tone.glyph}
        </span>
        <div className="min-w-0">
          <p className={`font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${tone.eyebrow}`}>
            Delivery → outcome
          </p>
          <p className="mt-1 text-[15px] font-semibold leading-snug text-ink">{evidence.headline}</p>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ink-secondary/90">{detail}</p>
        </div>
      </div>
      <span
        className={`shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] sm:pl-4 ${tone.footer}`}
      >
        {tag}
      </span>
    </section>
  );
}

/**
 * `failed` means execution completed but an assertion failed; `error` means the
 * scenario could not complete reliably. Both explain themselves from real data.
 */
export function VerdictCallout({ evidence, safeError }: {
  evidence: RunEvidence;
  safeError: string | null;
}) {
  if (!evidence.terminal) {
    return null;
  }

  if (evidence.failedAssertions.length > 0) {
    const first = evidence.failedAssertions[0];
    return (
      <section
        aria-label="Assertion failure"
        className="rounded-xl border border-danger-border bg-danger-soft px-5 py-4"
      >
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-danger-dark">
          Assertion failure
        </p>
        <h2 className="mt-1.5 text-base font-semibold text-ink">
          Execution completed, but the behaviour is wrong
        </h2>
        <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-ink-secondary">
          {evidence.failedAssertions.length} required assertion
          {evidence.failedAssertions.length === 1 ? '' : 's'} did not pass. This is a
          product-behaviour failure, not an infrastructure problem.
        </p>
        <dl className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1.5 font-mono text-[11px] text-ink-secondary">
          <div className="flex items-center gap-2">
            <dt className="text-muted">assertion</dt>
            <dd className="font-semibold text-ink">{first.name}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="text-muted">expected</dt>
            <dd className="font-semibold text-ink">{first.expected}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="text-muted">actual</dt>
            <dd className="font-semibold text-danger-dark">{first.actual}</dd>
          </div>
        </dl>
      </section>
    );
  }

  if (evidence.failedAssertions.length === 0 && safeError) {
    return (
      <section
        aria-label="Execution error"
        className="rounded-xl border border-warn-border bg-warn-soft px-5 py-4"
      >
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-warn-dark">
          Execution error
        </p>
        <h2 className="mt-1.5 text-base font-semibold text-ink">
          The scenario could not complete reliably
        </h2>
        <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-ink-secondary">
          An infrastructure or execution problem prevented a verdict. This is not an assertion
          failure.
        </p>
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-warn-dark">{safeError}</p>
      </section>
    );
  }

  return null;
}
