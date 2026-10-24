'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'bg-sand font-semibold text-ink shadow-xs'
          : 'text-muted hover:bg-sand/60 hover:text-ink'
      }`}
    >
      {children}
    </Link>
  );
}
