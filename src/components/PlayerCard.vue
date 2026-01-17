<template>
  <div class="player-card gradient-border" :class="playerColorClass">
    <!-- Player Name -->
    <div class="w-full flex items-center justify-center gap-2">
      <input
        v-if="isEditingName"
        ref="nameInput"
        v-model="localName"
        @blur="saveName"
        @keyup.enter="saveName"
        class="input text-center text-lg font-semibold max-w-[200px]"
      />
      <h3
        v-else
        @click="startEditingName"
        class="text-lg sm:text-xl font-bold cursor-pointer hover:opacity-75 transition-opacity"
      >
        {{ player.name }}
        <span class="text-xs opacity-50 ml-1">✏️</span>
      </h3>
    </div>

    <!-- Life Points Display -->
    <div class="relative">
      <div 
        class="life-points tabular-nums transition-all duration-300"
        :class="{ 
          'animate-pulse text-red-500': player.lifePoints <= player.startingLP * 0.25 && !isAnimatingLP,
          'lp-animating': isAnimatingLP
        }"
      >
        {{ displayedLP.toLocaleString() }}
      </div>
      
      <!-- LP Progress Bar -->
      <div class="w-full h-2 bg-themed-secondary rounded-full mt-2 overflow-hidden">
        <div 
          class="h-full rounded-full transition-all duration-500 ease-out"
          :class="progressBarClass"
          :style="{ width: `${lpPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Quick Adjust Buttons -->
    <div class="grid grid-cols-4 gap-2 w-full">
      <button @click="adjustLP(-1000)" class="btn btn-danger text-sm py-2">-1000</button>
      <button @click="adjustLP(-500)" class="btn btn-danger text-sm py-2">-500</button>
      <button @click="adjustLP(-100)" class="btn btn-danger text-sm py-2">-100</button>
      <button @click="halveLP" class="btn btn-danger text-sm py-2">½</button>
      
      <button @click="adjustLP(1000)" class="btn btn-success text-sm py-2">+1000</button>
      <button @click="adjustLP(500)" class="btn btn-success text-sm py-2">+500</button>
      <button @click="adjustLP(100)" class="btn btn-success text-sm py-2">+100</button>
      <button @click="showCalculator = !showCalculator" class="btn btn-secondary text-sm py-2">
        {{ showCalculator ? '✕' : '±' }}
      </button>
    </div>

    <!-- Calculator Panel -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-48"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-48"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showCalculator" class="w-full overflow-hidden">
        <div class="flex gap-2 mb-2">
          <input
            v-model.number="customAmount"
            type="number"
            placeholder="Amount"
            class="input flex-1"
            min="0"
          />
        </div>
        <div class="flex gap-2">
          <button 
            @click="applyCustomAmount(-1)" 
            class="btn btn-danger flex-1"
            :disabled="!customAmount"
          >
            Subtract
          </button>
          <button 
            @click="applyCustomAmount(1)" 
            class="btn btn-success flex-1"
            :disabled="!customAmount"
          >
            Add
          </button>
          <button 
            @click="setExactLP" 
            class="btn btn-secondary flex-1"
            :disabled="!customAmount && customAmount !== 0"
          >
            Set
          </button>
        </div>
      </div>
    </transition>

    <!-- History Toggle -->
    <button 
      @click="showHistory = !showHistory"
      class="text-sm text-themed-muted hover:text-themed transition-colors"
    >
      {{ showHistory ? 'Hide' : 'Show' }} History ({{ player.history.length }})
    </button>

    <!-- History Panel -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-40"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-40"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showHistory" class="w-full overflow-hidden">
        <div class="max-h-32 overflow-y-auto space-y-1 text-sm">
          <div 
            v-for="(entry, index) in reversedHistory" 
            :key="index"
            class="flex justify-between items-center py-1 px-2 rounded bg-themed-secondary"
          >
            <span class="text-themed-muted">T{{ entry.turn }}</span>
            <span :class="entry.change >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ entry.change >= 0 ? '+' : '' }}{{ entry.change.toLocaleString() }}
            </span>
            <span class="text-themed">{{ entry.newLP.toLocaleString() }}</span>
          </div>
          <div v-if="player.history.length === 0" class="text-center text-themed-muted py-2">
            No changes yet
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import type { Player, HistoryEntry } from '../composables/useGame'

const props = defineProps<{
  player: Player
  playerIndex?: number
}>()

const emit = defineEmits<{
  'update-lp': [playerId: number, amount: number]
  'set-lp': [playerId: number, newLP: number]
  'update-name': [playerId: number, newName: string]
  'halve-lp': [playerId: number]
}>()

// Sound effects
const lifeChangeSfx = ref<HTMLAudioElement | null>(null)
const lifeZeroSfx = ref<HTMLAudioElement | null>(null)

// LP animation state
const isAnimatingLP = ref(false)
const displayedLP = ref(props.player.lifePoints)
const previousLP = ref(props.player.lifePoints)
let animationFrameId: number | null = null

onMounted(() => {
  lifeChangeSfx.value = new Audio('/assets/sfx/life-change.ogg')
  lifeZeroSfx.value = new Audio('/assets/sfx/life-zero.ogg')
  displayedLP.value = props.player.lifePoints
  previousLP.value = props.player.lifePoints
})

// Watch for LP changes and trigger animation
watch(() => props.player.lifePoints, (newLP, oldLP) => {
  if (newLP !== oldLP) {
    animateLPChange(oldLP, newLP)
  }
})

function animateLPChange(fromLP: number, toLP: number): void {
  // Cancel any ongoing animation
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
  
  isAnimatingLP.value = true
  previousLP.value = fromLP
  
  // Determine which sound to play
  const willBeZero = toLP <= 0
  const sfx = willBeZero ? lifeZeroSfx.value : lifeChangeSfx.value
  
  if (sfx) {
    sfx.currentTime = 0
    sfx.play().catch(() => {})
  }
  
  // Calculate animation duration based on sound
  // life-change.ogg is typically ~1 second, life-zero.ogg may be longer
  const animationDuration = willBeZero ? 1500 : 1000
  const startTime = performance.now()
  
  // Animation loop - show jumping random numbers
  function animate(currentTime: number): void {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / animationDuration, 1)
    
    if (progress < 1) {
      // Generate random jumping number between previous and target
      // with progressively narrowing range as we approach the end
      const range = Math.abs(toLP - fromLP)
      const jitter = range * (1 - progress) * 0.3 // Reduce jitter as progress increases
      const baseValue = fromLP + (toLP - fromLP) * progress
      
      // Add random jitter, but keep it reasonable
      const randomOffset = (Math.random() - 0.5) * 2 * jitter
      displayedLP.value = Math.max(0, Math.round(baseValue + randomOffset))
      
      animationFrameId = requestAnimationFrame(animate)
    } else {
      // Animation complete - settle to final value
      displayedLP.value = toLP
      isAnimatingLP.value = false
      animationFrameId = null
    }
  }
  
  animationFrameId = requestAnimationFrame(animate)
}

// UI state
const showCalculator = ref(false)
const showHistory = ref(false)
const customAmount = ref<number | null>(null)
const isEditingName = ref(false)
const localName = ref(props.player.name)
const nameInput = ref<HTMLInputElement | null>(null)

const lpPercentage = computed((): number => {
  return Math.max(0, (props.player.lifePoints / props.player.startingLP) * 100)
})

const reversedHistory = computed((): HistoryEntry[] => {
  return [...props.player.history].reverse()
})

const playerColorClass = computed((): string => {
  const colors = [
    'player-1',
    'player-2',
    'player-3',
    'player-4',
  ]
  return colors[(props.playerIndex ?? 0) % colors.length]
})

const textColorClass = computed((): string => {
  // The player-1, player-2, etc classes handle the text color via CSS
  return ''
})

const progressBarClass = computed((): string => {
  if (lpPercentage.value > 50) return 'bg-gradient-to-r from-green-400 to-green-500'
  if (lpPercentage.value > 25) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  return 'bg-gradient-to-r from-red-400 to-red-500'
})

function adjustLP(amount: number): void {
  emit('update-lp', props.player.id, amount)
}

function halveLP(): void {
  emit('halve-lp', props.player.id)
}

function applyCustomAmount(multiplier: number): void {
  if (customAmount.value) {
    emit('update-lp', props.player.id, customAmount.value * multiplier)
    customAmount.value = null
  }
}

function setExactLP(): void {
  if (customAmount.value !== null) {
    emit('set-lp', props.player.id, customAmount.value)
    customAmount.value = null
  }
}

function startEditingName(): void {
  localName.value = props.player.name
  isEditingName.value = true
  nextTick(() => {
    nameInput.value?.focus()
    nameInput.value?.select()
  })
}

function saveName(): void {
  if (localName.value.trim()) {
    emit('update-name', props.player.id, localName.value.trim())
  }
  isEditingName.value = false
}
</script>

<style scoped>
/* LP Animation Effect */
.lp-animating {
  animation: lp-shake 0.1s ease-in-out infinite;
}

@keyframes lp-shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px) scale(1.02);
  }
  75% {
    transform: translateX(2px) scale(0.98);
  }
}

/* Add glow effect during animation */
.life-points.lp-animating {
  filter: drop-shadow(0 0 8px var(--glow-color));
}
</style>