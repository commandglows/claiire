# Claiire App - Technical Reference

## Scope

This file documents the mobile app surface only.

## Package Root

- package root: `app/`
- Expo Router routes: `app/app/`

## Source Of Truth

- shared business/product: `shipglows_data/business/business.md`
- shared branding: `shipglows_data/branding/branding.md`
- app workflow history: `shipglows_data/workflow/app/`
- inspiration archive: `shipglows_data/research/app-inspiration/`

## Product Summary

Claiire app is a mobile wellness companion built around:

- on-device AI companionship
- gamified progression
- habit and crisis-support flows
- privacy-forward positioning

## Stack

- Expo 56
- TypeScript
- Expo Router
- Clerk Expo
- Convex
- Zustand
- Jest 29.7.0 + jest-expo 56.0.4

## Constraints

- Expo Go is not enough for the full native surface
- Sensitive situation state in Ma situation remains local-only (`SecureStore`) and not persisted to Convex in V1
- Zustand is UI state only
- safe vocabulary rules from `shipglows_data/technical/app/guidelines.md` apply everywhere

## Validation

- workspace package path: `app/`
- package manifest: `app/package.json`
- tests: `pnpm --dir app test` or equivalent local package command
