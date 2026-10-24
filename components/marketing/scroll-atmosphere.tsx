'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';

type Station = {
  x: number;
  y: number;
  label: string;
  at: number;
};

const STATIONS: Station[] = [
  { x: 1390, y: 760, label: 'E', at: 0.13 },
  { x: 1390, y: 2020, label: '1', at: 0.34 },
  { x: 1390, y: 2790, label: '2', at: 0.53 },
  { x: 1390, y: 3700, label: '3', at: 0.73 },
  { x: 1390, y: 4520, label: '✓', at: 0.91 },
];

function SignalStation({ station, progress }: { station: Station; progress: MotionValue<number> }) {
  const pulse = useTransform(progress, [station.at - 0.1, station.at, station.at + 0.1], [0.3, 1, 0.3]);
  const rotate = useTransform(progress, [0, 1], [-35, 145]);

  return (
    <motion.g transform={`translate(${station.x} ${station.y})`} style={{ opacity: pulse }}>
      <circle r="25" fill="#C94F16" fillOpacity=".07" />
      <motion.ellipse cx="0" cy="0" rx="21" ry="9" fill="none" stroke="#C94F16" strokeOpacity=".5" strokeWidth="1.4" style={{ rotate }} />
      <circle r="11" fill="#FAF7F1" stroke="#C94F16" strokeOpacity=".82" strokeWidth="2" />
      <circle r="4.5" fill="#C94F16" fillOpacity=".95" />
      <text x="0" y="3" textAnchor="middle" fill="#A83D10" fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="8" fontWeight="700">
        {station.label}
      </text>
    </motion.g>
  );
}

/**
 * A page-length delivery trace: repeated attempts travel through the same
 * event path, then converge on one receiver-side effect as the visitor scrolls.
 */
export function MarketingScrollAtmosphere() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.04, 1]);

  if (reduceMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
    >
      <svg
        className="absolute inset-0 hidden h-full w-full overflow-visible sm:block"
        viewBox="0 0 1440 6000"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="signal-route" x1="0" y1="0" x2="1440" y2="6000" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C94F16" stopOpacity=".12" />
            <stop offset=".16" stopColor="#C94F16" stopOpacity=".62" />
            <stop offset=".52" stopColor="#D66B35" stopOpacity=".42" />
            <stop offset=".82" stopColor="#C94F16" stopOpacity=".58" />
            <stop offset="1" stopColor="#C94F16" stopOpacity=".14" />
          </linearGradient>
          <filter id="signal-glow" x="-20%" y="-10%" width="140%" height="120%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        <path
          d="M1390 0 C1390 330 1352 410 1352 760 C1352 930 1408 920 1408 1080 C1408 1530 1352 1570 1352 2020 C1352 2230 1408 2280 1408 2460 C1408 2630 1370 2640 1370 2790 C1370 3070 1410 3120 1410 3330 C1410 3540 1360 3550 1360 3700 C1360 4010 1400 4070 1400 4300 C1400 4410 1358 4420 1358 4520 C1358 4900 1390 5220 1390 6000"
          stroke="url(#signal-route)"
          strokeWidth="12"
          strokeLinecap="round"
          filter="url(#signal-glow)"
          opacity=".18"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          d="M1390 0 C1390 330 1352 410 1352 760 C1352 930 1408 920 1408 1080 C1408 1530 1352 1570 1352 2020 C1352 2230 1408 2280 1408 2460 C1408 2630 1370 2640 1370 2790 C1370 3070 1410 3120 1410 3330 C1410 3540 1360 3550 1360 3700 C1360 4010 1400 4070 1400 4300 C1400 4410 1358 4420 1358 4520 C1358 4900 1390 5220 1390 6000"
          pathLength={pathLength}
          stroke="url(#signal-route)"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity=".68"
          vectorEffect="non-scaling-stroke"
        />
        {STATIONS.map((station) => (
          <SignalStation key={station.label} station={station} progress={scrollYProgress} />
        ))}
      </svg>

    </div>
  );
}
