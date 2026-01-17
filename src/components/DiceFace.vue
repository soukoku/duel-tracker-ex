<template>
  <svg viewBox="0 0 50 50" class="w-full h-full dice-face">
    <!-- Dice body -->
    <rect x="2" y="2" width="46" height="46" rx="8" class="dice-body"/>
    
    <!-- Dots based on value -->
    <!-- Value 1: Center dot (red) -->
    <template v-if="value === 1">
      <circle cx="25" cy="25" r="5" class="dice-dot-red"/>
    </template>
    
    <!-- Value 2: Top-right and bottom-left -->
    <template v-else-if="value === 2">
      <circle cx="36" cy="14" r="4" class="dice-dot"/>
      <circle cx="14" cy="36" r="4" class="dice-dot"/>
    </template>
    
    <!-- Value 3: Diagonal + center -->
    <template v-else-if="value === 3">
      <circle cx="36" cy="14" r="4" class="dice-dot"/>
      <circle cx="25" cy="25" r="4" class="dice-dot"/>
      <circle cx="14" cy="36" r="4" class="dice-dot"/>
    </template>
    
    <!-- Value 4: Four corners -->
    <template v-else-if="value === 4">
      <circle cx="14" cy="14" r="4" class="dice-dot"/>
      <circle cx="36" cy="14" r="4" class="dice-dot"/>
      <circle cx="14" cy="36" r="4" class="dice-dot"/>
      <circle cx="36" cy="36" r="4" class="dice-dot"/>
    </template>
    
    <!-- Value 5: Four corners + center -->
    <template v-else-if="value === 5">
      <circle cx="14" cy="14" r="4" class="dice-dot"/>
      <circle cx="36" cy="14" r="4" class="dice-dot"/>
      <circle cx="25" cy="25" r="4" class="dice-dot"/>
      <circle cx="14" cy="36" r="4" class="dice-dot"/>
      <circle cx="36" cy="36" r="4" class="dice-dot"/>
    </template>
    
    <!-- Value 6: Two columns of three -->
    <template v-else-if="value === 6">
      <circle cx="14" cy="12" r="4" class="dice-dot"/>
      <circle cx="14" cy="25" r="4" class="dice-dot"/>
      <circle cx="14" cy="38" r="4" class="dice-dot"/>
      <circle cx="36" cy="12" r="4" class="dice-dot"/>
      <circle cx="36" cy="25" r="4" class="dice-dot"/>
      <circle cx="36" cy="38" r="4" class="dice-dot"/>
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  value: number
}>()
</script>

<style scoped>
.dice-face {
  filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.3));
}

.dice-body {
  fill: #FFFEF5;
  stroke: #2D2D2D;
  stroke-width: 2;
}

.dice-dot {
  fill: #1A1A1A;
}

.dice-dot-red {
  fill: #C41E3A;
}

/* Theme variations */
:global(.theme-egyptian) .dice-body {
  fill: #FFF8E7;
  stroke: #8B7355;
}

:global(.theme-egyptian) .dice-dot {
  fill: #1E3A5F;
}

:global(.theme-egyptian) .dice-dot-red {
  fill: #9B2C2C;
}

:global(.theme-shadow-realm) .dice-body {
  fill: #F0E8FF;
  stroke: #4A0E4E;
}

:global(.theme-shadow-realm) .dice-dot {
  fill: #1A1A2E;
}

:global(.theme-shadow-realm) .dice-dot-red {
  fill: #9333EA;
}

:global(.dark) .dice-body {
  fill: #2A2A3A;
  stroke: #555;
}

:global(.dark) .dice-dot {
  fill: #F0F0F0;
}

:global(.dark) .dice-dot-red {
  fill: #EF4444;
}
</style>
