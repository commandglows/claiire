<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  useGamification,
  AchievementToast,
  fireBadgeConfetti,
} from '@diane-winflowz/gamification'
import type { Badge } from '@diane-winflowz/gamification'
import { createClaiireConfig } from '../gamification/config'
import ClaiireIcon from './ClaiireIcon.vue'

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
  { min: 0, max: 4, name: 'Curieux', icon: 'footprints', next: 5 },
  { min: 5, max: 14, name: 'Explorateur', icon: 'search', next: 15 },
  { min: 15, max: 29, name: 'Studieux', icon: 'book', next: 30 },
  { min: 30, max: 49, name: 'Érudit', icon: 'graduation', next: 50 },
  { min: 50, max: Infinity, name: 'Savant', icon: 'brain', next: null },
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
            <button class="panel-close" @click="showPanel = false" aria-label="Fermer"><ClaiireIcon name="close" :size="20" /></button>

            <!-- Level -->
            <div class="panel-level">
              <span class="level-icon"><ClaiireIcon :name="currentLevel.icon" :size="32" /></span>
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
                <span class="pstat-icon" :class="{ active: streak.isActive.value }"><ClaiireIcon name="flame" :size="24" /></span>
                <span class="pstat-val">{{ streak.currentStreak.value }}</span>
                <span class="pstat-lbl">jours consécutifs</span>
              </div>
              <div class="pstat">
                <span class="pstat-icon"><ClaiireIcon name="trophy" :size="24" /></span>
                <span class="pstat-val">{{ streak.longestStreak.value }}</span>
                <span class="pstat-lbl">record de série</span>
              </div>
              <div class="pstat">
                <span class="pstat-icon"><ClaiireIcon name="medal" :size="24" /></span>
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
                  <span class="badge-ico"><ClaiireIcon :name="badge.icon" :size="24" /></span>
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
          <span class="streak-icon" :class="{ active: streak.isActive.value }"><ClaiireIcon name="flame" :size="24" /></span>
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
          <span class="level-badge-icon"><ClaiireIcon :name="currentLevel.icon" :size="20" /></span>
          <span class="stat-value">{{ currentLevel.name }}</span>
          <span
            v-for="badge in recentBadges"
            :key="badge.id"
            class="recent-badge"
            :title="badge.name"
          ><ClaiireIcon :name="badge.icon" :size="18" /></span>
        </div>
      </div>
    </button>

    <Teleport to="body">
      <AchievementToast :badge="toastBadge" :duration="5000" class="toast-wrapper">
        <template #default="{ badge: b, dismiss }">
          <div class="toast-content" @click="dismiss">
            <span class="toast-icon"><ClaiireIcon :name="b.icon" :size="32" /></span>
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
  top: var(--site-header-height);
  left: 0;
  right: 0;
  height: var(--site-size-3px);
  z-index: var(--site-z-reader);
  background: transparent;
  pointer-events: none;
}

.read-progress-fill {
  height: var(--site-size-100pct);
  background: var(--site-accent);
  transition: width var(--site-motion-fast) linear;
  border-radius: 0 var(--site-size-2px) var(--site-size-2px) 0;
}

/* Floating bar */
.gamification-bar {
  position: fixed;
  bottom: var(--site-space-5);
  left: var(--site-size-50pct);
  transform: translateX(-50%);
  z-index: var(--site-z-header);
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}

.gamification-bar:focus-visible {
  outline: var(--site-size-2px) solid var(--site-accent);
  outline-offset: var(--site-size-3px);
  border-radius: var(--site-radius-pill);
}

.bar-inner {
  display: flex;
  align-items: center;
  gap: var(--site-space-4);
  padding: var(--site-space-2) var(--site-space-6);
  border: 1px solid var(--site-neutral-500);
  border-radius: var(--site-radius-pill);
  background: var(--site-surface-strong);
  box-shadow: 0 4px 16px var(--site-shadow-0-12), 0 1px 4px var(--site-shadow-0-08);
  font-size: var(--site-font-sm);
  font-weight: 600;
  color: var(--site-text);
  white-space: nowrap;
  backdrop-filter: blur(var(--site-size-8px));
  transition: box-shadow var(--site-motion-fast), transform var(--site-motion-fast);
}

.gamification-bar:hover .bar-inner {
  box-shadow: 0 6px 20px var(--site-shadow-0-18), 0 2px 6px var(--site-shadow-0-10);
  transform: translateY(calc(var(--site-size-1px) * -1));
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--site-space-0p3);
}

.streak-icon {
  font-size: var(--site-font-1p1);
  opacity: 0.35;
  transition: opacity var(--site-motion-slow);
  line-height: var(--site-leading-1);
}

.streak-icon.active {
  opacity: 1;
}

.level-badge-icon {
  font-size: var(--site-font-md);
  line-height: var(--site-leading-1);
}

.stat-value {
  font-size: var(--site-font-0p9);
  font-weight: 700;
  color: var(--site-text);
}

.stat-label {
  font-size: var(--site-font-xs);
  font-weight: 400;
  opacity: 0.6;
}

.divider {
  width: var(--site-size-1px);
  height: var(--site-font-md);
  background: var(--site-neutral-500);
}

.badges-item {
  gap: var(--site-space-0p3);
}

.recent-badge {
  font-size: var(--site-font-0p95);
  margin-left: var(--site-space-0p1);
}

/* Panel */
.panel-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--site-z-panel);
  background: var(--site-shadow-0-35);
  backdrop-filter: blur(var(--site-size-2px));
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: var(--site-size-5rem);
}

.panel {
  position: relative;
  width: min(420px, calc(100vw - 2rem));
  max-height: var(--site-size-70vh);
  overflow-y: auto;
  background: var(--site-surface-strong);
  border: 1px solid var(--site-neutral-500);
  border-radius: var(--radius-md);
  padding: var(--site-space-6);
  box-shadow: 0 12px 40px var(--site-shadow-0-25);
  display: flex;
  flex-direction: column;
  gap: var(--site-space-5);
}

.panel-close {
  position: absolute;
  top: var(--site-space-3);
  right: var(--site-space-3);
  width: var(--site-space-1p75);
  height: var(--site-space-1p75);
  border: none;
  background: var(--site-neutral-600);
  border-radius: var(--site-radius-circle);
  cursor: pointer;
  font-size: var(--site-font-xs);
  color: var(--site-neutral-200);
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-close:hover {
  background: var(--site-neutral-500);
}

/* Level section */
.panel-level {
  display: flex;
  align-items: center;
  gap: var(--site-space-0p875);
}

.level-icon {
  font-size: var(--site-font-2p25);
  line-height: var(--site-leading-1);
  flex-shrink: 0;
}

.level-info {
  display: flex;
  flex-direction: column;
  gap: var(--site-space-0p2);
}

.level-name {
  font-size: var(--site-font-1p125);
  font-weight: 700;
  color: var(--site-text);
}

.level-sub {
  font-size: var(--site-font-0p8125);
  color: var(--site-neutral-300);
}

.level-bar-track {
  height: var(--site-size-6px);
  border-radius: var(--site-radius-9999);
  background: var(--site-neutral-600);
  overflow: hidden;
}

.level-bar-fill {
  height: var(--site-size-100pct);
  background: var(--site-accent);
  border-radius: var(--site-radius-9999);
  transition: width var(--site-motion-slow) ease;
}

/* Stats row */
.panel-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--site-space-3);
}

.pstat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--site-space-0p2);
  padding: var(--site-space-3) var(--site-space-1);
  border: 1px solid var(--site-neutral-500);
  border-radius: var(--site-radius-0p625);
  background: var(--site-accent-soft);
}

.pstat-icon {
  font-size: var(--site-font-1p25);
  opacity: 0.4;
  transition: opacity var(--site-motion-slow);
}

.pstat-icon.active {
  opacity: 1;
}

.pstat-val {
  font-size: var(--site-font-1p125);
  font-weight: 700;
  color: var(--site-accent);
  line-height: var(--site-leading-1);
}

.pstat-lbl {
  font-size: var(--site-font-0p6875);
  text-transform: uppercase;
  letter-spacing: var(--site-letter-0p04);
  color: var(--site-neutral-300);
  text-align: center;
}

/* Section */
.panel-section {
  display: flex;
  flex-direction: column;
  gap: var(--site-space-0p625);
}

.section-title {
  font-size: var(--site-font-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--site-letter-0p06);
  color: var(--site-neutral-300);
}

/* Category list */
.cat-list {
  display: flex;
  flex-direction: column;
  gap: var(--site-space-0p35);
}

.cat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--site-space-0p4) var(--site-space-0p625);
  border-radius: var(--site-radius-0p375);
  background: var(--site-neutral-700);
  font-size: var(--site-font-0p875);
}

.cat-label {
  color: var(--site-text);
}

.cat-count {
  font-weight: 700;
  color: var(--site-accent);
}

/* Badges */
.badges-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: var(--site-space-2);
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--site-space-1);
  padding: var(--site-space-0p625) var(--site-space-1);
  border: 1px solid var(--site-neutral-500);
  border-radius: var(--site-radius-0p5);
  text-align: center;
  transition: transform var(--site-motion-0p15);
}

.badge-item.earned {
  border-color: var(--site-accent);
  background: var(--site-accent-soft);
}

.badge-item.locked {
  opacity: 0.4;
}

.badge-ico {
  font-size: var(--site-font-1p5);
}

.badge-name {
  font-size: var(--site-font-0p7);
  font-weight: 600;
  color: var(--site-text);
  line-height: var(--site-leading-1p2);
}

/* Transitions */
.panel-enter-active,
.panel-leave-active {
  transition: opacity var(--site-motion-slow) ease;
}

.panel-enter-active .panel,
.panel-leave-active .panel {
  transition: transform var(--site-motion-standard) ease, opacity var(--site-motion-slow) ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

.panel-enter-from .panel {
  transform: translateY(var(--site-space-6)) scale(0.97);
  opacity: 0;
}

.panel-leave-to .panel {
  transform: translateY(var(--site-space-6)) scale(0.97);
  opacity: 0;
}

/* Toast */
.toast-wrapper {
  position: fixed;
  top: var(--site-space-6);
  right: var(--site-space-6);
  z-index: var(--site-z-toast);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: var(--site-space-3);
  padding: var(--site-space-4) var(--site-space-6);
  border: 1px solid var(--site-accent);
  border-radius: var(--site-radius-0p5);
  background: var(--site-surface-strong);
  box-shadow: 0 4px 12px var(--site-shadow-0-20);
  cursor: pointer;
  animation: toast-slide-in var(--site-motion-0p4) ease-out;
}

.toast-icon {
  font-size: var(--site-font-xl);
}

.toast-text {
  display: flex;
  flex-direction: column;
}

.toast-text strong {
  font-size: var(--site-font-0p875);
  color: var(--site-accent);
  text-transform: uppercase;
}

.toast-text span {
  font-size: var(--site-font-md);
  color: var(--site-text);
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
  animation: toast-slide-in var(--site-motion-0p4) ease-out;
}

:global(.toast-leave-active) {
  animation: toast-slide-in var(--site-motion-slow) ease-in reverse;
}
</style>
