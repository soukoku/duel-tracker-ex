<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CoinFace from './CoinFace.vue'

const { t } = useI18n()

export interface CoinFlipResult {
  type: 'coin'
  results: ('head' | 'tail')[]
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

// State
const coinCount = ref(1)
const coinRefs = useTemplateRef('coinRefs')
const coinResults = ref<('head' | 'tail' | undefined)[]>([undefined])
const isFlipping = ref(false)

watch(coinCount, () => {
  coinResults.value = Array(coinCount.value).fill(undefined)
})

async function flipCoins(): Promise<void> {
  if (!coinRefs.value) return

  // reset if already has results
  if (coinResults.value.some(r => !!r)) {
    coinResults.value = Array(coinCount.value).fill(undefined)
    await nextTick()
  }

  isFlipping.value = true

  // Roll each die individually with delay
  const tasks = []
  for (let i = 0; i < coinRefs.value.length; i++) {
    tasks.push(coinRefs.value[i]!.flip())
    await new Promise(resolve => setTimeout(resolve, 350))
  }
  await Promise.allSettled(tasks)

  isFlipping.value = false

  // Emit result
  const entry: CoinFlipResult = {
    type: 'coin',
    results: coinResults.value as ('head' | 'tail')[],
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
        {{ t('tools.selectCoins', { max: maxCoins }) }}
      </p>

      <!-- Coin Count Selector -->
      <div class="flex justify-center gap-2 mb-6">
        <button v-for="n in maxCoins" :key="n" @click="coinCount = n"
          class="w-12 h-12 rounded-lg font-bold text-lg transition-all" :class="coinCount === n
            ? 'gradient-primary text-white shadow-lg scale-110'
            : 'bg-themed-secondary text-themed hover:bg-themed-hover'">
          {{ n }}
        </button>
      </div>

      <!-- Flip Button -->
      <button @click="flipCoins" :disabled="isFlipping"
        class="btn btn-primary w-full py-4 text-lg relative overflow-hidden">
        <span v-if="!isFlipping">🪙 {{ t('tools.flip', { count: coinCount, plural: coinCount > 1 ? 's' : '' }) }}</span>
        <span v-else class="flex items-center justify-center gap-2">
          <span class="animate-spin">🪙</span> {{ t('tools.flipping') }}
        </span>
      </button>

      <!-- Results Display -->
      <div class="mt-6 p-4 rounded-lg bg-themed-secondary min-h-35">
        <div class="flex justify-center gap-4 mb-4 min-h-18 items-center">
          <CoinFace v-for="(result, idx) in coinResults" :key="'coin-' + idx" ref="coinRefs"
            v-model="coinResults[idx]" />
        </div>

        <!-- Summary -->
        <div class="text-center text-themed-secondary text-sm h-5">
          <template v-if="!isFlipping && coinResults.every(r => r !== null) && coinResults.length > 0">
            <span class="font-medium">{{ t('tools.heads') }}:</span> {{coinResults.filter(r => r === 'head').length}}
            <span class="mx-2">|</span>
            <span class="font-medium">{{ t('tools.tails') }}:</span> {{coinResults.filter(r => r === 'tail').length}}
          </template>
          <template v-else-if="isFlipping">
            <span class="opacity-50">{{ t('tools.revealingResults') }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
