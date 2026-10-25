import type { AssertionResult, DeliveryAttempt, RunDetail } from '@/lib/api';

/** The assertion that carries the receiver-side business-effect count. */
export const EFFECT_ASSERTION = 'business_effect_applied_once';

const SCENARIO_LABELS: Record<string, string> = {
  duplicate_delivery: 'Duplicate delivery',
  receiver_failure: 'Controlled receiver failure',
  receiver_timeout: 'Receiver timeout',
};

/** Human label for a scenario slug. Unknown slugs degrade to a readable title. */
export function scenarioLabel(scenario: string): string {
  const known = SCENARIO_LABELS[scenario];
  if (known) {
    return known;
  }
  const spaced = scenario.replace(/[_-]+/g, ' ').trim();
  if (spaced.length === 0) {
    return 'Scenario';
  }
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export type EffectVerdict = 'single' | 'duplicate' | 'missing' | 'unknown';

export interface RunEvidence {
  label: string;
  attempts: number;
  accepted: number;
  failedAttempts: number;
  /** Receiver-side effect count from the real assertion; null when not recorded. */
  businessEffects: number | null;
  effectAssertion: AssertionResult | undefined;
  effectVerdict: EffectVerdict;
  failedAssertions: AssertionResult[];
  passedAssertions: number;
  /** e.g. `3 delivery attempts → 1 business effect` */
  headline: string;
  /** e.g. `3 attempts · 3 accepted · 1 business effect` */
  subline: string;
  terminal: boolean;
}

function toCount(value: string | undefined): number | null {
  if (value === undefined) {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

/**
 * Derives every headline number shown on the run page from persisted evidence.
 * No value is invented: attempts come from recorded deliveries, effects come
 * from the `business_effect_applied_once` assertion written by the runner.
 */
export function describeRun(run: RunDetail): RunEvidence {
  const attempts = run.attempts.length;
  const accepted = run.attempts.filter((attempt) => attempt.outcome === 'delivered').length;
  const effectAssertion = run.assertions.find((assertion) => assertion.name === EFFECT_ASSERTION);
  const businessEffects = toCount(effectAssertion?.actual);
  const failedAssertions = run.assertions.filter((assertion) => !assertion.passed);
  const passedAssertions = run.assertions.length - failedAssertions.length;

  let effectVerdict: EffectVerdict = 'unknown';
  if (effectAssertion) {
    if (effectAssertion.passed) {
      effectVerdict = 'single';
    } else if (businessEffects === 0) {
      effectVerdict = 'missing';
    } else {
      effectVerdict = 'duplicate';
    }
  }

  const terminal = run.status !== 'queued' && run.status !== 'running';

  const headline =
    businessEffects === null
      ? `${plural(attempts, 'delivery attempt')} recorded`
      : `${plural(attempts, 'delivery attempt')} → ${plural(businessEffects, 'business effect')}`;

  const subline = terminal
    ? `${plural(attempts, 'attempt')} · ${accepted} accepted · ${plural(businessEffects ?? 0, 'business effect')}`
    : 'Waiting for the runner to record delivery evidence.';

  return {
    label: scenarioLabel(run.scenario),
    attempts,
    accepted,
    failedAttempts: attempts - accepted,
    businessEffects,
    effectAssertion,
    effectVerdict,
    failedAssertions,
    passedAssertions,
    headline,
    subline,
    terminal,
  };
}

export interface AttemptView {
  attempt: DeliveryAttempt;
  /** Full event ID, preserved for idempotency verification. */
  eventId: string;
  /** Middle-truncated event ID for narrow columns. */
  shortEventId: string;
}

/** Keeps the event's prefix and suffix visible so duplicates are comparable. */
export function shortEventId(eventId: string, head = 14, tail = 6): string {
  if (eventId.length <= head + tail + 1) {
    return eventId;
  }
  return `${eventId.slice(0, head)}…${eventId.slice(-tail)}`;
}

export function toAttemptViews(attempts: DeliveryAttempt[]): AttemptView[] {
  return attempts
    .slice()
    .sort((a, b) => a.attemptNumber - b.attemptNumber)
    .map((attempt) => ({
      attempt,
      eventId: attempt.eventId,
      shortEventId: shortEventId(attempt.eventId),
    }));
}

/**
 * The API summary usually restates the derived headline. Only surface it when
 * it adds context the page cannot derive (e.g. "resumed from 1").
 */
export function extraRunNote(run: RunDetail): string | null {
  const summary = run.summary?.trim();
  if (!summary) {
    return null;
  }
  if (/resumed/i.test(summary)) {
    return summary;
  }
  return null;
}
