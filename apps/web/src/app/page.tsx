import type { Metadata } from 'next';
import { HeroSection } from './sections/HeroSection';
import { StatsSection } from './sections/StatsSection';
import { FeaturesPreview } from './sections/FeaturesPreview';
import { HowItWorks } from './sections/HowItWorks';
import { CtaBanner } from './sections/CtaBanner';

export const metadata: Metadata = {
  title: 'SharpMind — AI Academic OS | Master Any Subject',
  description:
    'SharpMind is the AI Academic OS that models what you know, what you forget, and what you need next. Adaptive learning for JEE, NEET, CBSE, and ICSE.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesPreview />
      <HowItWorks />
      <CtaBanner />
    </>
  );
}
