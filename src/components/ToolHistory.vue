<script setup lang="ts">
import { ref, computed } from 'vue'

export interface ToolHistoryEntry {
  type: 'coin' | 'dice'
  results: (string | number)[]
  turn: number
  timestamp: string
}

const props = defineProps<{
  history: ToolHistoryEntry[]
}>()

const showHistory = ref(false)

const reversedHistory = computed(() => [...props.history].reverse().slice(0, 20))

function formatResult(entry: ToolHistoryEntry): string {
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

<template>
  <div v-if="history.length > 0" class="mt-6 pt-6 border-t border-themed">
    <button
      @click="showHistory = !showHistory"
      class="flex items-center justify-between w-full text-left text-themed-secondary hover:text-themed transition-colors"
    >
      <span class="font-medium">📜 Recent Results ({{ history.length }})</span>
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
            {{ formatResult(entry) }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
