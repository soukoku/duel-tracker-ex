<template>
  <div class="relative">
    <div 
      class="life-points tabular-nums transition-all duration-300"
      :class="{ 
        'animate-pulse text-red-500': lifePoints <= startingLP * 0.25 && !isAnimating,
        'lp-animating': isAnimating
      }"
    >
      {{ displayedLP.toLocaleString() }}
    </div>
    
    <!-- LP Progress Bar -->
    <div class="w-full h-2 bg-themed-secondary rounded-full mt-2 overflow-hidden">
      <div 
        class="h-full rounded-full transition-all duration-500 ease-out"
        :class="progressBarClass"
        :style="{ width: `${lpPercentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps<{
  lifePoints: number
  startingLP: number
}>()

// Sound effects
const lifeChangeSfx = ref<HTMLAudioElement | null>(null)
const lifeZeroSfx = ref<HTMLAudioElement | null>(null)

// Animation state
const isAnimating = ref(false)
const displayedLP = ref(props.lifePoints)
let animationFrameId: number | null = null

onMounted(() => {
  lifeChangeSfx.value = new Audio('/assets/sfx/life-change.ogg')
  lifeZeroSfx.value = new Audio('/assets/sfx/life-zero.ogg')
  displayedLP.value = props.lifePoints
})

// Watch for LP changes
watch(() => props.lifePoints, (newLP, oldLP) => {
  if (newLP !== oldLP) {
    animateLPChange(oldLP, newLP)
  }
})

function animateLPChange(fromLP: number, toLP: number): void {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
  
  isAnimating.value = true
  
  const willBeZero = toLP <= 0
  const sfx = willBeZero ? lifeZeroSfx.value : lifeChangeSfx.value
  
  if (sfx) {
    sfx.currentTime = 0
    sfx.play().catch(() => {})
  }
  
  const animationDuration = willBeZero ? 1500 : 1000
  const startTime = performance.now()
  
  function animate(currentTime: number): void {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / animationDuration, 1)
    
    if (progress < 1) {
      const range = Math.abs(toLP - fromLP)
      const jitter = range * (1 - progress) * 0.3
      const baseValue = fromLP + (toLP - fromLP) * progress
      const randomOffset = (Math.random() - 0.5) * 2 * jitter
      displayedLP.value = Math.max(0, Math.round(baseValue + randomOffset))
      animationFrameId = requestAnimationFrame(animate)
    } else {
      displayedLP.value = toLP
      isAnimating.value = false
      animationFrameId = null
    }
  }
  
  animationFrameId = requestAnimationFrame(animate)
}

const lpPercentage = computed((): number => {
  return Math.max(0, (props.lifePoints / props.startingLP) * 100)
})

const progressBarClass = computed((): string => {
  if (lpPercentage.value > 50) return 'bg-gradient-to-r from-green-400 to-green-500'
  if (lpPercentage.value > 25) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  return 'bg-gradient-to-r from-red-400 to-red-500'
})
</script>

<style scoped>
.lp-animating {
  animation: lp-shake 0.1s ease-in-out infinite;
}

@keyframes lp-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px) scale(1.02); }
  75% { transform: translateX(2px) scale(0.98); }
}

.life-points.lp-animating {
  filter: drop-shadow(0 0 8px var(--glow-color));
}
</style>
