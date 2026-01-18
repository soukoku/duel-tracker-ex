<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { HistoryEntry } from '../composables/useGame'

const { t } = useI18n()

const props = defineProps<{
  history: HistoryEntry[]
}>()

const showHistory = ref(false)

const reversedHistory = computed((): HistoryEntry[] => {
  return [...props.history].reverse()
})
</script>

<template>
  <div>
    <button 
      @click="showHistory = !showHistory"
      class="text-sm text-themed-muted hover:text-themed transition-colors"
    >
      {{ showHistory ? t('player.hideHistory', { count: history.length }) : t('player.showHistory', { count: history.length }) }}
    </button>

    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-40"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-40"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showHistory" class="w-full overflow-hidden mt-2">
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
          <div v-if="history.length === 0" class="text-center text-themed-muted py-2">
            {{ t('player.noChanges') }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
