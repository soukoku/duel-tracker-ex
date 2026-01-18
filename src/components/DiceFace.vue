<script setup lang="ts">
import { ref, onMounted } from 'vue'

const modelValue = defineModel<number>('modelValue')

const diceSfx = ref<HTMLAudioElement>()
const isRolling = ref(false)

onMounted(() => {
  diceSfx.value = new Audio('/assets/sfx/dice.ogg')
})

// Cryptographically secure random
function cryptoRandomInt(max: number): number {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const maxValid = Math.floor(0xFFFFFFFF / max) * max
  let value = array[0]!
  while (value >= maxValid) {
    crypto.getRandomValues(array)
    value = array[0]!
  }
  return value % max
}

async function roll() {
  isRolling.value = true
  // Play sound
  if (diceSfx.value) {
    diceSfx.value.currentTime = 0
    diceSfx.value.play().catch(() => { })
  }

  // Animate for 500ms
  await new Promise(resolve => setTimeout(resolve, 500))

  // Determine result (1-6)
  isRolling.value = false
  modelValue.value = cryptoRandomInt(6) + 1
}

defineExpose({ roll })
</script>

<template>
  <div class="dice-visual" :class="{
    'dice-placeholder': !modelValue && !isRolling,
    'dice-revealed': modelValue
  }">
    <!-- Rolling animation -->
    <svg v-if="!modelValue && isRolling" viewBox="0 0 50 50" class="w-full h-full animate-dice-roll">
      <rect x="2" y="2" width="46" height="46" rx="8" class="dice-body" />
      <circle cx="25" cy="25" r="5" class="dice-dot" />
    </svg>

    <!-- Placeholder -->
    <svg v-else-if="!modelValue" viewBox="0 0 50 50" class="w-full h-full opacity-30">
      <rect x="2" y="2" width="46" height="46" rx="8" fill="#f5f5f5" stroke="#ccc" stroke-width="2" />
      <text x="25" y="33" text-anchor="middle" fill="#999" font-size="20" font-weight="bold">?</text>
    </svg>

    <!-- Result -->
    <svg v-else viewBox="0 0 50 50" class="w-full h-full dice-face">
      <!-- Dice body -->
      <rect x="2" y="2" width="46" height="46" rx="8" class="dice-body" />

      <!-- Dots based on value -->
      <!-- Value 1: Center dot (red) -->
      <template v-if="modelValue === 1">
        <circle cx="25" cy="25" r="5" class="dice-dot-red" />
      </template>

      <!-- Value 2: Top-right and bottom-left -->
      <template v-else-if="modelValue === 2">
        <circle cx="36" cy="14" r="4" class="dice-dot" />
        <circle cx="14" cy="36" r="4" class="dice-dot" />
      </template>

      <!-- Value 3: Diagonal + center -->
      <template v-else-if="modelValue === 3">
        <circle cx="36" cy="14" r="4" class="dice-dot" />
        <circle cx="25" cy="25" r="4" class="dice-dot" />
        <circle cx="14" cy="36" r="4" class="dice-dot" />
      </template>

      <!-- Value 4: Four corners -->
      <template v-else-if="modelValue === 4">
        <circle cx="14" cy="14" r="4" class="dice-dot" />
        <circle cx="36" cy="14" r="4" class="dice-dot" />
        <circle cx="14" cy="36" r="4" class="dice-dot" />
        <circle cx="36" cy="36" r="4" class="dice-dot" />
      </template>

      <!-- Value 5: Four corners + center -->
      <template v-else-if="modelValue === 5">
        <circle cx="14" cy="14" r="4" class="dice-dot" />
        <circle cx="36" cy="14" r="4" class="dice-dot" />
        <circle cx="25" cy="25" r="4" class="dice-dot" />
        <circle cx="14" cy="36" r="4" class="dice-dot" />
        <circle cx="36" cy="36" r="4" class="dice-dot" />
      </template>

      <!-- Value 6: Two columns of three -->
      <template v-else-if="modelValue === 6">
        <circle cx="14" cy="12" r="4" class="dice-dot" />
        <circle cx="14" cy="25" r="4" class="dice-dot" />
        <circle cx="14" cy="38" r="4" class="dice-dot" />
        <circle cx="36" cy="12" r="4" class="dice-dot" />
        <circle cx="36" cy="25" r="4" class="dice-dot" />
        <circle cx="36" cy="38" r="4" class="dice-dot" />
      </template>
    </svg>
  </div>
</template>

<style scoped>
.dice-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  transition: all 0.3s ease;
}

.dice-placeholder {
  background: var(--color-bg-hover);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-medium);
}

.dice-revealed {
  background: transparent;
}

:global(.theme-shadow-realm) .dice-revealed {
  animation: shadow-dice 3s ease-in-out infinite;
}

@keyframes shadow-dice {

  0%,
  100% {
    box-shadow: var(--shadow-card);
  }

  50% {
    box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
  }
}

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

@keyframes roll-dice {
  0% {
    transform: rotate(0deg) scale(1);
  }

  25% {
    transform: rotate(90deg) scale(1.1);
  }

  50% {
    transform: rotate(180deg) scale(1);
  }

  75% {
    transform: rotate(270deg) scale(1.1);
  }

  100% {
    transform: rotate(360deg) scale(1);
  }
}

.animate-dice-roll {
  animation: roll-dice 0.3s ease-in-out infinite;
  display: inline-block;
}
</style>
