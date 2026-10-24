import type { Metadata } from 'next';
import { MotionConfig } from 'framer-motion';
import { MarketingHeader } from '@/components/marketing/site-header';
import { MarketingHero } from '@/components/marketing/hero';
import { MarketingProofStrip } from '@/components/marketing/proof-strip';
import { MarketingScenarios } from '@/components/marketing/scenarios';
import { MarketingWorkflow } from '@/components/marketing/workflow';
import { MarketingEvidence } from '@/components/marketing/evidence';
import { MarketingFeatures } from '@/components/marketing/features';
import { MarketingCta } from '@/components/marketing/cta';
import { MarketingFooter } from '@/components/marketing/site-footer';
import { MarketingMotion } from '@/components/marketing/marketing-motion';

export const metadata: Metadata = {
  title: 'Webhook reliability, verified — RelayCheck',
  description:
    'Simulate duplicate deliveries, receiver failures, and timeouts. Verify idempotency and inspect every delivery attempt with evidence you can trust.',
};

export default function WelcomePage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-paper text-ink">
        <MarketingMotion />
        <MarketingHeader />
        <main id="main">
          <MarketingHero />
          <MarketingProofStrip />
          <MarketingScenarios />
          <MarketingWorkflow />
          <MarketingEvidence />
          <MarketingFeatures />
          <MarketingCta />
        </main>
        <MarketingFooter />
      </div>
    </MotionConfig>
  );
}
