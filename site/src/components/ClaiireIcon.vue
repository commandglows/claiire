<script setup lang="ts">
import { computed } from 'vue';
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Check,
  CircleCheck,
  CircleQuestionMark,
  Flame,
  Footprints,
  GraduationCap,
  Heart,
  Leaf,
  Medal,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  Trophy,
  UserRound,
  Users,
  X,
  Zap,
  type LucideIcon,
} from '@lucide/vue';

const icons = {
  activity: Activity,
  arrowRight: ArrowRight,
  award: Award,
  book: BookOpen,
  brain: Brain,
  check: Check,
  checkCircle: CircleCheck,
  close: X,
  flame: Flame,
  footprints: Footprints,
  graduation: GraduationCap,
  heart: Heart,
  leaf: Leaf,
  medal: Medal,
  moon: Moon,
  question: CircleQuestionMark,
  search: Search,
  shield: ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  target: Target,
  trophy: Trophy,
  user: UserRound,
  users: Users,
  zap: Zap,
} satisfies Record<string, LucideIcon>;

export type ClaiireIconName = keyof typeof icons;

const legacyIcons: Record<string, ClaiireIconName> = {
  '⚡': 'zap',
  '🔥': 'flame',
  '🏆': 'trophy',
  '🎖️': 'medal',
  '👣': 'footprints',
  '🔍': 'search',
  '📖': 'book',
  '🎓': 'graduation',
  '🧠': 'brain',
  '🌱': 'leaf',
  '💎': 'award',
  '⭐': 'star',
  '🌟': 'star',
  '🎯': 'target',
  '✅': 'checkCircle',
  '🛡️': 'shield',
  '❤️': 'heart',
};

const props = withDefaults(defineProps<{
  name: ClaiireIconName | string;
  size?: number | string;
  strokeWidth?: number;
  label?: string;
}>(), {
  size: 24,
  strokeWidth: 2,
  label: undefined,
});

const icon = computed(() => icons[(props.name in icons ? props.name : legacyIcons[props.name] ?? 'award') as ClaiireIconName]);
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :stroke-width="strokeWidth"
    :aria-hidden="label ? undefined : true"
    :aria-label="label"
  />
</template>
