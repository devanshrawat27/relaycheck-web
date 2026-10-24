'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/**
 * The application shell. The public landing page owns its own header and
 * footer, so the app chrome is skipped there instead of being duplicated.
 */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/welcome' || pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#skip"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ember focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      {header}
      <main id="skip" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
      {footer}
    </>
  );
}
