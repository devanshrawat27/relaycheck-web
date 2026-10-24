'use client';

import { useEffect } from 'react';

/**
 * One-time reveal choreography for landing-page content.
 * Elements stay visible in the server-rendered page; animation is only applied
 * when an element enters view, and reduced-motion users receive no movement.
 */
export function MarketingMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const elements = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-item]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target as HTMLElement;
        const siblings = element.parentElement?.querySelectorAll('[data-reveal-item]');
        const index = siblings ? Array.from(siblings).indexOf(element) : 0;
        const delay = element.dataset.revealDelay
          ? Number(element.dataset.revealDelay)
          : Math.max(0, Math.min(index, 4)) * 90;
        const animation = element.animate(
          [
            { opacity: 0, translate: '0 18px', filter: 'blur(5px)' },
            { opacity: 1, translate: '0 0', filter: 'blur(0)' },
          ],
          { duration: 720, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' },
        );
        animation.onfinish = () => animation.cancel();
        observer.unobserve(element);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
