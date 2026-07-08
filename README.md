# Skill Scale Up LMS Client

Monorepo for the **Skill Scale Up** learning management system front end. Two **Next.js 16** apps (student, admin) share internal packages for UI, API, types, validation, and TanStack Query hooks. Trainers/tutors sign in through **admin** with a restricted role. Each app uses the **App Router** (`src/app`); screen modules live under **`src/views`** to avoid colliding with the legacy Pages Router.

## Requirements

- **Node.js** >= 24.14.0 (see root `package.json` `engines`; use `.nvmrc` / `.node-version` for **24.14.0**)
- **Package manager:** **npm** workspaces (`package-lock.json` at the repo root).

## Link previews & browser tab (favicon)

Each app uses `public/firstlogo.png` for the **Chrome tab icon** and **Open Graph** previews (title, description, logo when you share a link).

Set the public origin in `.env.local` so share URLs resolve correctly:

| App     | `NEXT_PUBLIC_SITE_URL` (local) |
| ------- | ------------------------------ |
| Student | `http://localhost:5173`        |
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

## Run the apps (development)

Each app is a Next.js workspace with its own dev port. Run them from the **repo root**:

| App         | Command                                | URL                   |
| ----------- | -------------------------------------- | --------------------- |
| **Student** | `npm run dev` or `npm run dev:student` | http://localhost:5173 |
| **Admin**   | `npm run dev:admin`                    | http://localhost:5175 |

Use **one terminal per app** if you want both open at once.

### Demo sign-in (mock auth)

The demo API in `@ssu/api` accepts **any non-empty password** for known emails. Use the account that matches the app (each app checks role):

| Role            | Email                      | Use in app                    |
| --------------- | -------------------------- | ----------------------------- |
| Student         | `student@skillscaleup.dev` | Student                       |
| Tutor (trainer) | `trainer@skillscaleup.dev` | Admin (restricted tutor role) |
| Admin           | `admin@skillscaleup.dev`   | Admin                         |

There is also `pending@skillscaleup.dev` (tutor, pending approval) for testing pending trainer flows in the **admin** app.

## Turborepo

This monorepo uses [Turborepo](https://turbo.build) to run **build**, **lint**, **typecheck**, and **test** across `apps/*` and `packages/*` in parallel with caching.

| Script                  | What it does                                             |
| ----------------------- | -------------------------------------------------------- |
| `npm run build`         | `next build` for student and admin (parallel)            |
| `npm run build:student` | Build only `@ssu/student`                                |
| `npm run build:admin`   | Build only `@ssu/admin`                                  |
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

- **`apps/student`**, **`apps/admin`**: role-specific Next.js apps (App Router, shared layout + `RequireAuth`, Jest tests). Trainers use **admin** with a restricted sidebar.
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

Use **two Netlify sites** on the **same repo and branch** (`dev`). Each site uses a **different UI pattern** — this matches what worked on `dev-student` / `dev-admin`.

### Important

- **Student** and **admin** must **not** share the same Netlify UI base/package settings.
- If the student site uses repo root as base, Netlify reads root `netlify.toml` (admin build) and deploys the wrong app.
- The `.netlify/` folder is **build output** from the Next.js plugin — do not commit it (it is gitignored).

### Student site (e.g. ssustaging.netlify.app)

| Setting                 | Value                                                |
| ----------------------- | ---------------------------------------------------- |
| **Production branch**   | `dev`                                                |
| **Base directory**      | `apps/student`                                       |
| **Package directory**   | `apps/student` _(auto-filled — leave it)_            |
| **Build command**       | _(empty)_                                            |
| **Publish directory**   | `apps/student/` _(auto-filled — overridden by toml)_ |
| **Functions directory** | _(auto-filled — leave it)_                           |

Config file: `apps/student/netlify.toml` — sets `publish = "apps/student/.next"` to override the auto-filled source folder.

### Netlify auto-fills fields (cannot clear them)

When you set **Base directory** to `apps/student`, Netlify auto-fills Package, Publish, and Functions. **You do not need to clear them.** Settings in `netlify.toml` override the UI.

In the UI you may see: _"Overridden by netlify.toml. Published deploy built with `/`."_ — that is correct. The build runs from the repo root so `npm ci` works with workspaces.

After deploy, check the log **Resolved config** section:

- `publish: apps/student/.next`
- `publishOrigin: config` (not `ui`)
- `@netlify/plugin-nextjs` completes without errors

### Admin site (e.g. adminstg.netlify.app)

| Setting                 | Value                 |
| ----------------------- | --------------------- |
| **Production branch**   | `dev`                 |
| **Base directory**      | _(empty = repo root)_ |
| **Package directory**   | _(empty)_             |
| **Build command**       | _(empty)_             |
| **Publish directory**   | _(empty)_             |
| **Functions directory** | _(empty)_             |

Config file: `netlify.toml` (repo root)

### How deploys work

- A push to `dev` triggers both Netlify sites.
- Student builds `@ssu/student` via `apps/student/netlify.toml`.
- Admin builds `@ssu/admin` via root `netlify.toml`.

### Common deploy mistakes

1. **Publish auto-fills to `apps/student/`** — that deploys source code, not the build. `apps/student/netlify.toml` must set `publish = "apps/student/.next"`.
2. **Student base = repo root only** (no `apps/student` base) — Netlify reads root `netlify.toml` (admin build) instead of the student app.
3. **Runtime: Next.js preset in UI** — remove it; the plugin in `netlify.toml` is enough.

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
