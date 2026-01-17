<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Dialog -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-90 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-90 translate-y-4"
        >
          <div
            v-if="isOpen"
            class="relative card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            style="background-color: var(--color-bg-card);"
          >
            <!-- Close Button -->
            <button
              @click="$emit('close')"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-themed-muted hover:text-themed hover:bg-themed-secondary transition-colors"
            >
              ✕
            </button>

            <!-- Title -->
            <h2 class="text-xl font-bold text-themed mb-6 pr-8">
              🎲 Duel Tools
            </h2>

            <!-- Tool Tabs -->
            <div class="flex gap-2 mb-6">
              <button
                v-for="tool in tools"
                :key="tool.id"
                @click="activeTool = tool.id as 'coin' | 'dice'"
                class="flex-1 px-4 py-2 rounded-lg font-medium transition-all"
                :class="activeTool === tool.id 
                  ? 'gradient-primary text-white shadow-lg' 
                  : 'bg-themed-secondary text-themed-secondary hover:bg-themed-hover'"
              >
                {{ tool.icon }} {{ tool.name }}
              </button>
            </div>

            <!-- Coin Flip Tool -->
            <div v-if="activeTool === 'coin'" class="space-y-4">
              <div class="text-center">
                <p class="text-themed-secondary mb-4">
                  Select how many coins to flip (max {{ maxCoins }})
                </p>
                
                <!-- Coin Count Selector -->
                <div class="flex justify-center gap-2 mb-6">
                  <button
                    v-for="n in maxCoins"
                    :key="n"
                    @click="coinCount = n"
                    class="w-12 h-12 rounded-lg font-bold text-lg transition-all"
                    :class="coinCount === n 
                      ? 'gradient-primary text-white shadow-lg scale-110' 
                      : 'bg-themed-secondary text-themed hover:bg-themed-hover'"
                  >
                    {{ n }}
                  </button>
                </div>

                <!-- Flip Button -->
                <button
                  @click="flipCoins"
                  :disabled="isFlipping"
                  class="btn btn-primary w-full py-4 text-lg relative overflow-hidden"
                >
                  <span v-if="!isFlipping">🪙 Flip {{ coinCount }} Coin{{ coinCount > 1 ? 's' : '' }}</span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <span class="animate-spin">🪙</span> Flipping...
                  </span>
                </button>

                <!-- Results Display - Always visible -->
                <div class="mt-6 p-4 rounded-lg bg-themed-secondary min-h-[140px]">
                  <div class="flex justify-center gap-4 mb-4 min-h-[72px] items-center">
                    <!-- Placeholder slots when empty -->
                    <template v-if="coinResults.length === 0 && !isFlipping">
                      <div
                        v-for="n in coinCount"
                        :key="'placeholder-' + n"
                        class="coin-result coin-placeholder"
                      >
                        <span class="text-3xl opacity-30">🪙</span>
                        <span class="text-xs font-bold mt-1 opacity-30">?</span>
                      </div>
                    </template>
                    
                    <!-- Spinning placeholders while flipping -->
                    <template v-else-if="isFlipping">
                      <div
                        v-for="n in coinCount"
                        :key="'spinning-' + n"
                        class="coin-result coin-spinning"
                      >
                        <span class="text-3xl animate-flip">🪙</span>
                      </div>
                    </template>
                    
                    <!-- Actual results -->
                    <template v-else>
                      <TransitionGroup
                        enter-active-class="transition-all duration-300 ease-out"
                        enter-from-class="opacity-0 scale-50 rotate-180"
                        enter-to-class="opacity-100 scale-100 rotate-0"
                      >
                        <div
                          v-for="(result, index) in visibleCoinResults"
                          :key="'result-' + index"
                          class="coin-result"
                          :class="result === 'heads' ? 'coin-heads' : 'coin-tails'"
                        >
                          <span class="text-3xl">{{ result === 'heads' ? '👑' : '🦅' }}</span>
                          <span class="text-xs font-bold mt-1 uppercase">{{ result }}</span>
                        </div>
                      </TransitionGroup>
                      
                      <!-- Remaining placeholders -->
                      <div
                        v-for="n in (coinCount - visibleCoinResults.length)"
                        :key="'remaining-' + n"
                        class="coin-result coin-placeholder"
                      >
                        <span class="text-3xl opacity-30">🪙</span>
                        <span class="text-xs font-bold mt-1 opacity-30">?</span>
                      </div>
                    </template>
                  </div>
                  
                  <!-- Summary - show when all results revealed -->
                  <div class="text-center text-themed-secondary text-sm h-5">
                    <template v-if="visibleCoinResults.length === coinResults.length && coinResults.length > 0">
                      <span class="font-medium">Heads:</span> {{ coinResults.filter(r => r === 'heads').length }}
                      <span class="mx-2">|</span>
                      <span class="font-medium">Tails:</span> {{ coinResults.filter(r => r === 'tails').length }}
                    </template>
                    <template v-else-if="isFlipping || visibleCoinResults.length < coinResults.length">
                      <span class="opacity-50">Revealing results...</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dice Roll Tool -->
            <div v-if="activeTool === 'dice'" class="space-y-4">
              <div class="text-center">
                <p class="text-themed-secondary mb-4">
                  Select how many dice to roll (max {{ maxDice }})
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
                  <span v-if="!isRolling">🎲 Roll {{ diceCount }} D{{ diceSides }}</span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <span class="animate-bounce">🎲</span> Rolling...
                  </span>
                </button>

                <!-- Results Display - Always visible -->
                <div class="mt-6 p-4 rounded-lg bg-themed-secondary min-h-[140px]">
                  <div class="flex justify-center gap-3 mb-4 flex-wrap min-h-[56px] items-center">
                    <!-- Placeholder slots when empty -->
                    <template v-if="diceResults.length === 0 && !isRolling">
                      <div
                        v-for="n in diceCount"
                        :key="'placeholder-' + n"
                        class="dice-result dice-placeholder"
                      >
                        <span class="text-2xl opacity-30">🎲</span>
                        <span class="text-lg font-bold opacity-30">?</span>
                      </div>
                    </template>
                    
                    <!-- Spinning placeholders while rolling -->
                    <template v-else-if="isRolling">
                      <div
                        v-for="n in diceCount"
                        :key="'spinning-' + n"
                        class="dice-result dice-spinning"
                      >
                        <span class="text-2xl animate-dice-roll">🎲</span>
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
                          class="dice-result dice-revealed"
                        >
                          <span class="text-2xl">{{ getDiceEmoji(result) }}</span>
                          <span class="text-lg font-bold">{{ result }}</span>
                        </div>
                      </TransitionGroup>
                      
                      <!-- Remaining placeholders -->
                      <div
                        v-for="n in (diceCount - visibleDiceResults.length)"
                        :key="'remaining-' + n"
                        class="dice-result dice-placeholder"
                      >
                        <span class="text-2xl opacity-30">🎲</span>
                        <span class="text-lg font-bold opacity-30">?</span>
                      </div>
                    </template>
                  </div>
                  
                  <!-- Summary - show when all results revealed -->
                  <div class="text-center text-themed-secondary h-7">
                    <template v-if="visibleDiceResults.length === diceResults.length && diceResults.length > 0">
                      <span class="font-medium">Total:</span> 
                      <span class="text-xl font-bold text-themed-primary ml-2">
                        {{ diceResults.reduce((a, b) => a + b, 0) }}
                      </span>
                    </template>
                    <template v-else-if="isRolling || visibleDiceResults.length < diceResults.length">
                      <span class="opacity-50">Revealing results...</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- History Section -->
            <div v-if="toolHistory.length > 0" class="mt-6 pt-6 border-t border-themed">
              <button
                @click="showHistory = !showHistory"
                class="flex items-center justify-between w-full text-left text-themed-secondary hover:text-themed transition-colors"
              >
                <span class="font-medium">📜 Recent Results ({{ toolHistory.length }})</span>
                <span class="transform transition-transform" :class="{ 'rotate-180': showHistory }">▼</span>
              </button>
              
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-60"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-60"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-if="showHistory" class="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  <div
                    v-for="(entry, index) in reversedHistory"
                    :key="index"
                    class="flex items-center justify-between p-2 rounded-lg bg-themed-secondary text-sm"
                  >
                    <div class="flex items-center gap-2">
                      <span>{{ entry.type === 'coin' ? '🪙' : '🎲' }}</span>
                      <span class="text-themed-muted">Turn {{ entry.turn }}</span>
                    </div>
                    <div class="font-medium text-themed">
                      {{ formatHistoryResult(entry) }}
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'

export interface ToolHistoryEntry {
  type: 'coin' | 'dice'
  results: (string | number)[]
  turn: number
  timestamp: string
}

const props = defineProps<{
  isOpen: boolean
  currentTurn: number
}>()

const emit = defineEmits<{
  close: []
  result: [entry: ToolHistoryEntry]
}>()

// Tool configuration
const tools = [
  { id: 'coin', name: 'Coins', icon: '🪙' },
  { id: 'dice', name: 'Dice', icon: '🎲' },
]

const activeTool = ref<'coin' | 'dice'>('coin')
const maxCoins = 3
const maxDice = 6
const diceSides = 6

// Sound effects
const coinSfx = ref<HTMLAudioElement | null>(null)
const diceSfx = ref<HTMLAudioElement | null>(null)

onMounted(() => {
  coinSfx.value = new Audio('/assets/sfx/coin.ogg')
  diceSfx.value = new Audio('/assets/sfx/dice.ogg')
})

function playCoinSound(): void {
  if (coinSfx.value) {
    coinSfx.value.currentTime = 0
    coinSfx.value.play().catch(() => {})
  }
}

function playDiceSound(): void {
  if (diceSfx.value) {
    diceSfx.value.currentTime = 0
    diceSfx.value.play().catch(() => {})
  }
}

// Coin flip state
const coinCount = ref(1)
const coinResults = ref<('heads' | 'tails')[]>([])
const visibleCoinResults = ref<('heads' | 'tails')[]>([])
const isFlipping = ref(false)

// Dice roll state
const diceCount = ref(1)
const diceResults = ref<number[]>([])
const visibleDiceResults = ref<number[]>([])
const isRolling = ref(false)

// History
const toolHistory = useStorage<ToolHistoryEntry[]>('duel-tracker-tool-history', [])
const showHistory = ref(false)

const reversedHistory = computed(() => [...toolHistory.value].reverse().slice(0, 20))

// Sequential reveal delay in ms
const revealDelay = 400

// Coin flip logic with sequential reveal
async function flipCoins(): Promise<void> {
  isFlipping.value = true
  coinResults.value = []
  visibleCoinResults.value = []
  
  // Initial animation delay
  await new Promise(resolve => setTimeout(resolve, 600))
  
  // Generate all results
  const results: ('heads' | 'tails')[] = []
  for (let i = 0; i < coinCount.value; i++) {
    results.push(Math.random() < 0.5 ? 'heads' : 'tails')
  }
  
  coinResults.value = results
  isFlipping.value = false
  
  // Reveal results one by one
  for (let i = 0; i < results.length; i++) {
    await new Promise(resolve => setTimeout(resolve, revealDelay))
    playCoinSound()
    visibleCoinResults.value = results.slice(0, i + 1)
  }
  
  // Record in history after all revealed
  const entry: ToolHistoryEntry = {
    type: 'coin',
    results: results,
    turn: props.currentTurn,
    timestamp: new Date().toISOString(),
  }
  toolHistory.value.push(entry)
  emit('result', entry)
}

// Dice roll logic with sequential reveal
async function rollDice(): Promise<void> {
  isRolling.value = true
  diceResults.value = []
  visibleDiceResults.value = []
  
  // Initial animation delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate all results
  const results: number[] = []
  for (let i = 0; i < diceCount.value; i++) {
    results.push(Math.floor(Math.random() * diceSides) + 1)
  }
  
  diceResults.value = results
  isRolling.value = false
  
  // Reveal results one by one
  for (let i = 0; i < results.length; i++) {
    await new Promise(resolve => setTimeout(resolve, revealDelay))
    playDiceSound()
    visibleDiceResults.value = results.slice(0, i + 1)
  }
  
  // Record in history after all revealed
  const entry: ToolHistoryEntry = {
    type: 'dice',
    results: results,
    turn: props.currentTurn,
    timestamp: new Date().toISOString(),
  }
  toolHistory.value.push(entry)
  emit('result', entry)
}

function getDiceEmoji(value: number): string {
  const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
  return diceEmojis[value - 1] || '🎲'
}

function formatHistoryResult(entry: ToolHistoryEntry): string {
  if (entry.type === 'coin') {
    const heads = (entry.results as string[]).filter(r => r === 'heads').length
    const tails = (entry.results as string[]).filter(r => r === 'tails').length
    return `${heads}H / ${tails}T`
  } else {
    const total = (entry.results as number[]).reduce((a, b) => a + b, 0)
    return `[${entry.results.join(', ')}] = ${total}`
  }
}
</script>

<style scoped>
.coin-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: var(--radius-large);
  transition: all 0.3s ease;
}

.coin-placeholder {
  background: var(--color-bg-hover);
  border: 2px dashed var(--color-border);
}

.coin-spinning {
  background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-hover));
  border: 2px solid var(--color-border);
}

.coin-heads {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1a1a2e;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.coin-tails {
  background: linear-gradient(135deg, #C0C0C0, #808080);
  color: #1a1a2e;
  box-shadow: 0 4px 15px rgba(192, 192, 192, 0.4);
}

.dice-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--radius-medium);
  transition: all 0.3s ease;
}

.dice-placeholder {
  background: var(--color-bg-hover);
  border: 2px dashed var(--color-border);
}

.dice-spinning {
  background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-hover));
  border: 2px solid var(--color-border);
}

.dice-revealed {
  background: linear-gradient(135deg, var(--color-bg-card), var(--color-bg-secondary));
  border: 2px solid var(--color-border);
  box-shadow: var(--shadow-card);
}

/* Coin flip animation */
@keyframes flip-coin {
  0% { transform: rotateY(0deg) scale(1); }
  25% { transform: rotateY(180deg) scale(1.1); }
  50% { transform: rotateY(360deg) scale(1); }
  75% { transform: rotateY(540deg) scale(1.1); }
  100% { transform: rotateY(720deg) scale(1); }
}

.animate-flip {
  animation: flip-coin 0.6s ease-in-out infinite;
  display: inline-block;
}

/* Dice roll animation */
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

/* Theme-specific animations */
:global(.theme-egyptian) .coin-heads {
  animation: egyptian-glow 2s ease-in-out infinite;
}

@keyframes egyptian-glow {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  }
  50% {
    box-shadow: 0 4px 25px rgba(255, 215, 0, 0.7), 0 0 40px rgba(212, 175, 55, 0.3);
  }
}

:global(.theme-shadow-realm) .dice-revealed {
  animation: shadow-dice 3s ease-in-out infinite;
}

@keyframes shadow-dice {
  0%, 100% {
    box-shadow: var(--shadow-card);
  }
  50% {
    box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
  }
}
</style>
