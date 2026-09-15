import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'SharpMind terms of service — rules and conditions for using the platform.',
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container container--md">
        <article className="prose">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: September 2026</p>

          <p>
            Welcome to SharpMind. By accessing or using our platform, you agree to be bound by these
            Terms of Service. Please read them carefully.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account or using SharpMind, you agree to these Terms, our{' '}
            <a href="/privacy">Privacy Policy</a>, and our <a href="/cookies">Cookie Policy</a>.
            If you are under 18, you must have parental or guardian consent.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            SharpMind is an AI-powered Academic Operating System that provides adaptive learning,
            practice, assessment, revision, and analytics services. The platform uses artificial
            intelligence to personalise the learning experience.
          </p>

          <h2>3. User Accounts</h2>
          <ul>
            <li>You must provide accurate and complete registration information.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You must notify us immediately of any unauthorized access.</li>
            <li>One person per account; accounts are non-transferable.</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the platform for any unlawful purpose</li>
            <li>Attempt to access other users&apos; data</li>
            <li>Reverse-engineer, decompile, or disassemble the platform</li>
            <li>Use automated tools to scrape or extract content</li>
            <li>Share your account with others</li>
            <li>Submit false or misleading information</li>
          </ul>

          <h2>5. Content and Intellectual Property</h2>
          <p>
            All curriculum content, question banks, AI-generated materials, and platform features are
            the intellectual property of SharpMind or its licensors. You retain ownership of any
            original content you submit (notes, feedback).
          </p>

          <h2>6. AI-Generated Content</h2>
          <p>
            SharpMind uses AI to generate explanations, recommendations, and learning materials.
            While we strive for accuracy, AI-generated content should be verified against authoritative
            curriculum sources. SharpMind clearly distinguishes between verified curriculum content
            and AI-generated materials.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            SharpMind is a learning aid and does not guarantee specific academic outcomes, exam scores,
            or admissions results. We provide the platform &ldquo;as is&rdquo; and make no warranties
            regarding uninterrupted or error-free service.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may suspend or terminate your account for violations of these Terms. You may delete
            your account at any time. Upon termination, your data will be handled per our Privacy Policy.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. Material changes will be communicated via email
            or in-app notification at least 30 days before taking effect.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes will be resolved in the
            courts of appropriate jurisdiction.
          </p>

          <h2>11. Contact</h2>
          <p>
            For questions about these Terms, contact us at{' '}
            <a href="mailto:legal@sharpmind.app">legal@sharpmind.app</a>.
          </p>
        </article>
      </div>
    </section>
  );
}
