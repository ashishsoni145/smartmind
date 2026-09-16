'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isAppWorkspace = pathname?.startsWith('/app');

  // Authenticated workspace manages its own full-viewport shell without marketing header/footer
  if (isAppWorkspace) {
    return <>{children}</>;
  }

  return (
    <div className={styles.layout}>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className={styles.main} tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
