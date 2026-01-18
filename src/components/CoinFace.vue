<script setup lang="ts">
import { ref, onMounted } from 'vue'

const modelValue = defineModel<'head' | 'tail'>('modelValue')

const coinSfx = ref<HTMLAudioElement | null>(null)
const isFlipping = ref(false)

onMounted(() => {
  coinSfx.value = new Audio('/assets/sfx/coin.ogg')
})

// Cryptographically secure random
function cryptoRandomBool(): boolean {
  const array = new Uint8Array(1)
  crypto.getRandomValues(array)
  return array[0]! < 128
}

async function flip() {
  isFlipping.value = true

  // Play sound
  if (coinSfx.value) {
    coinSfx.value.currentTime = 0
    coinSfx.value.play().catch(() => { })
  }

  // Animate for 600ms
  await new Promise(resolve => setTimeout(resolve, 600))

  // Determine result
  const result = cryptoRandomBool() ? 'head' : 'tail'
  isFlipping.value = false
  modelValue.value = result
}

defineExpose({ flip })
</script>

<template>
  <div class="coin-visual" :class="{
    'coin-placeholder': !modelValue && !isFlipping,
    'coin-heads': modelValue === 'head',
    'coin-tails': modelValue === 'tail'
  }">
    <!-- Flipping animation -->
    <svg v-if="modelValue === 'head' || isFlipping" viewBox="0 0 64 64" class="w-full h-full animate-flip">
      <defs>
        <linearGradient id="headsGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFD700" />
          <stop offset="50%" stop-color="#FFA500" />
          <stop offset="100%" stop-color="#FFD700" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#headsGold)" stroke="#B8860B" stroke-width="2" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="#B8860B" stroke-width="1" opacity="0.5" />
      <!-- Crown/Star design -->
      <path d="M32 12 L36 22 L47 22 L38 29 L42 40 L32 33 L22 40 L26 29 L17 22 L28 22 Z" fill="#8B4513" stroke="#5D2906"
        stroke-width="1" />
      <circle cx="32" cy="26" r="3" fill="#FFD700" />
      <text x="32" y="56" text-anchor="middle" fill="#5D2906" font-size="8" font-weight="bold">HEADS</text>
    </svg>

    <!-- Tails: Eagle/Serpent design -->
    <svg v-else-if="modelValue === 'tail'" viewBox="0 0 64 64" class="w-full h-full">
      <defs>
        <linearGradient id="tailsSilver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E8E8E8" />
          <stop offset="50%" stop-color="#A0A0A0" />
          <stop offset="100%" stop-color="#C0C0C0" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#tailsSilver)" stroke="#707070" stroke-width="2" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="#808080" stroke-width="1" opacity="0.5" />
      <!-- Serpent/Snake design -->
      <path d="M20 35 Q25 20 32 25 Q39 30 38 40 Q37 48 30 45 Q24 42 26 35 Q28 28 35 32" fill="none" stroke="#404040"
        stroke-width="3" stroke-linecap="round" />
      <circle cx="22" cy="33" r="2" fill="#404040" />
      <text x="32" y="56" text-anchor="middle" fill="#404040" font-size="8" font-weight="bold">TAILS</text>
    </svg>

    <!-- Placeholder -->
    <svg v-else viewBox="0 0 64 64" class="w-full h-full opacity-30">
      <circle cx="32" cy="32" r="30" fill="#888" stroke="#666" stroke-width="2" />
      <text x="32" y="40" text-anchor="middle" fill="#444" font-size="24" font-weight="bold">?</text>
    </svg>
  </div>
</template>

<style scoped>
.coin-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  overflow: hidden;
}

.coin-placeholder {
  background: var(--color-bg-hover);
  border: 2px dashed var(--color-border);
}

.coin-heads {
  background: transparent;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.coin-tails {
  background: transparent;
  box-shadow: 0 4px 15px rgba(192, 192, 192, 0.4);
}

:global(.theme-egyptian) .coin-heads {
  animation: egyptian-glow 2s ease-in-out infinite;
}

@keyframes egyptian-glow {

  0%,
  100% {
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  }

  50% {
    box-shadow: 0 4px 25px rgba(255, 215, 0, 0.7), 0 0 40px rgba(212, 175, 55, 0.3);
  }
}

@keyframes flip-coin {
  0% {
    transform: rotateY(0deg) scale(1);
  }

  25% {
    transform: rotateY(180deg) scale(1.1);
  }

  50% {
    transform: rotateY(360deg) scale(1);
  }

  75% {
    transform: rotateY(540deg) scale(1.1);
  }

  100% {
    transform: rotateY(720deg) scale(1);
  }
}

.animate-flip {
  animation: flip-coin 0.6s ease-in-out;
  display: inline-block;
}
</style>
