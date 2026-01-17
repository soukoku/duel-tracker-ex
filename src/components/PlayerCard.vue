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
        class="input text-center text-lg font-semibold max-w-[200px]"
        :class="textColorClass"
      />
      <h3
        v-else
        @click="startEditingName"
        class="text-lg sm:text-xl font-bold cursor-pointer hover:opacity-75 transition-opacity"
        :class="textColorClass"
      >
        {{ player.name }}
        <span class="text-xs opacity-50 ml-1">✏️</span>
      </h3>
    </div>

    <!-- Life Points Display -->
    <div class="relative">
      <div 
        class="life-points tabular-nums transition-all duration-300"
        :class="{ 'animate-pulse text-red-500': player.lifePoints <= player.startingLP * 0.25 }"
      >
        {{ player.lifePoints.toLocaleString() }}
      </div>
      
      <!-- LP Progress Bar -->
      <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
        <div 
          class="h-full rounded-full transition-all duration-500 ease-out"
          :class="progressBarClass"
          :style="{ width: `${lpPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Quick Adjust Buttons -->
    <div class="grid grid-cols-4 gap-2 w-full">
      <button @click="adjustLP(-1000)" class="btn btn-danger text-sm py-2">-1000</button>
      <button @click="adjustLP(-500)" class="btn btn-danger text-sm py-2">-500</button>
      <button @click="adjustLP(-100)" class="btn btn-danger text-sm py-2">-100</button>
      <button @click="halveLP" class="btn btn-danger text-sm py-2">½</button>
      
      <button @click="adjustLP(1000)" class="btn btn-success text-sm py-2">+1000</button>
      <button @click="adjustLP(500)" class="btn btn-success text-sm py-2">+500</button>
      <button @click="adjustLP(100)" class="btn btn-success text-sm py-2">+100</button>
      <button @click="showCalculator = !showCalculator" class="btn btn-secondary text-sm py-2">
        {{ showCalculator ? '✕' : '±' }}
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
      <div v-if="showCalculator" class="w-full overflow-hidden">
        <div class="flex gap-2 mb-2">
          <input
            v-model.number="customAmount"
            type="number"
            placeholder="Amount"
            class="input flex-1"
            min="0"
          />
        </div>
        <div class="flex gap-2">
          <button 
            @click="applyCustomAmount(-1)" 
            class="btn btn-danger flex-1"
            :disabled="!customAmount"
          >
            Subtract
          </button>
          <button 
            @click="applyCustomAmount(1)" 
            class="btn btn-success flex-1"
            :disabled="!customAmount"
          >
            Add
          </button>
          <button 
            @click="setExactLP" 
            class="btn btn-secondary flex-1"
            :disabled="!customAmount && customAmount !== 0"
          >
            Set
          </button>
        </div>
      </div>
    </transition>

    <!-- History Toggle -->
    <button 
      @click="showHistory = !showHistory"
      class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
    >
      {{ showHistory ? 'Hide' : 'Show' }} History ({{ player.history.length }})
    </button>

    <!-- History Panel -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-40"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-40"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showHistory" class="w-full overflow-hidden">
        <div class="max-h-32 overflow-y-auto space-y-1 text-sm">
          <div 
            v-for="(entry, index) in reversedHistory" 
            :key="index"
            class="flex justify-between items-center py-1 px-2 rounded bg-gray-100 dark:bg-gray-700"
          >
            <span class="text-gray-500 dark:text-gray-400">T{{ entry.turn }}</span>
            <span :class="entry.change >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ entry.change >= 0 ? '+' : '' }}{{ entry.change.toLocaleString() }}
            </span>
            <span class="text-gray-700 dark:text-gray-300">{{ entry.newLP.toLocaleString() }}</span>
          </div>
          <div v-if="player.history.length === 0" class="text-center text-gray-400 py-2">
            No changes yet
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
  playerIndex: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update-lp', 'set-lp', 'update-name', 'halve-lp'])

const showCalculator = ref(false)
const showHistory = ref(false)
const customAmount = ref(null)
const isEditingName = ref(false)
const localName = ref(props.player.name)
const nameInput = ref(null)

const lpPercentage = computed(() => {
  return Math.max(0, (props.player.lifePoints / props.player.startingLP) * 100)
})

const reversedHistory = computed(() => {
  return [...props.player.history].reverse()
})

const playerColorClass = computed(() => {
  const colors = [
    'border-l-4 border-l-blue-500',
    'border-l-4 border-l-red-500',
    'border-l-4 border-l-green-500',
    'border-l-4 border-l-yellow-500',
  ]
  return colors[props.playerIndex % colors.length]
})

const textColorClass = computed(() => {
  const colors = [
    'text-blue-600 dark:text-blue-400',
    'text-red-600 dark:text-red-400',
    'text-green-600 dark:text-green-400',
    'text-yellow-600 dark:text-yellow-400',
  ]
  return colors[props.playerIndex % colors.length]
})

const progressBarClass = computed(() => {
  if (lpPercentage.value > 50) return 'bg-gradient-to-r from-green-400 to-green-500'
  if (lpPercentage.value > 25) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  return 'bg-gradient-to-r from-red-400 to-red-500'
})

function adjustLP(amount) {
  emit('update-lp', props.player.id, amount)
}

function halveLP() {
  emit('halve-lp', props.player.id)
}

function applyCustomAmount(multiplier) {
  if (customAmount.value) {
    emit('update-lp', props.player.id, customAmount.value * multiplier)
    customAmount.value = null
  }
}

function setExactLP() {
  if (customAmount.value !== null) {
    emit('set-lp', props.player.id, customAmount.value)
    customAmount.value = null
  }
}

function startEditingName() {
  localName.value = props.player.name
  isEditingName.value = true
  nextTick(() => {
    nameInput.value?.focus()
    nameInput.value?.select()
  })
}

function saveName() {
  if (localName.value.trim()) {
    emit('update-name', props.player.id, localName.value.trim())
  }
  isEditingName.value = false
}
</script>
