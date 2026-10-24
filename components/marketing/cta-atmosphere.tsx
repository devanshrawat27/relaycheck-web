'use client';

import { motion, useReducedMotion } from 'framer-motion';

/** Slow liquid-light blooms add depth without competing with the CTA copy. */
export function CtaAtmosphere() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[68%] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_52%,rgba(196,76,25,0.14),transparent_63%),radial-gradient(ellipse_at_90%_22%,rgba(206,143,73,0.1),transparent_48%)]" />

      <motion.div
        className="absolute -right-[12%] top-[2%] h-[88%] w-[78%] rounded-[42%_58%_64%_36%/48%_40%_60%_52%] bg-[conic-gradient(from_40deg_at_50%_50%,rgba(201,79,22,0.38),rgba(236,151,91,0.12),rgba(77,112,91,0.26),rgba(201,79,22,0.38))] opacity-35 blur-3xl"
        animate={reduce ? { rotate: -12, scale: 1 } : { rotate: [-12, 8, -12], scale: [0.96, 1.06, 0.96], x: [0, -16, 0], y: [0, 10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute right-[5%] top-[22%] h-[60%] w-[57%] rounded-[58%_42%_36%_64%/42%_58%_42%_58%] bg-[radial-gradient(ellipse_at_35%_40%,rgba(233,106,48,0.48),rgba(190,91,50,0.13)_42%,transparent_72%)] opacity-55 blur-2xl"
        animate={reduce ? { scale: 1 } : { scale: [1, 1.16, 0.94, 1], x: [0, -24, 8, 0], y: [0, 12, -10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute right-[18%] top-[34%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(245,179,116,0.3),rgba(201,79,22,0.08)_48%,transparent_72%)] blur-xl"
        animate={reduce ? { opacity: 0.32 } : { opacity: [0.18, 0.48, 0.18], scale: [0.82, 1.18, 0.82] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-y-0 left-0 w-[36%] bg-gradient-to-r from-[#211F1C] via-[#211F1C]/70 to-transparent" />
    </div>
  );
}
