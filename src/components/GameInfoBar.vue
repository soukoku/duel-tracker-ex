<template>
  <div class="card p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-3">
      <span class="px-3 py-1 rounded-full text-sm font-medium" style="background-color: var(--color-primary-light); color: var(--color-primary-dark);">
        {{ modeName }}
      </span>
      <span class="text-themed-muted text-sm">
        Turn {{ turnCount }}
      </span>
    </div>
    
    <div class="flex gap-2">
      <button 
        @click="$emit('open-tools')" 
        class="btn btn-secondary text-sm"
        title="Dice & Coin Tools"
      >
        🎲 Tools
      </button>
      <button @click="$emit('next-turn')" class="btn btn-secondary text-sm">
        Next Turn
      </button>
      <button @click="$emit('reset')" class="btn btn-secondary text-sm">
        Reset
      </button>
      <button @click="$emit('end')" class="btn btn-danger text-sm">
        End Game
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modeName: string
  turnCount: number
}>()

defineEmits<{
  'open-tools': []
  'next-turn': []
  'reset': []
  'end': []
}>()
</script>
