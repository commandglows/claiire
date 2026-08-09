# Claiire Monorepo

## Shipglows Development Mode

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
- `shipglows_data/`: documentation and workflow corpus

## Documentation Rules

- shared branding: `shipglows_data/branding/branding.md`
- shared business/product: `shipglows_data/business/`
- technical docs by surface: `shipglows_data/technical/site/` and `shipglows_data/technical/app/`
- editorial docs: `shipglows_data/editorial/site/`
- research and inspiration staging: `shipglows_data/research/app-inspiration/`
- workflow trackers and specs: `shipglows_data/workflow/`

## Notes

The remaining inner `app/` directory inside the mobile package is the Expo Router routes directory, not a second package root.
