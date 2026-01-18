<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import CoinFlipTool from './CoinFlipTool.vue'
import DiceRollTool from './DiceRollTool.vue'
import ToolHistory, { type ToolHistoryEntry } from './ToolHistory.vue'

defineProps<{
  isOpen: boolean
  currentTurn: number
}>()

const emit = defineEmits<{
  close: []
  result: [entry: ToolHistoryEntry]
}>()

const { t } = useI18n()

const tools = [
  { id: 'coin', icon: '🪙' },
  { id: 'dice', icon: '🎲' },
]

const activeTool = ref<'coin' | 'dice'>('coin')
const toolHistory = useStorage<ToolHistoryEntry[]>('duel-tracker-tool-history', [])

function handleResult(entry: ToolHistoryEntry): void {
  toolHistory.value.push(entry)
  emit('result', entry)
}
</script>

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
              🎲 {{ t('tools.title') }}
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
                {{ tool.icon }} {{ t(`tools.${tool.id}`) }}
              </button>
            </div>

            <!-- Coin Flip Tool -->
            <CoinFlipTool
              v-if="activeTool === 'coin'"
              :current-turn="currentTurn"
              @result="handleResult"
            />

            <!-- Dice Roll Tool -->
            <DiceRollTool
              v-if="activeTool === 'dice'"
              :current-turn="currentTurn"
              @result="handleResult"
            />

            <!-- History Section -->
            <ToolHistory :history="toolHistory" />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
