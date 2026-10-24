import type { ReactNode } from 'react';

/**
 * Premium container card with subtle, human-crafted hover refinement.
 * Avoids gimmicky cursor-tracking spotlights in favor of calm, crisp borders.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden transition-all duration-200 hover:border-line hover:shadow-card-hover ${
        className ?? ''
      }`}
    >
      {children}
    </div>
  );
}
