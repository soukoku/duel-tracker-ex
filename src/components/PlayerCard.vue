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
        class="input text-center text-lg font-semibold max-w-50"
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
    <LPDisplay
      :life-points="player.lifePoints"
      :starting-l-p="player.startingLP"
    />

    <!-- Quick Adjust Buttons -->
    <QuickAdjustButtons
      :show-calculator="showCalculator"
      @adjust="adjustLP"
      @halve="halveLP"
      @toggle-calculator="showCalculator = !showCalculator"
    />

    <!-- Calculator Panel -->
    <LPCalculator
      :show="showCalculator"
      @adjust="adjustLP"
      @set="setExactLP"
    />

    <!-- History -->
    <LPHistory :history="player.history" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { Player } from '../composables/useGame'
import LPDisplay from './LPDisplay.vue'
import QuickAdjustButtons from './QuickAdjustButtons.vue'
import LPCalculator from './LPCalculator.vue'
import LPHistory from './LPHistory.vue'

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

// UI state
const showCalculator = ref(false)
const isEditingName = ref(false)
const localName = ref(props.player.name)
const nameInput = ref<HTMLInputElement | null>(null)

const playerColorClass = computed((): string => {
  const colors = ['player-1', 'player-2', 'player-3', 'player-4']
  return colors[(props.playerIndex ?? 0) % colors.length]
})

function adjustLP(amount: number): void {
  emit('update-lp', props.player.id, amount)
}

function halveLP(): void {
  emit('halve-lp', props.player.id)
}

function setExactLP(value: number): void {
  emit('set-lp', props.player.id, value)
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