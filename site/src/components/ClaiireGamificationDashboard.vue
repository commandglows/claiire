<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGamification, fireBadgeConfetti } from '@diane-winflowz/gamification'
import type { Badge } from '@diane-winflowz/gamification'
import { createClaiireConfig } from '../gamification/config'
import ClaiireBadgeCard from './ClaiireBadgeCard.vue'
import ClaiireIcon from './ClaiireIcon.vue'

const mounted = ref(false)

const config = createClaiireConfig()
config.onBadgeEarned = (badge: Badge) => {
  fireBadgeConfetti()
}

const { reader, streak, badges, progress } = useGamification(config)

const allBadges = computed(() => [...badges.earned.value, ...badges.unearned.value])

onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <div v-if="mounted" class="dashboard">
    <!-- Streak -->
    <section class="dashboard-section">
      <h3 class="section-title">Série de lecture</h3>
      <div class="streak-card">
        <span class="streak-fire" :class="{ active: streak.isActive.value }"><ClaiireIcon name="flame" :size="40" /></span>
        <div class="streak-info">
          <span class="streak-current">{{ streak.currentStreak.value }} jour{{ streak.currentStreak.value > 1 ? 's' : '' }}</span>
          <span class="streak-best">Record : {{ streak.longestStreak.value }} jour{{ streak.longestStreak.value > 1 ? 's' : '' }}</span>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="dashboard-section">
      <h3 class="section-title">Statistiques</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ reader.totalRead.value }}</span>
          <span class="stat-label">Pages lues</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ badges.earned.value.length }}</span>
          <span class="stat-label">Badges</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ progress.overall.value.percent }}%</span>
          <span class="stat-label">Progression</span>
        </div>
      </div>
    </section>

    <!-- Badges -->
    <section class="dashboard-section">
      <h3 class="section-title">
        Badges ({{ badges.earned.value.length }} / {{ allBadges.length }})
      </h3>
      <div class="badges-grid">
        <ClaiireBadgeCard
          v-for="badge in allBadges"
          :key="badge.id"
          :badge="badge"
          :earned="badges.earned.value.some((b) => b.id === badge.id)"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--site-space-6);
}

.dashboard-section {
  padding: var(--site-space-5);
  border: 1px solid var(--site-neutral-500);
  border-radius: var(--site-radius-0p5);
  background: var(--site-surface-strong);
}

.section-title {
  font-size: var(--site-font-1p125);
  font-weight: 600;
  margin: 0 0 var(--site-space-4);
  padding-bottom: var(--site-space-2);
  border-bottom: 1px solid var(--site-neutral-600);
  color: var(--site-text);
}

/* Streak */
.streak-card {
  display: flex;
  align-items: center;
  gap: var(--site-space-4);
}

.streak-fire {
  font-size: var(--site-font-2p5);
  opacity: 0.3;
  transition: opacity var(--site-motion-slow);
}

.streak-fire.active {
  opacity: 1;
}

.streak-info {
  display: flex;
  flex-direction: column;
}

.streak-current {
  font-size: var(--site-font-1p25);
  font-weight: 700;
  color: var(--site-text);
}

.streak-best {
  font-size: var(--site-font-0p8125);
  color: var(--site-neutral-300);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--site-space-3);
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--site-space-3);
  border: 1px solid var(--site-neutral-500);
  border-radius: var(--site-radius-0p375);
  background: var(--site-accent-soft);
}

.stat-value {
  font-size: var(--site-font-1p25);
  font-weight: 700;
  color: var(--site-accent);
}

.stat-label {
  font-size: var(--site-font-0p6875);
  text-transform: uppercase;
  color: var(--site-neutral-300);
}

/* Badges */
.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--site-space-3);
}
</style>
