<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue'
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

// State
const diceCount = ref(1)
const diceRefs = useTemplateRef('diceRefs')
const diceResults = ref<(number | undefined)[]>([undefined])
const isRolling = ref(false)

watch(diceCount, () => {
  diceResults.value = Array(diceCount.value).fill(undefined)
})

async function rollDice(): Promise<void> {
  if (!diceRefs.value) return

  // reset if already has results
  if (diceResults.value.some(r => !!r)) {
    diceResults.value = Array(diceCount.value).fill(undefined)
    await nextTick()
  }

  isRolling.value = true
  // Roll each die individually with delay
  const tasks = []
  for (let i = 0; i < diceRefs.value.length; i++) {
    tasks.push(diceRefs.value[i]!.roll())
    await new Promise(resolve => setTimeout(resolve, 350))
  }
  await Promise.allSettled(tasks)

  isRolling.value = false

  // Emit result
  const entry: DiceRollResult = {
    type: 'dice',
    results: diceResults.value as number[],
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
        <button v-for="n in maxDice" :key="n" @click="diceCount = n"
          class="w-12 h-12 rounded-lg font-bold text-lg transition-all" :class="diceCount === n
            ? 'gradient-primary text-white shadow-lg scale-110'
            : 'bg-themed-secondary text-themed hover:bg-themed-hover'">
          {{ n }}
        </button>
      </div>

      <!-- Roll Button -->
      <button @click="rollDice" :disabled="isRolling"
        class="btn btn-primary w-full py-4 text-lg relative overflow-hidden">
        <span v-if="!isRolling">🎲 {{ t('tools.roll', { count: diceCount, sides: diceSides }) }}</span>
        <span v-else class="flex items-center justify-center gap-2">
          <span class="animate-bounce">🎲</span> {{ t('tools.rolling') }}
        </span>
      </button>

      <!-- Results Display -->
      <div class="mt-6 p-4 rounded-lg bg-themed-secondary min-h-35">
        <div class="flex justify-center gap-3 mb-4 flex-wrap min-h-14 items-center">
          <DiceFace v-for="(result, idx) in diceResults" :key="'die-' + idx" ref="diceRefs"
            v-model="diceResults[idx]" />
        </div>
        <!-- Summary -->
        <div class="text-center text-themed-secondary h-7">
          <template v-if="!isRolling && diceResults.every(r => !!r) && diceResults.length > 0">
            <span class="font-medium">{{ t('tools.total') }}:</span>
            <span class="text-xl font-bold text-themed-primary ml-2">
              {{diceResults.reduce((a, b) => (a || 0) + (b || 0), 0)}}
            </span>
          </template>
          <template v-else-if="isRolling">
            <span class="opacity-50">{{ t('tools.revealingResults') }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
