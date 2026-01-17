<template>
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 max-h-0"
    enter-to-class="opacity-100 max-h-48"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 max-h-48"
    leave-to-class="opacity-0 max-h-0"
  >
    <div v-if="show" class="w-full overflow-hidden">
      <div class="flex gap-2 mb-2">
        <input
          v-model.number="amount"
          type="number"
          placeholder="Amount"
          class="input flex-1"
          min="0"
        />
      </div>
      <div class="flex gap-2">
        <button 
          @click="handleSubtract" 
          class="btn btn-danger flex-1"
          :disabled="!amount"
        >
          Subtract
        </button>
        <button 
          @click="handleAdd" 
          class="btn btn-success flex-1"
          :disabled="!amount"
        >
          Add
        </button>
        <button 
          @click="handleSet" 
          class="btn btn-secondary flex-1"
          :disabled="amount === null"
        >
          Set
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  adjust: [amount: number]
  set: [value: number]
}>()

const amount = ref<number | null>(null)

function handleSubtract(): void {
  if (amount.value) {
    emit('adjust', -amount.value)
    amount.value = null
  }
}

function handleAdd(): void {
  if (amount.value) {
    emit('adjust', amount.value)
    amount.value = null
  }
}

function handleSet(): void {
  if (amount.value !== null) {
    emit('set', amount.value)
    amount.value = null
  }
}
</script>
