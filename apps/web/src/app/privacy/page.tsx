import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'SharpMind privacy policy — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container container--md">
        <article className="prose">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: September 2026</p>

          <p>
            SharpMind (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting the privacy of
            our users, particularly students. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use the SharpMind platform.
          </p>

          <h2>1. Information We Collect</h2>
          <h3>Account Information</h3>
          <p>
            When you create an account, we collect your name, email address, and optionally your role
            (student, parent, teacher). We use Supabase Authentication for secure credential management.
          </p>

          <h3>Academic Data</h3>
          <p>
            As you use SharpMind, we collect academic interaction data including: assessment responses,
            practice session results, study time logs, mistake records, and revision activity. This data
            powers your Student Model and is essential for adaptive learning to work.
          </p>

          <h3>Usage Data</h3>
          <p>
            We collect anonymised analytics data such as page views, feature usage patterns, and device
            information to improve the platform. We use privacy-respecting analytics tools.
          </p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li><strong>Adaptive Learning:</strong> Your academic data powers your personalised Student Model,
            which drives adaptive learning paths, smart assessments, and revision scheduling.</li>
            <li><strong>Platform Improvement:</strong> Anonymised, aggregated data helps us improve features,
            content quality, and learning outcomes.</li>
            <li><strong>Communication:</strong> We use your email to send essential account notifications. Marketing
            emails are only sent with explicit opt-in consent.</li>
          </ul>

          <h2>3. Student Data Protection</h2>
          <p>
            We treat student academic data as highly sensitive personal information. Our commitments:
          </p>
          <ul>
            <li>Student data is <strong>private and isolated</strong> — each student&apos;s data is logically
            separated and inaccessible to other users.</li>
            <li>We <strong>never sell</strong> student data to third parties.</li>
            <li>Parent and teacher access to student data requires <strong>explicit student authorization</strong>.</li>
            <li>AI models do not train on individual student data without anonymisation.</li>
            <li>Academic data is not used for advertising purposes.</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>
            We do not share your personal data with third parties except:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> Infrastructure providers (Supabase, Vercel) who process data
            on our behalf under strict data processing agreements.</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
            <li><strong>With Your Consent:</strong> Parent/teacher access is granted only through explicit
            student authorization flows.</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We retain your academic data for as long as your account is active. You can request data export
            or deletion at any time. Upon account deletion, all personal and academic data is permanently
            removed within 30 days.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We implement industry-standard security measures including encryption in transit (TLS) and at rest,
            access controls, regular security audits, and secure credential management through Supabase Auth.
          </p>

          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data in a portable format</li>
            <li>Withdraw consent for optional processing</li>
            <li>Object to data processing</li>
          </ul>

          <h2>8. Cookies</h2>
          <p>
            We use essential cookies for authentication and preferences. See our{' '}
            <a href="/cookies">Cookie Policy</a> for details.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes
            via email or in-app notification. Continued use after changes constitutes acceptance.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            For privacy inquiries, data requests, or concerns, contact us at{' '}
            <a href="mailto:privacy@sharpmind.app">privacy@sharpmind.app</a> or visit our{' '}
            <a href="/contact">Contact page</a>.
          </p>
        </article>
      </div>
    </section>
  );
}
