# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased] — 2026-03-18

### Added

**Core Systems (Stories 23-27)**
- Intervention persistence + XP: interventionLog table, logUse (+30 XP), rateIntervention (+10 XP), success rate tracking, mastery badges (5x/10x)
- SOS FAB button: pulsing red floating action button on all tabs, opens Battle Report
- Predictive Notifications: predictionAlert table, generateAlerts (>85% confidence, 4h throttle), alert banner on home with "Préparer"/"OK" actions
- Companion-Led Routines: routine + routineCompletion tables, 12 preset actions, timer, companion encouragement, full-screen execution, 10 XP/action + 20 bonus
- Battle Report: 3-step quick crisis log (type → intensity → details), Warrior/Zen labels, post-log intervention suggestions sorted by success rate

**Gamification (Stories 28, 31, 39, 42)**
- Celebration overlay: confetti particles, spring animation, companion message, auto-dismiss 5s, queued celebrations
- Level up + streak milestone detection (3/7/30 days) → triggers overlay
- Achievement system: 33 badges across 9 categories (starter/streak/combo/volume/crisis/routine/intervention/insight/level), progress bars, category filter, date display
- Signature Move: highlights most effective intervention on profile (3+ uses, ranked by success rate)
- XP Toast: animated floating "+X XP" notification on every XP action

**Companion (Stories 30, 35)**
- Companion Context System: getCompanionContext query (streak, XP, logs, patterns, habits, hour), 5 contextual prompts ("Comment je vais?", "Mon plan du jour", "Encourage-moi", "Moment difficile", "Mes stats"), contextual greeting
- Discovery Calendar (AD-12e): 8 config-driven milestones (first_log, first_crisis, day_3, first_habit_streak, day_7, first_prediction, level_5, all_types_logged), companion reveals features through conversation

**Analytics (Stories 36-37)**
- Crisis Heatmap: 7×6 grid (day-of-week × 4h blocks), 90-day window, auto-detected hotspot, color intensity
- Battle History Timeline: filterable (7/30/90d/all), grouped by date, victory/battle dots, Warrior/Zen labels

**UX (Stories 29, 32, 33, 34, 38, 40, 41)**
- Onboarding multi-step: 5 steps (welcome → companion → mode → goals → name → ready), progress bar, fade transitions, first goal creates habits automatically
- Stealth Mode (AD-8e): discreet notifications, quiet hours (configurable start/end), prediction alerts toggle, streak warning toggle
- Custom Interventions: user-created techniques with icon picker, merged into arsenal, tracked with stats
- Offline Emergency Cache: top 3 interventions, emergency contacts, habits cached via SecureStore, auto-sync on foreground
- Habit Streaks: per-habit streak counter on journal, batch query
- Journal Quick Stats: today completions / active streaks / best streak banner
- Habit Mission Types (PRD 9.3): defense/offense/support/training with emoji badges

### Changed
- Companion tab: refactored with contextual prompts, discovery messages, SOS → Battle Report, Arsenal shortcut
- Progrès tab: replaced basic activity list with Battle History + Crisis Heatmap components
- Settings modal: expanded with quiet hours, prediction alerts, streak warnings, stealth mode
- Crisis-support arsenal: interventions sorted by success rate, rate feedback ("Ça a aidé?"), custom intervention form
- Achievement modal: categories, summary stats, progress bars (was flat list)
