import type { Metadata } from 'next';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingWorkflow } from '@/components/landing/landing-workflow';
import { LandingProduct } from '@/components/landing/landing-product';
import { LandingEvidence } from '@/components/landing/landing-evidence';
import { LandingCta } from '@/components/landing/landing-cta';

export const metadata: Metadata = {
  title: 'Webhook evidence, not assumptions — RelayCheck',
  description:
    'Repeatable webhook scenarios that record every delivery attempt and verify the business effect. Local-first, with evidence you can inspect.',
};

export default function WelcomePage() {
  return (
    <div className="space-y-0">
      <LandingHero />
      <LandingWorkflow />
      <LandingProduct />
      <LandingEvidence />
      <LandingCta />
    </div>
  );
}
