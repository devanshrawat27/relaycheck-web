# RelayCheck Dashboard

Next.js + TypeScript + Tailwind CSS dashboard. Lets a developer start a
scenario, watch its status, and inspect delivery-attempt and assertion
evidence for a finished run.

Ownership boundaries (see `ARCHITECTURE.md` and `DESIGN.md` at the workspace
root):

- Calls the Control API only; never accesses PostgreSQL or RabbitMQ directly.
- Contains no scenario execution or business logic.
- Never shows a destination URL input; scenario targets are fixed
  server-side.
- Never displays fabricated runs, metrics, or mock success in the real data
  path.

Status: workspace initialized (T001). Implementation starts at T040, after
the duplicate-event correctness path is proven. Tasks and acceptance criteria
live in `TASKS.md` at the workspace root.

## Commands

- `npm install` - install dependencies (verified from a clean checkout).

`npm run type-check`, `npm run build`, `npm run dev`, `npm run test`, and
`npm run lint` are added when their phase task lands (see `TASKS.md`). No
placeholder scripts are included, so nothing here fails silently.

Package manager: **npm** (lockfiles are committed). Node >= 20.