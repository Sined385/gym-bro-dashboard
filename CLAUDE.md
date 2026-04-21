# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Read-only admin analytics dashboard for GymJam. Next.js 15 App Router with direct PostgreSQL queries (no ORM). Shares the same Supabase Postgres instance as the API.

## Common Commands

```bash
npm run dev       # Next.js dev server
npm run build     # Production build (standalone output)
npm run start     # Start production server
npm run lint      # Lint
```

## Architecture

### Database Layer

No ORM — uses `pg` Pool directly.

- `src/lib/db.ts` — Connection pool (max 5), generic `query<T>(sql, params?)` and `queryOne<T>(sql, params?)` helpers
- `src/lib/queries.ts` — All SQL queries with TypeScript interfaces, organized by page:
  - `getKPIs()`, `getRegistrationTrend()`, `getWorkoutTrend()`, `getUserActivity()`, `getRecentEvents()` — main dashboard
  - `getUserDetail()`, `getUserKPIs()`, `getUserWorkoutHistory()`, etc. — user detail page
  - `getAiUsageKPIs()`, `getAiUsageTrend()`, `getAiUsageByFeature()`, `getAiUsageByUser()` — AI usage
  - `getFeatureUsageKPIs()`, `getEventBreakdown()`, `getCategoryBreakdown()`, `getFeatureUsageTrend()` — feature usage
  - `fillGaps()` — fills missing dates in trend data with zero counts

**Important:** Prisma-defined tables use PascalCase names. Always quote them in SQL: `"User"`, not `User`.

### Auth

Simple password-based cookie auth (completely separate from user/Supabase auth):
- `src/lib/auth.ts` — `setAuthCookie()`, `verifyAuth()`, `clearAuthCookie()` using HMAC-SHA256
- `src/middleware.ts` — Edge-compatible guard, protects all routes except `/login`, `/_next`, `/favicon.ico`
- `src/app/login/actions.ts` — Server action for password verification

### Pages

All pages use `export const dynamic = "force-dynamic"` — no ISR, always fresh data.

- `/(dashboard)/` — KPI cards, registration + workout trend charts, user activity table, recent events
- `/(dashboard)/ai-usage/` — AI token/cost analytics: 6 KPI cards, trend chart, breakdowns by feature and user
- `/(dashboard)/feature-usage/` — App event analytics: KPI cards, trend chart, category + event breakdowns
- `/(dashboard)/users/[id]/` — User detail: profile header, 8 KPI cards, workout trend, coach stats, AI usage, posts, activity timeline
- `/login/` — Password form with `useActionState`
- `/api/logout/` — Clears cookie, redirects to login
- `/api/debug/` — DB health check (user/workout/event counts)

### Component Pattern

- Server Components by default — pages fetch data with `Promise.all()` for parallel loading
- `"use client"` only for Recharts chart components and the refresh button
- Components co-located in `_components/` directories under each page
- Loading states: `loading.tsx` with Tailwind `animate-pulse` skeletons

### Styling

Dark theme throughout:
- Body: `bg-gray-950`, Cards: `bg-gray-900 border-gray-800 rounded-xl`
- Text: `text-gray-100` primary, `text-gray-400` secondary
- Brand color: `#E86A75` (configured in `tailwind.config.ts` as `primary`)
- Charts: Recharts with dark tooltips and custom gradient fills

## Environment

Requires `.env` with:
- `DATABASE_URL` — Postgres connection string (same Supabase instance as API)
- `DASHBOARD_PASSWORD` — Password for admin login

See `.env.example`.

## Deployment

Railway with Dockerfile-based builds. Config in `railway.json`. Output mode is `standalone` (self-contained Node.js server).
