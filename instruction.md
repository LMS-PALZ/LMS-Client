# Skill Scale Up LMS — Frontend Cursor Instructions

## Complete Frontend Build Guide for `apps/web`

> **This file is the only instruction source for building the Skill Scale Up frontend.**
> Read every section before generating any file. Do not invent folder names, colour values, or component patterns not defined here. When in doubt, refer back to this document.

---

## 1. What You Are Building

You are building the **Skill Scale Up (SSU) LMS** frontend — a production-grade, multi-role Learning Management System web application. It lives at `apps/web` inside the monorepo.

Three roles share one Next.js application, each with their own layout, sidebar, and routes:

- **Student** — browses courses, attends live classes, submits assignments, tracks progress
- **Trainer** — creates courses, schedules sessions, reviews and grades submissions
- **Admin** — manages users, approves trainers, manages programs, views analytics

The application must feel like a professional SaaS product. Every screen, state, and interaction should be deliberate and polished. This is not a prototype.

---

## 2. Technology Stack

Use exactly these tools. No substitutions.

```
Framework        Next.js 16 (App Router)
Language         TypeScript 5 — strict mode enabled, no "any" allowed
Styling          Tailwind CSS v3
UI Primitives    shadcn/ui
Icons            Lucide React
State (global)   Zustand
State (server)   TanStack Query v5
Forms            React Hook Form + Zod
Animation        Framer Motion
File Upload      React Dropzone
Calendar         FullCalendar (React)
Font             Plus Jakarta Sans (via next/font/google)
Linting          ESLint (eslint-config-next 16.x, with Next.js 16)
Formatting       Prettier
Git Hooks        Husky + lint-staged
Component Docs   Storybook 8
Testing          Vitest + React Testing Library
```

---

## 3. Brand Identity

This is the visual identity that governs every design decision in this application. Do not deviate from it.

### 3.1 Colour Palette

These are the exact hex values from the brand guide. Every colour used in the application must come from this palette or from its tints and shades defined below.

```
Primary Green (Dark)    #0C693A    — main brand, sidebar, primary buttons, headings
Secondary Green (Light) #39B44B    — hover states, active indicators, success states
Amber Orange            #F49221    — accent, CTAs, warnings, highlights, deadlines
Black                   #000000    — backgrounds (dark mode), strong contrast
White                   #FFFFFF    — backgrounds (light mode), text on dark
```

Derived tints for use in backgrounds, borders, and subtle states:

```
Green 50   (lightest tint)  #F0F9F4
Green 100                   #D1EFE0
Green 200                   #A3DEC1
Green 700                   #0C693A   (same as Primary Green)
Green 900                   #084D2B

Amber 50   (lightest tint)  #FEF6EC
Amber 100                   #FDEBD0
Amber 500                   #F49221   (same as Amber Orange)
Amber 700                   #C47218

Neutral 50                  #F8FAFC
Neutral 100                 #F1F5F9
Neutral 200                 #E2E8F0
Neutral 400                 #94A3B8
Neutral 600                 #475569
Neutral 800                 #1E293B
Neutral 900                 #0F172A
```

### 3.2 Typography

The brand font is **Plus Jakarta Sans**. This is the only font family used throughout the application.

```
Display / Hero    48px   700 weight   line-height: 1.15   — landing page, empty states
H1 Page Title     32px   700 weight   line-height: 1.2    — dashboard page titles
H2 Section        24px   600 weight   line-height: 1.3    — section headings
H3 Card Title     18px   600 weight   line-height: 1.4    — card and widget titles
H4 Sub-section    15px   600 weight   line-height: 1.5    — sub-labels, sidebar items
Body              15px   400 weight   line-height: 1.6    — all body text
Small             13px   400 weight   line-height: 1.5    — metadata, timestamps, labels
Micro             11px   500 weight   line-height: 1.4    — badge text, tags
```

Load the font in `app/layout.tsx`:

```typescript
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
```

Apply as `<html className={plusJakartaSans.variable}>`.

### 3.3 Logo Usage Rules

From the brand guide — these rules apply when rendering the logo in the app:

- Always use the full logo (icon + wordmark) in the sidebar header and login screen
- Use the icon-only version in the collapsed sidebar state
- Never stretch, rotate, or apply a gradient to the logo
- Never alter the logo colours — use only the provided SVG assets
- On dark backgrounds (sidebar): use the white/light version of the logo
- On light backgrounds: use the full-colour version
- Minimum clear space around the logo equals the height of the "C" monogram

### 3.4 Visual Language

The brand uses geometric shapes — specifically triangles and hexagons — as a visual motif. Apply this in the UI through:

- Subtle geometric background patterns on auth screens and hero sections
- The hexagon as a visual container motif for avatar badges and icon highlights
- Triangular accent dividers on section transitions
- Angular clip paths on dashboard hero banners (optional, enhance progressively)

---

## 4. Design System — `packages/ui`

Before building any page, all base components must exist in `packages/ui`. Build this package first.

### 4.1 Tailwind Configuration

Create `packages/config/tailwind/tailwind.config.ts` and extend it in `apps/web/tailwind.config.ts`:

```typescript
// packages/config/tailwind/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#0C693A",
          "green-light": "#39B44B",
          amber: "#F49221",
          "green-50": "#F0F9F4",
          "green-100": "#D1EFE0",
          "green-200": "#A3DEC1",
          "green-900": "#084D2B",
          "amber-50": "#FEF6EC",
          "amber-100": "#FDEBD0",
          "amber-700": "#C47218",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["3rem", { lineHeight: "1.15", fontWeight: "700" }],
        h1: ["2rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        h4: ["0.9375rem", { lineHeight: "1.5", fontWeight: "600" }],
        body: ["0.9375rem", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["0.8125rem", { lineHeight: "1.5", fontWeight: "400" }],
        micro: ["0.6875rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)",
        "card-hover":
          "0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)",
        modal: "0 20px 60px -10px rgba(0,0,0,0.20)",
      },
      spacing: {
        sidebar: "240px",
        "sidebar-collapsed": "64px",
        header: "64px",
      },
    },
  },
};

export default config;
```

### 4.2 CSS Variables

Add these to `apps/web/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-brand-green: #0c693a;
    --color-brand-green-light: #39b44b;
    --color-brand-amber: #f49221;
    --color-surface: #ffffff;
    --color-surface-raised: #f8fafc;
    --color-surface-overlay: #f1f5f9;
    --color-border: #e2e8f0;
    --color-border-strong: #cbd5e1;
    --color-text-primary: #0f172a;
    --color-text-secondary: #475569;
    --color-text-muted: #94a3b8;
    --color-text-on-dark: #ffffff;
    --radius-card: 12px;
    --radius-button: 8px;
    --radius-input: 8px;
    --sidebar-width: 240px;
    --sidebar-width-collapsed: 64px;
    --header-height: 64px;
  }

  * {
    border-color: var(--color-border);
  }

  body {
    color: var(--color-text-primary);
    background: var(--color-surface-raised);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Focus ring — accessibility */
  :focus-visible {
    outline: 2px solid var(--color-brand-green);
    outline-offset: 2px;
  }
}
```

### 4.3 Component Folder Structure

Every component folder contains: the component file, a Storybook story, a test file, and an index barrel export.

```
packages/ui/src/
│
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── Input/
│   ├── Textarea/
│   ├── Label/
│   ├── Badge/
│   ├── Avatar/
│   ├── Spinner/
│   ├── Skeleton/
│   ├── Divider/
│   ├── ProgressBar/
│   └── Checkbox/
│
├── molecules/
│   ├── FormField/           # Label + Input + error message
│   ├── SearchInput/         # Input + search icon + clear button
│   ├── StatCard/            # Icon + label + value — dashboard summary cards
│   ├── NotificationItem/    # Icon + message + timestamp + read indicator
│   ├── EmptyState/          # Illustration + heading + body + optional CTA
│   ├── AlertBanner/         # Info / warning / error / success
│   ├── FileDropzone/        # Drag and drop upload area
│   ├── CourseCard/          # Course display card with progress bar
│   ├── AssignmentCard/      # Assignment card with status badge and deadline
│   └── UserRow/             # User avatar + name + role + status + actions
│
├── organisms/
│   ├── DataTable/           # Sortable, filterable, paginated table
│   ├── Modal/               # Accessible modal — header, body, footer
│   ├── NavigationSidebar/   # Role-aware, collapsible sidebar
│   ├── TopHeader/           # Header bar — notification bell + user menu
│   ├── PageHeader/          # Page title + breadcrumb + optional action button
│   ├── StepWizard/          # Multi-step form container with progress indicator
│   └── NotificationDropdown/
│
├── layouts/
│   ├── DashboardLayout/     # Sidebar + header + scrollable main
│   ├── AuthLayout/          # Centred card on a branded background
│   └── FullPageLayout/      # No sidebar — used for classroom page
│
├── tokens/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
│
└── index.ts                 # Exports everything
```

### 4.4 Button Component

This is the primary interactive element. Implement it exactly.

```typescript
// packages/ui/src/atoms/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@ssu/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-semibold transition-all duration-200 focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        primary:   'bg-brand-green text-white hover:bg-brand-green-900 shadow-sm',
        secondary: 'bg-white text-brand-green border border-brand-green hover:bg-brand-green-50',
        amber:     'bg-brand-amber text-white hover:bg-brand-amber-700 shadow-sm',
        ghost:     'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
        danger:    'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        link:      'text-brand-green underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm:   'h-8  px-3   text-small  rounded-[var(--radius-button)]',
        md:   'h-10 px-4   text-body   rounded-[var(--radius-button)]',
        lg:   'h-12 px-6   text-body   rounded-[var(--radius-button)]',
        icon: 'h-10 w-10              rounded-[var(--radius-button)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  className,
  variant,
  size,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
}
```

### 4.5 Badge Component

Used for assignment status, user status, and role indicators.

```typescript
// packages/ui/src/atoms/Badge/Badge.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@ssu/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium text-micro uppercase tracking-wide px-2.5 py-0.5',
  {
    variants: {
      variant: {
        default:    'bg-neutral-100 text-neutral-700',
        // Assignment statuses
        'not-started': 'bg-neutral-100 text-neutral-600',
        submitted:  'bg-blue-100 text-blue-700',
        graded:     'bg-brand-green-100 text-brand-green',
        returned:   'bg-amber-100 text-amber-700',
        overdue:    'bg-red-100 text-red-700',
        // User statuses
        active:     'bg-brand-green-100 text-brand-green',
        pending:    'bg-amber-100 text-amber-700',
        suspended:  'bg-red-100 text-red-700',
        // Role
        student:    'bg-blue-100 text-blue-700',
        trainer:    'bg-purple-100 text-purple-700',
        admin:      'bg-neutral-800 text-white',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
```

### 4.6 ProgressBar Component

Used on course cards and the student dashboard.

```typescript
// packages/ui/src/atoms/ProgressBar/ProgressBar.tsx
import { cn } from '@ssu/utils'

export interface ProgressBarProps {
  value: number          // 0–100
  size?: 'sm' | 'md'
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ value, size = 'md', showLabel = false, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5'
  const color = clamped === 100
    ? 'bg-brand-green'
    : clamped >= 50
    ? 'bg-brand-green-light'
    : 'bg-brand-amber'

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-small text-neutral-500">Progress</span>
          <span className="text-small font-semibold text-neutral-700">{clamped}%</span>
        </div>
      )}
      <div className={cn('w-full bg-neutral-100 rounded-full overflow-hidden', height)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
```

### 4.7 StatCard Component

Used on all three dashboards for summary metrics.

```typescript
// packages/ui/src/molecules/StatCard/StatCard.tsx
import { cn } from '@ssu/utils'
import type { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: { value: number; label: string }
  accent?: 'green' | 'amber' | 'neutral'
  className?: string
}

export function StatCard({ label, value, icon: Icon, trend, accent = 'green', className }: StatCardProps) {
  const accentMap = {
    green:   { bg: 'bg-brand-green-50',  icon: 'text-brand-green',  border: 'border-brand-green-200' },
    amber:   { bg: 'bg-brand-amber-50',  icon: 'text-brand-amber',  border: 'border-amber-200' },
    neutral: { bg: 'bg-neutral-50',      icon: 'text-neutral-500',  border: 'border-neutral-200' },
  }
  const a = accentMap[accent]

  return (
    <div className={cn('bg-white rounded-xl border p-5 shadow-card hover:shadow-card-hover transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-small text-neutral-500 mb-1">{label}</p>
          <p className="text-h2 font-bold text-neutral-900">{value}</p>
          {trend && (
            <p className={cn('text-small mt-1', trend.value >= 0 ? 'text-brand-green' : 'text-red-500')}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-xl border', a.bg, a.border)}>
          <Icon className={cn('h-5 w-5', a.icon)} />
        </div>
      </div>
    </div>
  )
}
```

### 4.8 EmptyState Component

Every list, table, and widget must handle the empty state gracefully.

```typescript
// packages/ui/src/molecules/EmptyState/EmptyState.tsx
import { cn } from '@ssu/utils'
import type { LucideIcon } from 'lucide-react'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="p-4 rounded-2xl bg-neutral-100 mb-4">
        <Icon className="h-8 w-8 text-neutral-400" />
      </div>
      <h3 className="text-h4 font-semibold text-neutral-700 mb-1">{title}</h3>
      {description && <p className="text-small text-neutral-500 max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  )
}
```

---

## 5. Application Folder Structure (`apps/web`)

This is the exact structure to create. Every folder and file named here must exist.

```
apps/web/
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── register/trainer/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   │
│   ├── dashboard/
│   │   ├── student/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── classroom/
│   │   │   │   └── [sessionId]/page.tsx
│   │   │   ├── assignments/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── schedule/
│   │   │       └── page.tsx
│   │   │
│   │   ├── trainer/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/page.tsx
│   │   │   ├── sessions/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── assignments/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/submissions/page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   │
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── users/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── trainers/
│   │       │   └── approvals/page.tsx
│   │       ├── programs/
│   │       │   ├── page.tsx
│   │       │   └── new/page.tsx
│   │       └── announcements/
│   │           └── page.tsx
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   └── globals.css
│
├── components/
│   ├── shared/
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarItem.tsx
│   │   │   ├── SidebarSection.tsx
│   │   │   └── index.ts
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   └── index.ts
│   │   └── RoleGuard/
│   │       └── RoleGuard.tsx
│   │
│   ├── student/
│   │   ├── CourseCard/
│   │   │   ├── CourseCard.tsx
│   │   │   └── index.ts
│   │   ├── UpcomingClassWidget/
│   │   ├── AssignmentDueList/
│   │   ├── ProgressPanel/
│   │   ├── ModuleSidebar/
│   │   └── SubmissionForm/
│   │
│   ├── trainer/
│   │   ├── CourseWizard/
│   │   │   ├── CourseWizard.tsx
│   │   │   ├── steps/
│   │   │   │   ├── StepDetails.tsx
│   │   │   │   ├── StepModules.tsx
│   │   │   │   ├── StepResources.tsx
│   │   │   │   └── StepReview.tsx
│   │   │   └── index.ts
│   │   ├── ModuleBuilder/
│   │   ├── SubmissionInbox/
│   │   ├── GradeForm/
│   │   └── SessionScheduler/
│   │
│   └── admin/
│       ├── UserTable/
│       ├── ApprovalQueue/
│       ├── AnalyticsCard/
│       └── AnnouncementForm/
│
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── courses.ts
│   │   ├── sessions.ts
│   │   ├── assignments.ts
│   │   ├── submissions.ts
│   │   ├── notifications.ts
│   │   ├── uploads.ts
│   │   └── admin.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useNotifications.ts
│   │   ├── useCourses.ts
│   │   ├── useAssignments.ts
│   │   └── useUpload.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   └── notificationStore.ts
│   └── utils/
│       └── index.ts
│
├── middleware.ts
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── .eslintrc.json
├── .prettierrc
└── vitest.config.ts
```

---

## 6. Layout System

### 6.1 Root Layout

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Skill Scale Up',
  description: 'Build the skill, scale the career.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body>{children}</body>
    </html>
  )
}
```

Create `app/providers.tsx` to wrap TanStack Query provider and any other global providers.

### 6.2 Auth Layout

Used for login, register, and password reset screens. Features the brand geometric visual on the left panel.

```typescript
// packages/ui/src/layouts/AuthLayout/AuthLayout.tsx
import { cn } from '@ssu/utils'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel — geometric triangles and brand green background */}
      <div className="hidden lg:flex bg-brand-green relative overflow-hidden flex-col justify-between p-12">
        {/* Geometric triangle shapes — brand identity from guide */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-0 h-0 border-l-[300px] border-l-transparent border-b-[300px] border-b-white" />
          <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[400px] border-r-transparent border-t-[400px] border-t-brand-green-900" />
          <div className="absolute top-1/2 right-12 w-0 h-0 border-l-[200px] border-l-transparent border-b-[200px] border-b-brand-amber opacity-60" />
        </div>
        <div className="relative z-10">
          {/* Logo placeholder — replace with SVG import */}
          <div className="text-white font-bold text-h2">Skill Scale Up</div>
        </div>
        <div className="relative z-10">
          <blockquote className="text-white/90 text-h3 font-medium leading-relaxed">
            "Build the skill,<br />scale the career."
          </blockquote>
        </div>
      </div>
      {/* Form panel */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </div>
    </div>
  )
}
```

### 6.3 Dashboard Layout

Used by all three role dashboards. Sidebar is on the left, header is on the top, main content scrolls independently.

```typescript
// packages/ui/src/layouts/DashboardLayout/DashboardLayout.tsx
'use client'
import { useState } from 'react'
import { cn } from '@ssu/utils'

export interface DashboardLayoutProps {
  sidebar: React.ReactNode
  header: React.ReactNode
  children: React.ReactNode
}

export function DashboardLayout({ sidebar, header, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex-shrink-0 h-full bg-brand-green flex flex-col transition-all duration-300',
          collapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width)]'
        )}
      >
        {sidebar}
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-[var(--header-height)] bg-white border-b flex-shrink-0 flex items-center px-6 gap-4">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <span className="sr-only">Toggle sidebar</span>
            {/* hamburger icon */}
          </button>
          {header}
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
```

### 6.4 Sidebar

The sidebar uses the brand's Primary Green (#0C693A) background with white text and icons. The active state uses a white left border accent and a slightly lighter green background.

```typescript
// components/shared/Sidebar/Sidebar.tsx
// Sidebar design rules:
// — Background: bg-brand-green (#0C693A)
// — Logo area: 64px height, border-bottom border-white/10
// — Nav items: text-white/80 on inactive, text-white on active
// — Active item: border-l-2 border-white bg-white/10
// — Hover: bg-white/10
// — Icons: 18px, lucide-react
// — Labels: hidden when collapsed, visible when expanded (transition opacity)
// — Section dividers: text-white/40 text-micro uppercase tracking-widest
// — Bottom: user profile mini-card, text-white
```

---

## 7. Screen-by-Screen Specifications

### 7.1 Login Screen

```
Layout:       AuthLayout (two-column)
Left panel:   Brand green, geometric shapes, logo, tagline
Right panel:  White, centred card max-w-420px

Form fields:
  — Email address (type="email", autoComplete="email")
  — Password (type="password", show/hide toggle with Eye/EyeOff icon)

Primary CTA:   Button variant="primary" size="lg" fullWidth — "Sign In"
Secondary:     Link to /forgot-password — "Forgot password?"
Footer:        "Don't have an account?" + Link to /register

Error states:
  — Invalid credentials: AlertBanner variant="error" below the form
  — Account suspended: AlertBanner with support contact link
  — Pending approval (trainer): AlertBanner variant="warning"

Loading state: Button shows loading spinner, all inputs disabled
```

### 7.2 Student Dashboard Home

```
Layout:        DashboardLayout, StudentSidebar
Page title:    "Good morning, [First Name] 👋"  (greeting based on time of day)
Grid:          Two-column on desktop (8/4 split), stacked on mobile

Left column (wider):
  — Enrolled Courses grid (2-col card grid)
    Each card: course banner, title, trainer name, ProgressBar, "Continue" button
  — Upcoming Live Classes (list of 3 max)
    Each item: coloured left accent, class title, course name, date+time, "Join" button
    "Join" button: disabled until 10 min before start, amber colour when active

Right column (narrower):
  — Assignment Due Reminders
    Sorted by deadline (soonest first)
    Items due today: amber accent
    Items overdue: red text + "OVERDUE" badge
  — Progress Overview
    4 StatCards in a 2x2 grid:
      Courses enrolled, Completion %, Attendance %, Avg grade

All widgets handle: loading (Skeleton), empty state (EmptyState component), error state (AlertBanner)
```

### 7.3 Classroom Page

```
Layout:        FullPageLayout (no sidebar — full focus mode)
Header:        Slim top bar — back button, course name, breadcrumb only

Left (65% width):
  — Video area: aspect-ratio 16/9, dark background
    If session not live: countdown timer centred, "Session starts in X:XX:XX"
    If session live: Zoom embed (iframe), amber "LIVE" badge top-right
    Below video: tabs — "Description", "Resources", "Assignment"

Right (35% width):
  — Course title + trainer avatar + name
  — Module list (scrollable)
    Each module: type icon, title, completion checkmark or lock icon
    Active module: green left border accent
    Locked modules: opacity-50, lock icon
```

### 7.4 Assignments Page (Student)

```
Layout:        DashboardLayout
Page title:    "Assignments"
Filter bar:    Tabs or chips — All / Not Started / Submitted / Graded / Overdue

Assignment list (grouped by course):
  Course group header: course name, count badge
  Each assignment row:
    — Title
    — Course name
    — Due date (red if overdue)
    — Status badge (Badge component)
    — Primary action button:
        Not Started → "Start" (green)
        Submitted   → "View Submission" (secondary)
        Graded      → "View Grade" (secondary)
        Overdue     → "Submit Late" (amber, if allowed)

Assignment detail / submission page:
  — Assignment title + description (rich text display)
  — Due date + time remaining
  — Submission form (React Hook Form):
      Tab selector: File / Link / Text (only show allowed types)
      File tab: FileDropzone (react-dropzone, max 10MB, accepted types shown)
      Link tab: URL input with validation
      Text tab: Textarea with character counter
  — Submit button (disabled after deadline)
  — If graded: grade display card (score, feedback, trainer name, date)
```

### 7.5 Trainer Dashboard Home

```
Layout:        DashboardLayout, TrainerSidebar
Page title:    "Your Dashboard"
Top row:       4 StatCards — Courses Published, Active Students, Sessions This Week, Pending Reviews
Below:         Two-column layout
  Left: My Courses list (last 5, with status badges, quick actions)
  Right: Upcoming Sessions + Submission Review Queue (count of pending)
```

### 7.6 Course Creation Wizard

```
Layout:        DashboardLayout
Page title:    "Create New Course"
Wizard:        StepWizard — 4 steps, progress indicator at top

Step 1 — Course Details:
  Fields: Title*, Description* (Textarea, rich), Category* (Select), Duration (Input, hours)
  Image: Banner image upload (FileDropzone, image preview, 2MB limit, recommended 1200×400px)

Step 2 — Modules:
  Module list (drag-to-reorder via @dnd-kit/core)
  Each module: type icon, title (editable inline), description, delete button
  "Add Module" button → inline form appears below list
  Module type selector: Live / Recorded / Reading (segmented control)

Step 3 — Resources:
  Per-module resource attachments
  File upload + external URL option
  List of added resources with delete

Step 4 — Review & Publish:
  Summary card of all entered information
  "Save as Draft" button (secondary) + "Publish" button (primary green)
```

### 7.7 Submission Review Page (Trainer)

```
Layout:        DashboardLayout
Page title:    "[Assignment Title] — Submissions"
Filter bar:    All / Pending / Graded / Returned

Submission table:
  Columns: Student name + avatar, Submitted at, Type (file/link/text), Status badge, Actions
  Row actions: "Review" button → opens side panel or modal

Review panel:
  Left: Student submission display
    File: embedded PDF viewer or download button
    Link: clickable URL + external icon
    Text: formatted text display
  Right: Grading form
    Grade input (0–100)
    Feedback textarea (required before saving)
    Action buttons: "Save Grade" (primary) + "Return for Revision" (secondary amber)
```

### 7.8 Admin Dashboard

```
Layout:        DashboardLayout, AdminSidebar
Page title:    "Platform Overview"
Top row:       6 StatCards in 3-col grid — Total Users, Active Users, Published Courses,
               Sessions Held, Completion Rate, Pending Approvals (with amber accent if > 0)

Pending Trainer Approvals:
  AlertBanner (amber) if pending count > 0, with "Review Now" link
  Table: Trainer name, email, skills, applied date, "Approve" + "Reject" buttons

User Management table:
  Searchable, filterable (by role, by status)
  Columns: Name + avatar, Email, Role badge, Status badge, Joined date, Actions
  Row actions: View profile, Suspend/Reactivate, Change role
```

---

## 8. Routing and Auth Protection

### 8.1 Middleware

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const ROLE_HOME: Record<string, string> = {
  student: "/dashboard/student",
  trainer: "/dashboard/trainer",
  admin: "/dashboard/admin",
};

const ROLE_PATTERN: Record<string, RegExp> = {
  student: /^\/dashboard\/student/,
  trainer: /^\/dashboard\/trainer/,
  admin: /^\/dashboard\/admin/,
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("ssu_access_token")?.value;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isDashboard = pathname.startsWith("/dashboard");

  if (!token && isDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_PUBLIC_KEY);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      // Redirect from auth pages if already logged in
      if (isPublic) {
        return NextResponse.redirect(
          new URL(ROLE_HOME[role] ?? "/login", request.url),
        );
      }

      // Block role mismatch
      if (isDashboard) {
        const allowed = ROLE_PATTERN[role];
        if (allowed && !allowed.test(pathname)) {
          return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
        }
      }
    } catch {
      // Token invalid — clear and redirect
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("ssu_access_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register/:path*",
    "/forgot-password",
    "/reset-password",
  ],
};
```

---

## 9. State Management Patterns

### 9.1 Auth Store (Zustand)

```typescript
// lib/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "trainer" | "admin";
  status: string;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "ssu-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
```

### 9.2 API Client

```typescript
// lib/api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        return apiClient.request(error.config);
      } catch {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
```

### 9.3 TanStack Query Pattern

```typescript
// lib/hooks/useCourses.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api/courses";

export const courseKeys = {
  all: ["courses"] as const,
  enrolled: () => [...courseKeys.all, "enrolled"] as const,
  detail: (id: string) => [...courseKeys.all, id] as const,
};

export function useEnrolledCourses() {
  return useQuery({
    queryKey: courseKeys.enrolled(),
    queryFn: coursesApi.getEnrolled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => coursesApi.getById(id),
    enabled: !!id,
  });
}
```

---

## 10. Configuration Files

### 10.1 next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.cloudflare.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
```

### 10.2 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@ssu/ui": ["../../packages/ui/src"],
      "@ssu/types": ["../../packages/types/src"],
      "@ssu/schema": ["../../packages/schema/src"],
      "@ssu/utils": ["../../packages/utils/src"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 10.3 .eslintrc.json

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react/self-closing-comp": "warn",
    "import/no-anonymous-default-export": "warn"
  }
}
```

### 10.4 .prettierrc

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### 10.5 .env.example

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_PUBLIC_KEY="your-public-key-here"
```

---

## 11. Build Sequence for Cursor

Follow this order exactly. Do not skip ahead.

**Step 1** — Scaffold the `packages/config` folder. Create the shared Tailwind config and tsconfig base. These are imported by everything else.

**Step 2** — Scaffold `packages/utils`. Implement `cn()`, `formatDate()`, `truncate()`, `getInitials()`, `formatFileSize()`.

**Step 3** — Scaffold `packages/ui`. Build atoms first (Button, Badge, Input, Label, Spinner, Skeleton, ProgressBar, Avatar, Checkbox), then molecules (FormField, StatCard, EmptyState, AlertBanner, FileDropzone, CourseCard, AssignmentCard), then organisms (DataTable, Modal, NavigationSidebar, TopHeader, PageHeader, StepWizard). Confirm Storybook renders each component before moving to the app.

**Step 4** — Initialise `apps/web`. Apply the Tailwind config, CSS variables, font setup, and root layout. Confirm `pnpm dev` starts without errors.

**Step 5** — Implement `middleware.ts` for RBAC route protection.

**Step 6** — Build auth screens: login, student register, trainer register, forgot password, reset password. Use AuthLayout.

**Step 7** — Build student dashboard: layout, home, courses, classroom, assignments, schedule.

**Step 8** — Build trainer dashboard: layout, home, course creation wizard, sessions, submission review.

**Step 9** — Build admin dashboard: layout, home, user management, trainer approvals, programs, announcements.

**Step 10** — Wire all API calls using TanStack Query. Replace mock data with real API calls.

---

## 12. Non-Negotiable Code Rules

1. **No `any` type.** Ever. Use `unknown` and narrow it if the type is unclear.
2. **No inline styles.** All styling via Tailwind utility classes or CSS variables.
3. **No `useState` for form state.** All forms use React Hook Form.
4. **No validation logic in components.** All validation via Zod schemas from `@ssu/schema`.
5. **No `fetch()` in components.** All API calls go through `lib/api/`. Components call hooks.
6. **Every component exports its props interface** as a named TypeScript interface.
7. **Every folder has an `index.ts` barrel export.**
8. **Every async operation must handle error state** and show an appropriate UI (AlertBanner or EmptyState).
9. **Every list view must handle empty state** using the EmptyState component.
10. **Every loading state must use the Skeleton component**, not a spinner, unless the content area is very small.
11. **Colours must only come from the brand palette** defined in Section 3.1 or the Tailwind config. No hardcoded hex values in component files.
12. **Minimum touch target size is 44×44px** for all interactive elements.

---

_This document governs the entire frontend build for Skill Scale Up. When Cursor asks how to implement anything, the answer is in here first._
