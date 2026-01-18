<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  adjust: [amount: number]
  halve: []
  set: [value: number]
}>()

const showCalculator = ref(false)
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

<template>
  <div class="w-full">
    <!-- Quick Adjust Buttons -->
    <div class="grid grid-cols-4 gap-2 w-full">
      <button @click="$emit('adjust', -1000)" class="btn btn-danger py-2">-1000</button>
      <button @click="$emit('adjust', -500)" class="btn btn-danger py-2">-500</button>
      <button @click="$emit('adjust', -100)" class="btn btn-danger py-2">-100</button>
      <button @click="$emit('halve')" class="btn btn-danger py-2">{{ t('actions.halve') }}</button>
      
      <button @click="$emit('adjust', 1000)" class="btn btn-success py-2">+1000</button>
      <button @click="$emit('adjust', 500)" class="btn btn-success py-2">+500</button>
      <button @click="$emit('adjust', 100)" class="btn btn-success py-2">+100</button>
      <button @click="showCalculator = !showCalculator" class="btn btn-secondary py-2">
        {{ showCalculator ? '✕' : '...' }}
      </button>
    </div>

    <!-- Calculator Panel -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-48"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-48"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showCalculator" class="w-full overflow-hidden mt-2">
        <div class="flex gap-2 mb-2">
          <input
            v-model.number="amount"
            type="number"
            :placeholder="t('calculator.amount')"
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
            {{ t('actions.subtract') }}
          </button>
          <button 
            @click="handleAdd" 
            class="btn btn-success flex-1"
            :disabled="!amount"
          >
            {{ t('actions.add') }}
          </button>
          <button 
            @click="handleSet" 
            class="btn btn-secondary flex-1"
            :disabled="amount === null"
          >
            {{ t('actions.set') }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
