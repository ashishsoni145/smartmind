import type { Metadata, Viewport } from 'next';
import { Layout } from '@/components/layout/Layout';
import { AuthProvider } from '@/lib/auth/auth-context';
import { ThemeProvider } from '@/lib/theme/theme-context';
import { sharedMetadata } from './metadata';
import '@/styles/globals.css';

export const metadata: Metadata = sharedMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                if (t) document.documentElement.setAttribute('data-theme', t);
              } catch (e) {}
            `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
