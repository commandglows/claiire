<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  useGamification,
  AchievementToast,
  fireBadgeConfetti,
} from '@diane-winflowz/gamification'
import type { Badge } from '@diane-winflowz/gamification'
import { createClaiireConfig } from '../gamification/config'

const props = defineProps<{
  slug: string
  category?: string
  enableBadgeConfetti?: boolean
}>()

const toastBadge = ref<Badge | null>(null)
const mounted = ref(false)
const showPanel = ref(false)
const readProgress = ref(0)

const config = createClaiireConfig()
config.onBadgeEarned = (badge: Badge) => {
  toastBadge.value = badge
  if (props.enableBadgeConfetti !== false) {
    fireBadgeConfetti()
  }
}

const { reader, streak, badges, markAsRead, progress } = useGamification(config)

const recentBadges = computed(() => badges.earned.value.slice(-3))
const allBadges = computed(() => [...badges.earned.value, ...badges.unearned.value])

// Level system
const LEVELS = [
  { min: 0, max: 4, name: 'Curieux', icon: '👣', next: 5 },
  { min: 5, max: 14, name: 'Explorateur', icon: '🔍', next: 15 },
  { min: 15, max: 29, name: 'Studieux', icon: '📖', next: 30 },
  { min: 30, max: 49, name: 'Érudit', icon: '🎓', next: 50 },
  { min: 50, max: Infinity, name: 'Savant', icon: '🧠', next: null },
]

const currentLevel = computed(() => {
  const total = reader.totalRead.value
  return LEVELS.find((l) => total >= l.min && total <= l.max) ?? LEVELS[0]
})

const nextLevel = computed(() => {
  const idx = LEVELS.indexOf(currentLevel.value)
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null
})

const levelProgress = computed(() => {
  const total = reader.totalRead.value
  const level = currentLevel.value
  if (!level.next) return 100
  const range = level.next - level.min
  const done = total - level.min
  return Math.round((done / range) * 100)
})

const categoryLabels: Record<string, string> = {
  psychologie: 'Psychologie',
  corps: 'Corps & Santé',
  violence: 'Violence',
  parcours: 'Parcours',
}

const categoryStats = computed(() => {
  const byCategory = reader.readByCategory.value
  return Object.entries(categoryLabels).map(([key, label]) => {
    const count = byCategory[key]?.length ?? 0
    return { key, label, count }
  }).filter((c) => c.count > 0)
})

// Reading scroll progress
function updateProgress() {
  const el = document.documentElement
  const scrolled = el.scrollTop || document.body.scrollTop
  const total = el.scrollHeight - el.clientHeight
  readProgress.value = total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') showPanel.value = false
}

function togglePanel() {
  showPanel.value = !showPanel.value
}

onMounted(() => {
  mounted.value = true
  if (props.slug) markAsRead(props.slug, props.category)
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('keydown', onKeydown)
  updateProgress()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('keydown', onKeydown)
})

watch(
  () => props.slug,
  (newSlug) => {
    if (newSlug && mounted.value) {
      markAsRead(newSlug, props.category)
      readProgress.value = 0
    }
  }
)
</script>

<template>
  <div v-if="mounted">
    <!-- Reading progress bar -->
    <div class="read-progress-track">
      <div class="read-progress-fill" :style="{ width: readProgress + '%' }" />
    </div>

    <!-- Panel overlay -->
    <Teleport to="body">
      <Transition name="panel">
        <div v-if="showPanel" class="panel-backdrop" @click.self="showPanel = false">
          <div class="panel">
            <button class="panel-close" @click="showPanel = false" aria-label="Fermer">✕</button>

            <!-- Level -->
            <div class="panel-level">
              <span class="level-icon">{{ currentLevel.icon }}</span>
              <div class="level-info">
                <div class="level-name">{{ currentLevel.name }}</div>
                <div class="level-sub">
                  {{ reader.totalRead.value }} page{{ reader.totalRead.value > 1 ? 's' : '' }} lue{{ reader.totalRead.value > 1 ? 's' : '' }}
                  <span v-if="nextLevel"> · encore {{ nextLevel.min - reader.totalRead.value }} pour <strong>{{ nextLevel.name }}</strong></span>
                </div>
              </div>
            </div>
            <div class="level-bar-track">
              <div class="level-bar-fill" :style="{ width: levelProgress + '%' }" />
            </div>

            <!-- Stats row -->
            <div class="panel-stats">
              <div class="pstat">
                <span class="pstat-icon" :class="{ active: streak.isActive.value }">🔥</span>
                <span class="pstat-val">{{ streak.currentStreak.value }}</span>
                <span class="pstat-lbl">jours consécutifs</span>
              </div>
              <div class="pstat">
                <span class="pstat-icon">🏆</span>
                <span class="pstat-val">{{ streak.longestStreak.value }}</span>
                <span class="pstat-lbl">record de série</span>
              </div>
              <div class="pstat">
                <span class="pstat-icon">🎖️</span>
                <span class="pstat-val">{{ badges.earned.value.length }}/{{ allBadges.length }}</span>
                <span class="pstat-lbl">badges</span>
              </div>
            </div>

            <!-- Category progress -->
            <div v-if="categoryStats.length > 0" class="panel-section">
              <div class="section-title">Par section</div>
              <div class="cat-list">
                <div v-for="cat in categoryStats" :key="cat.key" class="cat-item">
                  <span class="cat-label">{{ cat.label }}</span>
                  <span class="cat-count">{{ cat.count }}</span>
                </div>
              </div>
            </div>

            <!-- Badges -->
            <div class="panel-section">
              <div class="section-title">Badges débloqués</div>
              <div class="badges-list">
                <div
                  v-for="badge in allBadges"
                  :key="badge.id"
                  class="badge-item"
                  :class="{ earned: badges.earned.value.some(b => b.id === badge.id), locked: !badges.earned.value.some(b => b.id === badge.id) }"
                  :title="badges.earned.value.some(b => b.id === badge.id) ? badge.description : 'Badge verrouillé'"
                >
                  <span class="badge-ico">{{ badge.icon }}</span>
                  <span class="badge-name">{{ badges.earned.value.some(b => b.id === badge.id) ? badge.name : '???' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Floating bar -->
    <button class="gamification-bar" @click="togglePanel" :aria-label="'Ouvrir le tableau de bord — ' + currentLevel.name">
      <div class="bar-inner">
        <div class="stat-item">
          <span class="streak-icon" :class="{ active: streak.isActive.value }">🔥</span>
          <span class="stat-value">{{ streak.currentStreak.value }}</span>
          <span class="stat-label">{{ streak.currentStreak.value > 1 ? 'jours' : 'jour' }}</span>
        </div>

        <div class="divider" />

        <div class="stat-item">
          <span class="stat-value">{{ reader.totalRead.value }}</span>
          <span class="stat-label">lu{{ reader.totalRead.value > 1 ? 's' : '' }}</span>
        </div>

        <div class="divider" />

        <div class="stat-item badges-item">
          <span class="level-badge-icon">{{ currentLevel.icon }}</span>
          <span class="stat-value">{{ currentLevel.name }}</span>
          <span
            v-for="badge in recentBadges"
            :key="badge.id"
            class="recent-badge"
            :title="badge.name"
          >{{ badge.icon }}</span>
        </div>
      </div>
    </button>

    <Teleport to="body">
      <AchievementToast :badge="toastBadge" :duration="5000" class="toast-wrapper">
        <template #default="{ badge: b, dismiss }">
          <div class="toast-content" @click="dismiss">
            <span class="toast-icon">{{ b.icon }}</span>
            <div class="toast-text">
              <strong>Badge débloqué !</strong>
              <span>{{ b.name }}</span>
            </div>
          </div>
        </template>
      </AchievementToast>
    </Teleport>
  </div>
</template>

<style scoped>
/* Reading progress bar */
.read-progress-track {
  position: fixed;
  top: var(--sl-nav-height, 3.5rem);
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9;
  background: transparent;
  pointer-events: none;
}

.read-progress-fill {
  height: 100%;
  background: var(--sl-color-accent);
  transition: width 0.15s linear;
  border-radius: 0 2px 2px 0;
}

/* Floating bar */
.gamification-bar {
  position: fixed;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}

.gamification-bar:focus-visible {
  outline: 2px solid var(--sl-color-accent);
  outline-offset: 3px;
  border-radius: 9999px;
}

.bar-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1.5rem;
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 9999px;
  background: var(--sl-color-bg);
  box-shadow: 0 4px 16px var(--site-shadow-0-12), 0 1px 4px var(--site-shadow-0-08);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--sl-color-text);
  white-space: nowrap;
  backdrop-filter: blur(8px);
  transition: box-shadow 0.2s, transform 0.15s;
}

.gamification-bar:hover .bar-inner {
  box-shadow: 0 6px 20px var(--site-shadow-0-18), 0 2px 6px var(--site-shadow-0-10);
  transform: translateY(-1px);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.streak-icon {
  font-size: 1.1rem;
  opacity: 0.35;
  transition: opacity 0.3s;
  line-height: 1;
}

.streak-icon.active {
  opacity: 1;
}

.level-badge-icon {
  font-size: 1rem;
  line-height: 1;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--sl-color-text);
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.6;
}

.divider {
  width: 1px;
  height: 1rem;
  background: var(--sl-color-gray-5);
}

.badges-item {
  gap: 0.3rem;
}

.recent-badge {
  font-size: 0.95rem;
  margin-left: 0.1rem;
}

/* Panel */
.panel-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--site-shadow-0-35);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 5rem;
}

.panel {
  position: relative;
  width: min(420px, calc(100vw - 2rem));
  max-height: 70vh;
  overflow-y: auto;
  background: var(--sl-color-bg);
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 12px 40px var(--site-shadow-0-25);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.panel-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  background: var(--sl-color-gray-6);
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--sl-color-gray-2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-close:hover {
  background: var(--sl-color-gray-5);
}

/* Level section */
.panel-level {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.level-icon {
  font-size: 2.25rem;
  line-height: 1;
  flex-shrink: 0;
}

.level-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.level-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--sl-color-text);
}

.level-sub {
  font-size: 0.8125rem;
  color: var(--sl-color-gray-3);
}

.level-bar-track {
  height: 6px;
  border-radius: 9999px;
  background: var(--sl-color-gray-6);
  overflow: hidden;
}

.level-bar-fill {
  height: 100%;
  background: var(--sl-color-accent);
  border-radius: 9999px;
  transition: width 0.6s ease;
}

/* Stats row */
.panel-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.pstat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.75rem 0.5rem;
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 0.625rem;
  background: var(--sl-color-accent-low);
}

.pstat-icon {
  font-size: 1.25rem;
  opacity: 0.4;
  transition: opacity 0.3s;
}

.pstat-icon.active {
  opacity: 1;
}

.pstat-val {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--sl-color-accent);
  line-height: 1;
}

.pstat-lbl {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--sl-color-gray-3);
  text-align: center;
}

/* Section */
.panel-section {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--sl-color-gray-3);
}

/* Category list */
.cat-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.cat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.625rem;
  border-radius: 0.375rem;
  background: var(--sl-color-gray-7, var(--sl-color-gray-6));
  font-size: 0.875rem;
}

.cat-label {
  color: var(--sl-color-text);
}

.cat-count {
  font-weight: 700;
  color: var(--sl-color-accent);
}

/* Badges */
.badges-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.5rem;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.625rem 0.5rem;
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 0.5rem;
  text-align: center;
  transition: transform 0.15s;
}

.badge-item.earned {
  border-color: var(--sl-color-accent);
  background: var(--sl-color-accent-low);
}

.badge-item.locked {
  opacity: 0.4;
}

.badge-ico {
  font-size: 1.5rem;
}

.badge-name {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--sl-color-text);
  line-height: 1.2;
}

/* Transitions */
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.2s ease;
}

.panel-enter-active .panel,
.panel-leave-active .panel {
  transition: transform 0.25s ease, opacity 0.2s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

.panel-enter-from .panel {
  transform: translateY(1.5rem) scale(0.97);
  opacity: 0;
}

.panel-leave-to .panel {
  transform: translateY(1.5rem) scale(0.97);
  opacity: 0;
}

/* Toast */
.toast-wrapper {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 200;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: 1px solid var(--sl-color-accent);
  border-radius: 0.5rem;
  background: var(--sl-color-bg);
  box-shadow: 0 4px 12px var(--site-shadow-0-20);
  cursor: pointer;
  animation: toast-slide-in 0.4s ease-out;
}

.toast-icon {
  font-size: 2rem;
}

.toast-text {
  display: flex;
  flex-direction: column;
}

.toast-text strong {
  font-size: 0.875rem;
  color: var(--sl-color-accent);
  text-transform: uppercase;
}

.toast-text span {
  font-size: 1rem;
  color: var(--sl-color-text);
}

@keyframes toast-slide-in {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

:global(.toast-enter-active) {
  animation: toast-slide-in 0.4s ease-out;
}

:global(.toast-leave-active) {
  animation: toast-slide-in 0.3s ease-in reverse;
}
</style>
