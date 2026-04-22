# Skill Scale Up — LMS Client

Monorepo for the **Skill Scale Up** learning management system front end. Three **Next.js 16** apps (student, tutor, admin) share internal packages for UI, API mocks, types, validation, and TanStack Query hooks. Each app uses the **App Router** (`src/app`); screen modules live under **`src/views`** to avoid colliding with the legacy Pages Router.

## Requirements

- **Node.js** >= 24.14.0 (see root `package.json` `engines`; use `.nvmrc` / `.node-version` for **24.14.0**)
- **Package manager:** this repo is usually installed with **npm** (workspaces). The `packageManager` field pins **pnpm** for Corepack if you prefer pnpm.

## Install

From the repository root:

```bash
npm install
```

Dependencies are managed with **npm workspaces** (`apps/*`, `packages/*`).

## Run the three apps (development)

Each app is a Next.js workspace with its own dev port. Run them from the **repo root**:

| App         | Command                                | URL                   |
| ----------- | -------------------------------------- | --------------------- |
| **Student** | `npm run dev` or `npm run dev:student` | http://localhost:5173 |
| **Tutor**   | `npm run dev:tutor`                    | http://localhost:5174 |
| **Admin**   | `npm run dev:admin`                    | http://localhost:5175 |

Use **one terminal per app** if you want several open at once.

### Demo sign-in (mock auth)

The demo API in `@ssu/api` accepts **any non-empty password** for known emails. Use the account that matches the app (each app checks role):

| Role            | Email                      | Use in app |
| --------------- | -------------------------- | ---------- |
| Student         | `student@skillscaleup.dev` | Student    |
| Tutor (trainer) | `trainer@skillscaleup.dev` | Tutor      |
| Admin           | `admin@skillscaleup.dev`   | Admin      |

There is also `pending@skillscaleup.dev` (tutor, pending approval) for testing the tutor pending flow in the **Tutor** app.

## Other useful scripts (root)

| Script              | Description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| `npm run build`     | `next build` (or equivalent) for all workspaces that define `build` |
| `npm run lint`      | Oxlint across the repo                                              |
| `npm run typecheck` | `tsc --noEmit` for packages and apps (ordered)                      |
| `npm run test`      | Jest in workspaces that define `test`                               |
| `npm run verify`    | Lint + typecheck + tests                                            |
| `npm run storybook` | Storybook for the shared `@ssu/ui` package                          |

## Repository layout

- **`apps/student`**, **`apps/tutor`**, **`apps/admin`** — role-specific Next.js apps (App Router, shared layout + `RequireAuth`, Jest tests).
- **`packages/ui`** — shared design system and layouts.
- **`packages/api`** — client-side mock API and demo auth (`localStorage` session).
- **`packages/queries`** — React Query hooks over the API layer.
- **`packages/schema`**, **`packages/types`**, **`packages/utils`**, **`packages/config`** — Zod schemas, shared types, helpers, Tailwind/TS config.

For full product and UX requirements, see **`instruction.md`** in this repository.
