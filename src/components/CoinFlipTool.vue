<template>
  <div class="space-y-4">
    <div class="text-center">
      <p class="text-themed-secondary mb-4">
        {{ t('tools.selectCoins', { max: maxCoins }) }}
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
        <span v-if="!isFlipping">🪙 {{ t('tools.flip', { count: coinCount, plural: coinCount > 1 ? 's' : '' }) }}</span>
        <span v-else class="flex items-center justify-center gap-2">
          <span class="animate-spin">🪙</span> {{ t('tools.flipping') }}
        </span>
      </button>

      <!-- Results Display -->
      <div class="mt-6 p-4 rounded-lg bg-themed-secondary min-h-35">
        <div class="flex justify-center gap-4 mb-4 min-h-18 items-center">
          <!-- Placeholder slots when empty -->
          <template v-if="coinResults.length === 0 && !isFlipping">
            <div
              v-for="n in coinCount"
              :key="'placeholder-' + n"
              class="coin-visual coin-placeholder"
            >
              <CoinFace side="placeholder" />
            </div>
          </template>
          
          <!-- Spinning placeholders while flipping -->
          <template v-else-if="isFlipping">
            <div
              v-for="n in coinCount"
              :key="'spinning-' + n"
              class="coin-visual coin-spinning"
            >
              <svg viewBox="0 0 64 64" class="w-full h-full animate-flip">
                <circle cx="32" cy="32" r="30" fill="url(#coinGradient)" stroke="#B8860B" stroke-width="2"/>
                <defs>
                  <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FFD700"/>
                    <stop offset="50%" stop-color="#FFA500"/>
                    <stop offset="100%" stop-color="#FFD700"/>
                  </linearGradient>
                </defs>
              </svg>
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
                class="coin-visual"
                :class="result === 'heads' ? 'coin-heads' : 'coin-tails'"
              >
                <CoinFace :side="result" />
              </div>
            </TransitionGroup>
            
            <!-- Remaining placeholders -->
            <div
              v-for="n in (coinCount - visibleCoinResults.length)"
              :key="'remaining-' + n"
              class="coin-visual coin-placeholder"
            >
              <CoinFace side="placeholder" />
            </div>
          </template>
        </div>
        
        <!-- Summary -->
        <div class="text-center text-themed-secondary text-sm h-5">
          <template v-if="visibleCoinResults.length === coinResults.length && coinResults.length > 0">
            <span class="font-medium">{{ t('tools.heads') }}:</span> {{ coinResults.filter(r => r === 'heads').length }}
            <span class="mx-2">|</span>
            <span class="font-medium">{{ t('tools.tails') }}:</span> {{ coinResults.filter(r => r === 'tails').length }}
          </template>
          <template v-else-if="isFlipping || visibleCoinResults.length < coinResults.length">
            <span class="opacity-50">{{ t('tools.revealingResults') }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import CoinFace from './CoinFace.vue'

const { t } = useI18n()

export interface CoinFlipResult {
  type: 'coin'
  results: ('heads' | 'tails')[]
  turn: number
  timestamp: string
}

const props = defineProps<{
  currentTurn: number
}>()

const emit = defineEmits<{
  result: [entry: CoinFlipResult]
}>()

const maxCoins = 3
const revealDelay = 400

// Sound effect
const coinSfx = ref<HTMLAudioElement | null>(null)

onMounted(() => {
  coinSfx.value = new Audio('/assets/sfx/coin.ogg')
})

function playCoinSound(): void {
  if (coinSfx.value) {
    coinSfx.value.currentTime = 0
    coinSfx.value.play().catch(() => {})
  }
}

// State
const coinCount = ref(1)
const coinResults = ref<('heads' | 'tails')[]>([])
const visibleCoinResults = ref<('heads' | 'tails')[]>([])
const isFlipping = ref(false)

// Cryptographically secure random
function cryptoRandomBool(): boolean {
  const array = new Uint8Array(1)
  crypto.getRandomValues(array)
  return array[0]! < 128
}

async function flipCoins(): Promise<void> {
  isFlipping.value = true
  coinResults.value = []
  visibleCoinResults.value = []
  
  // Initial animation delay
  await new Promise(resolve => setTimeout(resolve, 600))
  
  // Generate results
  const results: ('heads' | 'tails')[] = []
  for (let i = 0; i < coinCount.value; i++) {
    results.push(cryptoRandomBool() ? 'heads' : 'tails')
  }
  
  coinResults.value = results
  isFlipping.value = false
  
  // Reveal one by one
  for (let i = 0; i < results.length; i++) {
    await new Promise(resolve => setTimeout(resolve, revealDelay))
    playCoinSound()
    visibleCoinResults.value = results.slice(0, i + 1)
  }
  
  // Emit result
  const entry: CoinFlipResult = {
    type: 'coin',
    results: results,
    turn: props.currentTurn,
    timestamp: new Date().toISOString(),
  }
  emit('result', entry)
}
</script>

<style scoped>
.coin-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  overflow: hidden;
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
  background: transparent;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.coin-tails {
  background: transparent;
  box-shadow: 0 4px 15px rgba(192, 192, 192, 0.4);
}

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

:global(.theme-egyptian) .coin-heads {
  animation: egyptian-glow 2s ease-in-out infinite;
}

@keyframes egyptian-glow {
  0%, 100% { box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 4px 25px rgba(255, 215, 0, 0.7), 0 0 40px rgba(212, 175, 55, 0.3); }
}
</style>
