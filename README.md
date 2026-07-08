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

## Turborepo

This monorepo uses [Turborepo](https://turbo.build) to run **build**, **lint**, **typecheck**, and **test** across `apps/*` and `packages/*` in parallel with caching.

| Script                  | What it does                                             |
| ----------------------- | -------------------------------------------------------- |
| `npm run build`         | `next build` for student, admin, and tutor (parallel)    |
| `npm run build:student` | Build only `@ssu/student`                                |
| `npm run build:admin`   | Build only `@ssu/admin`                                  |
| `npm run build:tutor`   | Build only `@ssu/tutor`                                  |
| `npm run build:qa`      | Admin + student (staging QA)                             |
| `npm run lint`          | Per-package lint via Turbo + root oxlint                 |
| `npm run typecheck`     | `tsc --noEmit` in all workspaces that define `typecheck` |
| `npm run test`          | Tests in workspaces that define `test`                   |
| `npm run verify`        | Lint + typecheck + test                                  |

Config lives in `turbo.json`. Cache output is under `.turbo` (gitignored).

Dev servers are still one app at a time: `npm run dev`, `npm run dev:admin`, etc. (Turbo `dev` is persistent and not used from the root script.)

## Other useful scripts (root)

| Script              | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run storybook` | Storybook for the shared `@ssu/ui` package |

## Repository layout

- **`apps/student`**, **`apps/tutor`**, **`apps/admin`**: role-specific Next.js apps (App Router, shared layout + `RequireAuth`, Jest tests).
- **`packages/ui`**: shared design system and layouts.
- **`packages/api`**: client-side mock API and demo auth (`localStorage` session).
- **`packages/queries`**: React Query hooks over the API layer.
- **`packages/schema`**, **`packages/types`**, **`packages/utils`**, **`packages/config`**: Zod schemas, shared types, helpers, Tailwind/TS config.

For full product and UX requirements, see **`instruction.md`** in this repository.

## Config layout (monorepo)

| Location                 | What lives there                                                           |
| ------------------------ | -------------------------------------------------------------------------- |
| `packages/config`        | Shared Tailwind, `site-metadata`, `env.ts` (`getSiteUrl`), route constants |
| `apps/student`           | `netlify.toml`, `.env.example`, `src/config/routes.ts`                     |
| `apps/admin`             | `netlify.toml`, `.env.example`, `src/config/routes.ts`                     |
| `apps/tutor`             | `netlify.toml`, `.env.example`, `src/config/routes.ts`                     |
| Repo root `.env.example` | Pointer only — Next reads env from each app folder                         |

Copy `apps/<portal>/.env.example` to `apps/<portal>/.env.local` for local dev.

### Environment variables (per app)

| Variable                     | Purpose                              |
| ---------------------------- | ------------------------------------ |
| `NEXT_PUBLIC_STAGING_URL`    | Staging host for that portal         |
| `NEXT_PUBLIC_PRODUCTION_URL` | Production host on skillscaleup.org  |
| `NEXT_PUBLIC_APP_ENV`        | `local` \| `staging` \| `production` |
| `NEXT_PUBLIC_SITE_URL`       | Local dev override (port per app)    |

Use `@/config/routes` inside an app, or `@ssu/config/routes` from packages. Next.js `src/app/**` remains the real router; route constants are for links and redirects only.

## Netlify (student + admin on separate sites)

Use **two Netlify sites** on the **same repo and branch** (`dev` for staging). Student and admin use **different Netlify UI settings** — they are not interchangeable.

### Why student and admin differ

If the **student** site uses repo root as base with **Package directory = `apps/student`**, Netlify also reads the root `netlify.toml` (admin build). The student URL then deploys the **admin app** (admin login, wrong site).

The student site must use **Base directory = `apps/student`** and leave **Package directory empty**.

### Student site (e.g. ssu-students.netlify.app)

| Setting                 | Value             |
| ----------------------- | ----------------- |
| **Production branch**   | `dev`             |
| **Base directory**      | `apps/student`    |
| **Package directory**   | _(MUST be empty)_ |
| **Build command**       | _(empty)_         |
| **Publish directory**   | _(empty)_         |
| **Functions directory** | _(empty)_         |

Config file: `apps/student/netlify.toml`

Env: `NEXT_PUBLIC_API_URL=https://base-api.skillscaleup.org`

### Admin site (e.g. adminstg.netlify.app)

| Setting                 | Value                 |
| ----------------------- | --------------------- |
| **Production branch**   | `dev`                 |
| **Base directory**      | _(empty = repo root)_ |
| **Package directory**   | _(MUST be empty)_     |
| **Build command**       | _(empty)_             |
| **Publish directory**   | _(empty)_             |
| **Functions directory** | _(empty)_             |

Config file: repo root `netlify.toml`

Env: `NEXT_PUBLIC_API_URL=https://base-api.skillscaleup.org`

### How deploys work

- A push to `dev` triggers **both** Netlify sites.
- Each site runs its own build and updates **only its URL**.
- Shared package changes rebuild both; app-only changes can skip the other site via `ignore` in each config.

### Netlify UI migration (from `dev-student` / `dev-admin`)

1. **Student site:** set Production branch to `dev`, **Base directory = `apps/student`**, clear **Package directory**.
2. **Admin site:** set Production branch to `dev`, **Base directory empty**, clear **Package directory**.
3. Clear any **Build command** or **Publish directory** overrides in the Netlify UI on both sites.
4. Redeploy both sites from `dev`.
5. Confirm the student URL shows the student login (not admin).
6. After both sites succeed, delete old `dev-student` and `dev-admin` branches.

### Common deploy mistakes

1. **Student Package directory = `apps/student`** — causes admin app to deploy on the student site.
2. **Student Base = repo root** — Netlify reads root `netlify.toml` (admin) for the student site.
3. **Admin Package directory = `apps/admin`** — admin should use repo root config only.
4. **Publish = `apps/admin/.next` in the UI** — leave empty; the Next.js plugin handles output.
5. **Build command in the UI** — leave empty so the correct `netlify.toml` is used.

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
