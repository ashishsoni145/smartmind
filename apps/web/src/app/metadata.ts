import type { Metadata } from 'next';

const SITE_NAME = 'SharpMind';
const SITE_DESCRIPTION =
  'SharpMind is the AI Academic OS that continuously models what you know, what you forget, and what you need next — turning goals into evidence-backed learning, practice, and exam readiness.';
const SITE_URL = 'https://sharpmind.app'; // Update when domain is live

export const siteConfig = {
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
};

export const sharedMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — AI Academic OS`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'SharpMind',
    'AI learning',
    'academic OS',
    'adaptive learning',
    'student model',
    'spaced repetition',
    'exam preparation',
    'JEE preparation',
    'NEET preparation',
    'CBSE',
    'ICSE',
    'AI tutor',
    'smart revision',
    'mistake analysis',
    'knowledge graph',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — AI Academic OS`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — AI Academic OS`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};
