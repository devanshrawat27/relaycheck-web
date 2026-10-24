'use client';

/**
 * Restrained subtle warm atmospheric glow behind the hero.
 * Pure CSS — no WebGL or heavy canvas dependencies, fast and quiet.
 */
export function VantaBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 w-[55%] select-none overflow-hidden opacity-60"
    >
      <div className="absolute -top-24 right-0 h-[480px] w-[580px] rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(201,79,22,0.06),rgba(243,238,229,0.4)_50%,transparent_75%)] blur-2xl" />
    </div>
  );
}
