# Claiire Monorepo

## Shipglowz Development Mode

- development_mode: local
- validation_surface: local
- ship_before_preview_test: no
- post_ship_verification: none
- deployment_provider: vercel
- preview_source: not applicable
- production_url: https://www.claiire.fr
- observability: other
- diagnostic_surface: missing
- logs_copy_action: missing
- diagnostic_log_header: missing
- notes: monorepo `site/` + `app/`; business/product docs shared, technical docs split by surface
- last_reviewed: 2026-06-29

## Structure

- `site/`: Astro site
- `app/`: Expo mobile app package root
- `shipglowz_data/`: documentation and workflow corpus

## Documentation Rules

- shared branding: `shipglowz_data/branding/branding.md`
- shared business/product: `shipglowz_data/business/`
- technical docs by surface: `shipglowz_data/technical/site/` and `shipglowz_data/technical/app/`
- editorial docs: `shipglowz_data/editorial/site/`
- research and inspiration staging: `shipglowz_data/research/app-inspiration/`
- workflow trackers and specs: `shipglowz_data/workflow/`

## Notes

The remaining inner `app/` directory inside the mobile package is the Expo Router routes directory, not a second package root.
