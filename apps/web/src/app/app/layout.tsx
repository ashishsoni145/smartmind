import { Suspense } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            color: 'var(--color-text-secondary)',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderTopColor: '#ffffff',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
            Loading SharpMind Workspace...
          </p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
