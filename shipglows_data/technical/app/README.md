# Claiire App

Mobile application package for Claiire.

## Runtime requirements

- Node.js 24.x (checked via `app/.node-version`, `app/.nvmrc` and `app/package.json.engines.node`)
- `pnpm` (pinned via `packageManager: "pnpm@11.8.0"` in `app/package.json`)

## Architecture Decisions

- Mobile runtime: Expo and React Native remain the canonical Claiire app stack. See `shipglows_data/technical/app/decisions/mobile-runtime-expo.md` for rationale, preserved constraints, and reconsideration criteria.
- Sensitive situation state: `Ma situation` is a solo-only, local-first feature backed by Expo SecureStore and an explicit confirmation boundary. See `shipglows_data/technical/app/situation-state.md`.

## Entry Points

- package root: `app/`
- routes: `app/app/`
- shared UI primitives: `app/components/`
- feature code: `app/features/`
- backend model and functions: `app/convex/`

## Commands

- install dependencies with the workspace toolchain:
  - `pnpm --dir app install`
- run app tests from `app/`:
  - `pnpm --dir app test`
  - `pnpm --dir app test:watch`
- keep business and branding decisions in `shipglows_data/`, not in package-local Markdown

## Related Docs

- `shipglows_data/technical/app/CLAUDE.md`
- `shipglows_data/technical/app/guidelines.md`
- `shipglows_data/technical/app/decisions/mobile-runtime-expo.md`
- `shipglows_data/technical/app/situation-state.md`
- `shipglows_data/business/business.md`
- `shipglows_data/branding/branding.md`
