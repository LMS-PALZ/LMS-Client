# Skill Scale Up LMS Client

Monorepo for the **Skill Scale Up** learning management system front end. Three **Next.js 16** apps (student, tutor, admin) share internal packages for UI, API mocks, types, validation, and TanStack Query hooks. Each app uses the **App Router** (`src/app`); screen modules live under **`src/views`** to avoid colliding with the legacy Pages Router.

## Requirements

- **Node.js** >= 24.14.0 (see root `package.json` `engines`; use `.nvmrc` / `.node-version` for **24.14.0**)
- **Package manager:** **npm** workspaces (`package-lock.json` at the repo root).

## Link previews & browser tab (favicon)

Each app uses `public/firstlogo.png` for the **Chrome tab icon** and **Open Graph** previews (title, description, logo when you share a link).

Set the public origin in `.env.local` so share URLs resolve correctly:

| App     | `NEXT_PUBLIC_SITE_URL` (local) |
| ------- | ------------------------------ |
| Student | `http://localhost:5173`        |
| Tutor   | `http://localhost:5174`        |
| Admin   | `http://localhost:5175`        |

Use your deployed HTTPS URL in production (e.g. `https://student.skillscaleup.org`).

For the **student** app, copy env vars into `apps/student/.env.local` (Next.js reads env from the app folder, not the monorepo root).

## Student signup API

Signup uses [POST `/api/v1/students/auth/signup`](https://base-api.skillscaleup.org/api-docs/#/Student/post_api_v1_students_auth_signup) via the Next.js BFF at `/api/auth/signup`.

- Programs load from `GET /api/v1/programs/available` (dropdown shows API titles and fees).
- The `program` field must be a **program id** from that list (not a display label).
- Phone numbers must be Nigerian format like `08012345678` (`+234` is normalized on the server).

Set `NEXT_PUBLIC_API_URL=https://base-api.skillscaleup.org` in `apps/student/.env.local`.

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

- **`apps/student`**, **`apps/tutor`**, **`apps/admin`**: role-specific Next.js apps (App Router, shared layout + `RequireAuth`, Jest tests).
- **`packages/ui`**: shared design system and layouts.
- **`packages/api`**: client-side mock API and demo auth (`localStorage` session).
- **`packages/queries`**: React Query hooks over the API layer.
- **`packages/schema`**, **`packages/types`**, **`packages/utils`**, **`packages/config`**: Zod schemas, shared types, helpers, Tailwind/TS config.

For full product and UX requirements, see **`instruction.md`** in this repository.

## Build troubleshooting

### `Another next build process is already running` (student app)

This usually means **`npm run dev` is still running** for the student app, or a stale lock was left behind.

1. Stop the dev server (Ctrl+C in that terminal).
2. Remove the lock if needed:

```bash
rm -f apps/student/.next/dev/lock
npm run build
```

Do not run `npm run dev` and `npm run build` for the **same app** at the same time.

For QA deploy (student + admin only, sequential):

```bash
npm run build:qa
```

Fonts load in the browser at runtime (not during `next build`). Users need network access when viewing the app for Plus Jakarta Sans; system fonts are used until the stylesheet loads.
