# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Claiire** is a monorepo with a French-language wellness website and a companion app. The site covers psychology, health, and personal transformation topics and is deployed to Vercel with SEO optimizations.

- **Site URL**: https://claiire.com
- **Framework**: Astro 6.x for the site, mobile tooling under `app/`
- **Language**: French (fr)
- **Deployment**: Vercel (static output)
- **Package Manager**: pnpm

## Development Commands

```bash
# Development
pnpm dev              # Start dev server (default port 3000)
pnpm dev:watch        # Dev server with auto-restart on config changes
pnpm start            # Alias for dev

# Building
pnpm build            # Production build (outputs to dist/)
pnpm preview          # Preview production build locally

# Quality Checks
pnpm check            # Run Astro type checking
pnpm format           # Format all files with Prettier
pnpm format:check     # Check formatting without writing
pnpm check-links      # Validate internal/external links

# Special Scripts
pnpm format:titles    # Auto-format all markdown headings to title case
pnpm format:all       # Run both title formatting and prettier
```

## Architecture

### Content Organization

Content is organized in `site/src/content/docs/` with these main sections:

- **psy/** - Psychology (largest section: approaches, emotions, trauma, development)
- **violence/** - Violence-related content (types, causes, solutions, resources)
- **systeme-\*** - Body systems (digestif, nerveux, immunitaire, hormonal, cardio, social)
- **harmonie/** - Balance and well-being
- **stress/** - Stress mechanisms and solutions
- **sommeil/** - Sleep
- **nutrition/** - Nutrition
- **medecine/** - Medicine
- **formations/** - Training materials (especially violence-related)

### Navigation Configuration

Navigation is **modular** and lives in `site/src/config/navigation/`:
- Each major section has its own file (e.g., `psychologie.js`, `violence.js`, `corps.js`, `accueil.js`)
- `index.js` exports all sidebars
- `astro.config.mjs` imports and uses these sidebar configurations

**When adding/modifying navigation:**
1. Edit the relevant file in `site/src/config/navigation/`
2. Navigation changes require dev server restart (use `pnpm dev:watch` to auto-restart)

### Content Collections

Content uses Astro Content Collections with the Content Layer API (`site/src/content.config.ts`).

**Required frontmatter for all markdown files:**
```yaml
---
title: Page Title  # REQUIRED - must be a non-empty string
description: Optional description  # Optional but recommended for SEO
---
```

**Common frontmatter issues:**
- Missing `title` field → build will fail
- Empty values (`description:` with no value) → build will fail
- Special characters in titles → wrap in quotes

### Custom Scripts

**scripts/postinstall.cjs**
- Automatically runs after `pnpm install`
- Creates `node_modules/nanoid/non-secure/index.js` workaround
- Required because Starlight expects this module but nanoid version doesn't include it
- Uses Math.random() (NOT cryptographically secure - only for UI IDs)

**scripts/format-titles.js**
- Applies title case to all markdown headings
- Adds blank lines before/after headings
- Run with `pnpm format:titles`

### Environment & Deployment

**PM2 Configuration** (`ecosystem.config.cjs`):
- App runs on port 3005
- Uses flox environment activation
- Auto-restart enabled

**Production Analytics:**
- Vercel Web Analytics enabled in `astro.config.mjs`
- Third-party analytics (onthe.io) injected only in production via head scripts

## Common Workflows

### Adding New Content

1. Create markdown file in appropriate `site/src/content/docs/` subdirectory
2. Add required frontmatter with `title` field
3. If adding a new section, update navigation in `src/config/navigation/`
4. Run `pnpm format` before committing

### Fixing Build Errors

**"title: Required" errors:**
- Check frontmatter has `title:` field with non-empty string value
- Remove any empty fields (e.g., `description:` with no value)

**Missing image errors:**
- Images referenced in markdown must exist in same directory or `site/src/assets/`
- Check for broken image references: `![](image.webp)`

**Navigation not updating:**
- Restart dev server (or use `pnpm dev:watch`)
- Navigation is cached and requires restart to reflect changes

### Formatting Content

```bash
# Full formatting pipeline (recommended before commits)
pnpm format:all

# Just format code/markdown
pnpm format

# Just format markdown headings
pnpm format:titles
```

## Astro Configuration

Key settings in `site/astro.config.mjs`:
- **Port**: Reads from `PORT` env var (default 3000)
- **Output**: Static (pre-rendered HTML)
- **Adapter**: Vercel with web analytics
- **Sitemap**: Auto-generated, excludes 404 and internal pages
- **Locales**: French only (lang: 'fr')

## TypeScript

Project uses Astro's strict TypeScript config (`extends: "astro/tsconfigs/strict"`).

## Important Notes

- **Package manager**: Always use `pnpm`, not npm or yarn
- **Frontmatter validation**: Build fails on invalid/missing frontmatter
- **Navigation caching**: Config changes need dev server restart
- **Custom CSS**: Lives in `site/src/styles/global.css`
- **Logo**: `site/src/assets/claiire-logo.webp` (replaces site title in header)
- **Social links**: Currently placeholder URLs in `site/astro.config.mjs` (see TODOs)

## Context MCP — Token-Saving Protocol

This project uses a local codebase MCP server for efficient context management. Follow this order strictly:

### Every turn:
1. **Call `context_continue` FIRST** — before any Read, Grep, Glob, or file exploration. This returns files already in memory and avoids re-reading.
2. **If you need more files**, call `context_retrieve` with your query BEFORE using Grep/Glob. It ranks files by relevance.
3. **Use `context_read`** instead of the Read tool when exploring code. It excerpts only relevant portions and tracks your token budget (18K chars/turn).
4. **After editing files**, always call `context_register_edit` with a one-sentence summary.
5. **Store key decisions** with `context_decide` (e.g., "using Vue for interactive islands").

### Rules:
- Do NOT use Read/Grep/Glob for broad exploration before calling `context_continue`
- Do NOT re-read files that `context_continue` says are already in memory
- Prefer `context_read` over Read for all code exploration (Read is fine for files you need in full)
- Do NOT exceed the turn read budget — if `context_read` says budget exhausted, stop reading and work with what you have
- After edits, ALWAYS call `context_register_edit` — this invalidates stale cache
- For large files: call `list_symbols` first, then `context_read "file::symbol"` to read just the function you need
- Call `count_tokens(text)` before reading any file > 200 lines to decide if it's worth the budget
- When user says "done", "bye", or "wrap up" — call `session_wrap` to save context for next session
