import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'SharpMind cookie policy — what cookies we use and why.',
};

export default function CookiesPage() {
  return (
    <section className="section">
      <div className="container container--md">
        <article className="prose">
          <h1>Cookie Policy</h1>
          <p className="last-updated">Last updated: September 2026</p>

          <p>
            This Cookie Policy explains how SharpMind uses cookies and similar technologies
            to provide, improve, and protect our services.
          </p>

          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They
            help us remember your preferences, keep you logged in, and understand how you use
            our platform.
          </p>

          <h2>2. Types of Cookies We Use</h2>

          <h3>Essential Cookies</h3>
          <p>
            These cookies are strictly necessary for the platform to function. They enable core
            features like authentication, security, and session management. You cannot opt out
            of essential cookies.
          </p>
          <ul>
            <li><strong>Authentication:</strong> Keeps you logged in securely across sessions.</li>
            <li><strong>Security:</strong> Protects against cross-site request forgery (CSRF).</li>
            <li><strong>Preferences:</strong> Stores your theme preference (dark/light mode).</li>
          </ul>

          <h3>Analytics Cookies</h3>
          <p>
            We use privacy-respecting analytics to understand how users interact with the platform.
            These cookies collect anonymised data and do not track you across other websites.
          </p>
          <ul>
            <li><strong>Usage patterns:</strong> Pages visited, features used, time spent.</li>
            <li><strong>Performance:</strong> Page load times, errors encountered.</li>
          </ul>

          <h3>Functional Cookies</h3>
          <p>
            These cookies enable enhanced functionality like remembering your study preferences
            and interface customisations.
          </p>

          <h2>3. Third-Party Cookies</h2>
          <p>
            We minimise third-party cookies. Our infrastructure providers (Supabase for authentication,
            Vercel for hosting) may set cookies necessary for their services to function securely.
          </p>

          <h2>4. Managing Cookies</h2>
          <p>
            You can manage cookies through your browser settings. Note that disabling essential
            cookies will prevent the platform from functioning correctly.
          </p>
          <ul>
            <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
            <li><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
          </ul>

          <h2>5. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy as our use of cookies evolves. Changes will be
            posted on this page with an updated &ldquo;Last updated&rdquo; date.
          </p>

          <h2>6. Contact</h2>
          <p>
            For questions about our use of cookies, contact us at{' '}
            <a href="mailto:privacy@sharpmind.app">privacy@sharpmind.app</a>.
          </p>
        </article>
      </div>
    </section>
  );
}
