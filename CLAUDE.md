# Claiire Monorepo

## ShipFlow Development Mode

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
- `shipflow_data/`: documentation and workflow corpus

## Documentation Rules

- shared branding: `shipflow_data/branding/branding.md`
- shared business/product: `shipflow_data/business/`
- technical docs by surface: `shipflow_data/technical/site/` and `shipflow_data/technical/app/`
- editorial docs: `shipflow_data/editorial/site/`
- research and inspiration staging: `shipflow_data/research/app-inspiration/`
- workflow trackers and specs: `shipflow_data/workflow/`

## Notes

The remaining inner `app/` directory inside the mobile package is the Expo Router routes directory, not a second package root.
