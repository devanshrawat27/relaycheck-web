import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, className, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-4 w-4 ${className ?? ''}`}
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </Icon>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14" />
      <path d="M6 13l6 6 6-6" />
    </Icon>
  );
}

export function Check(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 6L9 17l-5-5" />
    </Icon>
  );
}

export function Repeat2(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </Icon>
  );
}

export function Database(props: IconProps) {
  return (
    <Icon {...props}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </Icon>
  );
}

export function ShieldCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </Icon>
  );
}

export function FlaskConical(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 3h6" />
      <path d="M10 3v6L4.5 18.5A2 2 0 006 21h12a2 2 0 001.5-2.5L14 9V3" />
      <path d="M7.5 15h9" />
    </Icon>
  );
}

export function LockKeyhole(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
      <circle cx="12" cy="16" r="1.2" />
    </Icon>
  );
}

export function Send(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7" />
    </Icon>
  );
}

export function FileJson(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13c-1 0-1 .6-1 1.2S8 15.5 7 15.5s1 .5 1 1.1.1 1.2 1 1.2" />
      <path d="M15 13c1 0 1 .6 1 1.2s0 1.3 1 1.3-1 .5-1 1.1 0 1.2-1 1.2" />
    </Icon>
  );
}

export function FileText(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h6" />
    </Icon>
  );
}

export function CircleAlert(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </Icon>
  );
}

export function LayoutDashboard(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </Icon>
  );
}

export function PlayCircle(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8l6 4-6 4V8z" />
    </Icon>
  );
}
