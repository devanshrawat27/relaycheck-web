# RelayCheck Dashboard

Next.js + TypeScript + Tailwind CSS dashboard. Lets a developer start a
scenario, watch its status, and inspect delivery-attempt and assertion
evidence for a finished run.

Status: foundation implemented and verified (2026-10-21) — accessible app
shell, navigation, typed server-side API client, status components, and a
runs overview that renders **real** Control API data with explicit empty and
API-error states. No fabricated rows anywhere.

## Run detail

`/runs/[id]` shows the final verdict prominently plus verdict-specific
explanations: `failed` says execution completed but assertions failed;
`error` says execution could not complete reliably and shows the safe error.
It includes a measurement summary that keeps **delivery attempts** (sender)
and **business effects** (receiver, expected 1) separate, assertion results
with expected vs actual values, the delivery-attempts table
(number/eventId/HTTP status/outcome/duration/detail), created/started/
finished timestamps, a copyable run ID, and a bounded auto-refresh (2-second
interval, ~2 minutes max) that stops once the run is terminal. Unknown IDs
return a real HTTP 404 with a not-found page.

## Diagnostics

`/diagnostics` shows live service health (Control API, demo receiver) and the
aggregate metrics from `GET /api/metrics`: runs by status, work/dead-letter
queue depth, and outbox backlog with the age of the oldest pending job. It is
read-only and shows counts only — never payloads.

## Structure

```text
app/
  layout.tsx      # shell: skip link, header/nav, main, footer
  page.tsx        # Runs overview (server-rendered from the Control API)
  loading.tsx     # route-level loading skeleton
  runs/new/       # Run a scenario form
  globals.css     # Tailwind entry + reduced-motion support
components/
  nav-link.tsx         # accessible nav item with aria-current
  run-filters.tsx      # server-rendered status filter links
  run-scenario-form.tsx# progressive-enhancement form (server action)
  status-badge.tsx     # queued/running/passed/failed/error: label + icon + color
lib/
  api.ts          # typed server-side Control API client
  actions.ts      # server action: validate scenario -> POST /api/runs
```

## Run form

`/runs/new` exposes exactly one input — the scenario selector — with three
scenarios: `duplicate_delivery`, `receiver_failure`, and `receiver_timeout`.
It shows a "Planned behavior" preview for each and never renders a
destination URL field; unknown scenarios are rejected server-side (redirect
with an inline error). The form is a plain server action, so it works
without client JavaScript; verified end-to-end: submitting creates a real
`queued` run.

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
- `npm test` — Jest + React Testing Library component tests: status badges,
  API-error panel, evidence tables, status filters, run form (scenario
  options + no destination input), and the Control API client (runs, detail,
  metrics).
- `npm run build` / `npm start` — production build and server on port 3000.

Package manager: **npm** (lockfiles are committed). Node >= 20.
