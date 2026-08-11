# Claiire design-system authority

The public web site (`site/`) uses `site/src/styles/global.css` as its canonical
design-token and theme source. Astro layouts import that file for all standard
site pages; standalone pages must import it explicitly before consuming tokens.

Components and pages consume semantic `--site-*` tokens. Raw visual values belong
only in this file, or in a component-specific token declared here when the value
is genuinely local to that component.

## Token families

- Color and theme roles: `--site-*` semantic roles only. Neutral colors use the
  `--site-neutral-200` to `--site-neutral-700` scale; no framework bridge is
  part of the public site contract.
- Typography: `--site-font-*`, `--site-text-*`, and `--site-leading-*`.
- Spacing and layout: `--site-space-*`, `--site-content-*`, and
  `--site-breakpoint-*`.
- Shape and elevation: `--site-radius-*`, `--site-shadow-*`.
- Motion and layers: `--site-motion-*`, `--site-z-*`.
- Icons: `--site-icon-*` sizes and `--site-icon-stroke`; interface glyphs are
  selected through `ClaiireIcon.astro` or `ClaiireIcon.vue`.

## Icon authority

Lucide is the canonical interface icon family on every Claiire surface:
`lucide-react-native` for Expo, `@lucide/astro` for Astro, and `@lucide/vue`
for Vue islands. The app registry is `app/components/AppIcon.tsx`; the site
registries are `site/src/components/ClaiireIcon.astro` and
`site/src/components/ClaiireIcon.vue`.

New persisted values use stable semantic identifiers such as `flame`, `trophy`,
`shield`, or `target`, never emoji. The registries retain a bounded legacy emoji
mapping so existing user data continues to render. Brand marks keep their
official SVGs. Expressive companion characters and prose emoji are content, not
interface icons.

The site supports light and dark themes through the two theme blocks in
`global.css`. Any new visual role must be defined for both themes when its value
changes with theme.

## Page layout vocabulary

Documentation frontmatter uses the proprietary `pageType` field. Supported
values are `article` and `landing`, with `article` as the schema default.
`landing` pages keep the wide hero treatment and omit the documentation sidebar,
table of contents, and article introduction. Their layout modifiers use the
`--landing` suffix.

## Consumption rule

Pages and components should consume these semantic tokens through `var(...)`.
Inline style values are limited to runtime data (for example, a progress
percentage or a parcours identity color) and must not become a second token
system.

CSS media-query conditions are the protocol exception to token consumption:
custom properties are not valid in `@media` conditions. Responsive queries
therefore repeat the documented breakpoint values as `rem` literals while the
named `--site-breakpoint-*` tokens remain the human-readable authority. Plain
`width: 100%` declarations are also structural sizing, not visual-value drift.

## Verification

Run the design-system drift checker scoped to `site/` after UI changes, then run
`pnpm --dir site check` and `pnpm --dir site build`. The drift checker is a
conservative candidate detector: findings in this file are token definitions;
findings in pages/components require review or migration.
