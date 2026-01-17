<template>
  <div class="grid grid-cols-4 gap-2 w-full">
    <button @click="$emit('adjust', -1000)" class="btn btn-danger py-2">-1000</button>
    <button @click="$emit('adjust', -500)" class="btn btn-danger py-2">-500</button>
    <button @click="$emit('adjust', -100)" class="btn btn-danger py-2">-100</button>
    <button @click="$emit('halve')" class="btn btn-danger py-2">1/2</button>
    
    <button @click="$emit('adjust', 1000)" class="btn btn-success py-2">+1000</button>
    <button @click="$emit('adjust', 500)" class="btn btn-success py-2">+500</button>
    <button @click="$emit('adjust', 100)" class="btn btn-success py-2">+100</button>
    <button @click="$emit('toggle-calculator')" class="btn btn-secondary py-2">
      {{ showCalculator ? '✕' : '...' }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showCalculator: boolean
}>()

defineEmits<{
  adjust: [amount: number]
  halve: []
  'toggle-calculator': []
}>()
</script>
