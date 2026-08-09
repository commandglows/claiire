<script setup lang="ts">
import type { Badge } from '@diane-winflowz/gamification'
import ClaiireIcon from './ClaiireIcon.vue'

defineProps<{
  badge: Badge
  earned: boolean
}>()
</script>

<template>
  <div class="badge-card" :class="{ earned, locked: !earned }">
    <div class="badge-icon-wrap">
      <span class="badge-icon"><ClaiireIcon :name="earned ? badge.icon : 'question'" :size="36" /></span>
    </div>
    <div class="badge-info">
      <span class="badge-name">{{ badge.name }}</span>
      <span v-if="earned" class="badge-desc">{{ badge.description }}</span>
      <span v-else class="badge-locked">???</span>
    </div>
  </div>
</template>

<style scoped>
.badge-card {
  display: flex;
  align-items: center;
  gap: var(--site-space-3);
  padding: var(--site-space-3) var(--site-space-4);
  border: 1px solid var(--sl-color-gray-5);
  border-radius: var(--site-radius-0p5);
  background: var(--sl-color-bg);
  transition: transform var(--site-motion-0p2), box-shadow var(--site-motion-0p2);
}

.badge-card:hover {
  transform: translateY(calc(var(--site-size-2px) * -1));
  box-shadow: var(--shadow-soft);
}

.badge-card.locked {
  opacity: 0.5;
}

.badge-card.earned {
  border-color: var(--sl-color-accent);
  background: var(--sl-color-accent-low);
}

.badge-icon-wrap {
  font-size: var(--site-font-2p25);
  flex-shrink: 0;
}

.badge-info {
  display: flex;
  flex-direction: column;
  gap: var(--site-space-0p1);
}

.badge-name {
  font-weight: 600;
  font-size: var(--site-font-0p9375);
  color: var(--sl-color-text);
}

.badge-desc {
  font-size: var(--site-font-0p8125);
  color: var(--sl-color-text);
  opacity: 0.8;
}

.badge-locked {
  font-size: var(--site-font-0p8125);
  opacity: 0.5;
  font-style: italic;
  color: var(--sl-color-gray-3);
}
</style>
