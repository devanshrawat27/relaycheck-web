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
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-ember-soft text-ember-dark'
          : 'text-muted hover:bg-sand hover:text-ink'
      }`}
    >
      {children}
    </Link>
  );
}
