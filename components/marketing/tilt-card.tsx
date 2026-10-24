'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

/**
 * Premium 3D tilt card with a pointer-following spotlight. Falls back to a
 * plain static card for reduced-motion users.
 */
export function TiltCard({
  children,
  className,
  tiltStrength = 8,
  revealItem = false,
}: {
  children: ReactNode;
  className?: string;
  tiltStrength?: number;
  revealItem?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [tiltStrength, -tiltStrength]), {
    stiffness: 260,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-tiltStrength, tiltStrength]), {
    stiffness: 260,
    damping: 22,
  });

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    px.set(x / rect.width);
    py.set(y / rect.height);
    node.style.setProperty('--spot-x', `${x}px`);
    node.style.setProperty('--spot-y', `${y}px`);
  }

  function onPointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  if (reduce) {
    return <div data-reveal-item={revealItem || undefined} className={className}>{children}</div>;
  }

  return (
    <div data-reveal-item={revealItem || undefined} className="h-full [perspective:1000px]">
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={className}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(201,79,22,0.10), transparent 62%)',
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}
