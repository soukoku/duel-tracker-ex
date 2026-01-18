<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import DiceFace from './DiceFace.vue'

const { t } = useI18n()

export interface DiceRollResult {
  type: 'dice'
  results: number[]
  turn: number
  timestamp: string
}

const props = defineProps<{
  currentTurn: number
}>()

const emit = defineEmits<{
  result: [entry: DiceRollResult]
}>()

const maxDice = 6
const diceSides = 6
const revealDelay = 400

// Sound effect
const diceSfx = ref<HTMLAudioElement | null>(null)

onMounted(() => {
  diceSfx.value = new Audio('/assets/sfx/dice.ogg')
})

function playDiceSound(): void {
  if (diceSfx.value) {
    diceSfx.value.currentTime = 0
    diceSfx.value.play().catch(() => {})
  }
}

// State
const diceCount = ref(1)
const diceResults = ref<number[]>([])
const visibleDiceResults = ref<number[]>([])
const isRolling = ref(false)

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

async function rollDice(): Promise<void> {
  isRolling.value = true
  diceResults.value = []
  visibleDiceResults.value = []
  
  // Initial animation delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate results
  const results: number[] = []
  for (let i = 0; i < diceCount.value; i++) {
    results.push(cryptoRandomInt(diceSides) + 1)
  }
  
  diceResults.value = results
  isRolling.value = false
  
  // Reveal one by one
  for (let i = 0; i < results.length; i++) {
    await new Promise(resolve => setTimeout(resolve, revealDelay))
    playDiceSound()
    visibleDiceResults.value = results.slice(0, i + 1)
  }
  
  // Emit result
  const entry: DiceRollResult = {
    type: 'dice',
    results: results,
    turn: props.currentTurn,
    timestamp: new Date().toISOString(),
  }
  emit('result', entry)
}
</script>

<template>
  <div class="space-y-4">
    <div class="text-center">
      <p class="text-themed-secondary mb-4">
        {{ t('tools.selectDice', { max: maxDice }) }}
      </p>
      
      <!-- Dice Count Selector -->
      <div class="flex justify-center gap-2 mb-6 flex-wrap">
        <button
          v-for="n in maxDice"
          :key="n"
          @click="diceCount = n"
          class="w-12 h-12 rounded-lg font-bold text-lg transition-all"
          :class="diceCount === n 
            ? 'gradient-primary text-white shadow-lg scale-110' 
            : 'bg-themed-secondary text-themed hover:bg-themed-hover'"
        >
          {{ n }}
        </button>
      </div>

      <!-- Roll Button -->
      <button
        @click="rollDice"
        :disabled="isRolling"
        class="btn btn-primary w-full py-4 text-lg relative overflow-hidden"
      >
        <span v-if="!isRolling">🎲 {{ t('tools.roll', { count: diceCount, sides: diceSides }) }}</span>
        <span v-else class="flex items-center justify-center gap-2">
          <span class="animate-bounce">🎲</span> {{ t('tools.rolling') }}
        </span>
      </button>

      <!-- Results Display -->
      <div class="mt-6 p-4 rounded-lg bg-themed-secondary min-h-35">
        <div class="flex justify-center gap-3 mb-4 flex-wrap min-h-14 items-center">
          <!-- Placeholder slots when empty -->
          <template v-if="diceResults.length === 0 && !isRolling">
            <div
              v-for="n in diceCount"
              :key="'placeholder-' + n"
              class="dice-visual dice-placeholder"
            >
              <svg viewBox="0 0 50 50" class="w-full h-full opacity-30">
                <rect x="2" y="2" width="46" height="46" rx="8" fill="#f5f5f5" stroke="#ccc" stroke-width="2"/>
                <text x="25" y="33" text-anchor="middle" fill="#999" font-size="20" font-weight="bold">?</text>
              </svg>
            </div>
          </template>
          
          <!-- Spinning placeholders while rolling -->
          <template v-else-if="isRolling">
            <div
              v-for="n in diceCount"
              :key="'spinning-' + n"
              class="dice-visual dice-spinning"
            >
              <svg viewBox="0 0 50 50" class="w-full h-full animate-dice-roll">
                <rect x="2" y="2" width="46" height="46" rx="8" fill="#fff" stroke="#333" stroke-width="2"/>
                <circle cx="25" cy="25" r="5" fill="#333"/>
              </svg>
            </div>
          </template>
          
          <!-- Actual results -->
          <template v-else>
            <TransitionGroup
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 scale-50"
              enter-to-class="opacity-100 scale-100"
            >
              <div
                v-for="(result, index) in visibleDiceResults"
                :key="'result-' + index"
                class="dice-visual dice-revealed"
              >
                <DiceFace :value="result" />
              </div>
            </TransitionGroup>
            
            <!-- Remaining placeholders -->
            <div
              v-for="n in (diceCount - visibleDiceResults.length)"
              :key="'remaining-' + n"
              class="dice-visual dice-placeholder"
            >
              <svg viewBox="0 0 50 50" class="w-full h-full opacity-30">
                <rect x="2" y="2" width="46" height="46" rx="8" fill="#f5f5f5" stroke="#ccc" stroke-width="2"/>
                <text x="25" y="33" text-anchor="middle" fill="#999" font-size="20" font-weight="bold">?</text>
              </svg>
            </div>
          </template>
        </div>
        
        <!-- Summary -->
        <div class="text-center text-themed-secondary h-7">
          <template v-if="visibleDiceResults.length === diceResults.length && diceResults.length > 0">
            <span class="font-medium">{{ t('tools.total') }}:</span> 
            <span class="text-xl font-bold text-themed-primary ml-2">
              {{ diceResults.reduce((a, b) => a + b, 0) }}
            </span>
          </template>
          <template v-else-if="isRolling || visibleDiceResults.length < diceResults.length">
            <span class="opacity-50">{{ t('tools.revealingResults') }}</span>
          </template>
        </div>
      </div>
    </div>
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

.dice-spinning {
  background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-hover));
  border: 2px solid var(--color-border);
  border-radius: var(--radius-medium);
}

.dice-revealed {
  background: transparent;
}

@keyframes roll-dice {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.1); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

.animate-dice-roll {
  animation: roll-dice 0.3s ease-in-out infinite;
  display: inline-block;
}

:global(.theme-shadow-realm) .dice-revealed {
  animation: shadow-dice 3s ease-in-out infinite;
}

@keyframes shadow-dice {
  0%, 100% { box-shadow: var(--shadow-card); }
  50% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.5); }
}
</style>
