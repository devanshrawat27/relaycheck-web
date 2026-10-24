'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Github, Menu, X } from './icons';

const REPO = 'https://github.com/devanshrawat27/relaycheck-web';
const README = 'https://github.com/devanshrawat27/relaycheck-web#readme';

const LINKS = [
  { href: '#product', label: 'Product', external: false },
  { href: '#features', label: 'Features', external: false },
  { href: '#how', label: 'How it works', external: false },
  { href: README, label: 'Documentation', external: true },
] as const;

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-200 ${
        scrolled || open
          ? 'border-line bg-paper/95 shadow-xs backdrop-blur-md'
          : 'border-transparent bg-paper'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-ember focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-[64px] w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember text-white shadow-xs transition-transform group-hover:scale-105">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M2.5 10h3l2-4 3 8 2-4h5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-base font-semibold tracking-tight text-ink">RelayCheck</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-medium text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted transition-colors hover:bg-sand hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40"
          >
            <Github className="h-4 w-4" />
            <span className="hidden xl:inline">GitHub</span>
          </a>
          <Link
            href="/login"
            className="inline-flex h-8 items-center rounded-lg border border-line bg-surface px-3 text-xs font-medium text-ink transition-colors hover:border-line hover:bg-sand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-ember px-3.5 text-xs font-semibold text-white transition-colors hover:bg-ember-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2"
          >
            Get started <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="marketing-mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink transition-colors hover:border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 lg:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div
          id="marketing-mobile-nav"
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-paper px-4 pb-5 pt-3 shadow-lg lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-sand/60"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-sand/60"
                >
                  {link.label}
                </a>
              ),
            )}
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-sand/60"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </nav>
          <div className="mt-4 grid gap-2 border-t border-line pt-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-line bg-surface text-xs font-medium text-ink"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-ember text-xs font-semibold text-white"
            >
              Get started <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
