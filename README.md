# RelayCheck Dashboard

Next.js + TypeScript + Tailwind CSS dashboard. Lets a developer start a
scenario, watch its status, and inspect delivery-attempt and assertion
evidence for a finished run.

Status: foundation implemented and verified (2026-10-21) — accessible app
shell, navigation, typed server-side API client, status components, and a
runs overview that renders **real** Control API data with explicit empty and
API-error states. No fabricated rows anywhere.

## Structure

```text
app/
  layout.tsx      # shell: skip link, header/nav, main, footer
  page.tsx        # Runs overview (server-rendered from the Control API)
  globals.css     # Tailwind entry + reduced-motion support
components/
  nav-link.tsx    # accessible nav item with aria-current
  status-badge.tsx# queued/running/passed/failed/error: label + icon + color
lib/
  api.ts          # typed server-side Control API client
```

## Design rules followed (`DESIGN.md`)

- Dark-neutral base with a single accent; monospace for IDs and durations.
- Status is label + icon + color — never color alone.
- Accessible: skip link, semantic landmarks, visible focus rings, table
  caption/headers, `role="alert"` for the API-error state.
- Responsive: header stacks on small screens; tables scroll horizontally
  with the verdict column never hidden.
- `prefers-reduced-motion` disables animations globally.
- Loading/empty/API-error states are real; no mock success paths.

## Configuration

`CONTROL_API_URL` (server-side only, default `http://localhost:3200`). See
`.env.example`. The browser never calls the Control API directly and never
touches PostgreSQL or RabbitMQ.

## Commands

- `npm install` / `npm ci` — install dependencies.
- `npm run dev` — development server on port 3000.
- `npm run lint` / `npm run type-check` — static checks.
- `npm run build` / `npm start` — production build and server on port 3000.

Package manager: **npm** (lockfiles are committed). Node >= 20.
