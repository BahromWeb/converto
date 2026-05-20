# Converto

PDF tools that don't feel like 2008. A Turborepo + Next.js + shadcn/ui monorepo with two apps — the public website and the operations admin — sharing one design system, one data layer, and one set of types.

## Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Frontend:** Next.js 15 (App Router) + React 19
- **Styling:** Tailwind CSS v3 + shadcn/ui (new-york style, stone base)
- **Language:** TypeScript 5.6 (strict)

## Workspace layout

```
converto/
├── apps/
│   ├── web/                  # Public site (port 3000)
│   └── admin/                # Operations console (port 3001)
└── packages/
    ├── ui/                   # @converto/ui — shadcn/ui design system
    ├── data/                 # @converto/data — tool registry, site config, mock data
    ├── utils/                # @converto/utils — pure helpers (format, date)
    ├── types/                # @converto/types — shared TS types
    ├── eslint-config/        # @converto/eslint-config
    ├── typescript-config/    # @converto/typescript-config
    └── tailwind-config/      # @converto/tailwind-config
```

## Compatibility model

Both apps share the same source of truth via workspace packages:

| Concern | Shared in |
| --- | --- |
| Brand tokens, fonts, base CSS | `@converto/ui/globals.css` |
| Shadcn primitives (Button, Card, Table, …) | `@converto/ui/components/*` |
| Tool registry (the 12 tools and their metadata) | `@converto/data` |
| Site config + navigation | `@converto/data` |
| User / Job / Tool types | `@converto/types` |
| Date + byte formatters | `@converto/utils` |
| TS, ESLint, Tailwind presets | `@converto/*-config` |

Adding a new tool means **one edit** in [packages/data/src/tools.ts](packages/data/src/tools.ts). Both apps pick it up — the public site renders a card, the admin lists it for management.

## Getting started

```bash
pnpm install
pnpm dev          # runs every app in parallel via Turborepo
```

| URL | App |
| --- | --- |
| <http://localhost:3000> | Public site (`apps/web`) |
| <http://localhost:3001> | Admin console (`apps/admin`) |
| <http://localhost:3001/login> | Admin sign-in page |

## Common scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Run **both** apps in dev mode |
| `pnpm build` | Production build every workspace |
| `pnpm lint` | Lint every workspace |
| `pnpm typecheck` | Type-check every workspace |
| `pnpm format` | Prettier write across the repo |

Scope to one workspace with `--filter`:

```bash
pnpm --filter web dev          # public site only
pnpm --filter admin dev        # admin only
pnpm --filter @converto/ui build
```

## Adding shadcn components

Components live in `packages/ui`. From the repo root:

```bash
pnpm --filter @converto/ui dlx shadcn@latest add dialog
```

Once added, import in any app:

```tsx
import { Dialog } from "@converto/ui/components/dialog";
```

## Adding a new app

1. `mkdir apps/<name>` and scaffold a Next.js project inside.
2. Set its `package.json` name (the simple slug — `web`, `admin`, etc).
3. Add the workspace packages you need:
   ```json
   "@converto/ui": "workspace:*",
   "@converto/data": "workspace:*",
   "@converto/utils": "workspace:*",
   "@converto/types": "workspace:*"
   ```
4. Extend the shared TS / ESLint / Tailwind configs from `packages/*-config`.
5. Add the workspace names to `transpilePackages` in `next.config.mjs`.
