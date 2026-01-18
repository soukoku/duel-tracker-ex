<script setup lang="ts">
defineProps<{
  side: 'heads' | 'tails' | 'placeholder'
}>()
</script>

<template>
  <!-- Heads: Crown/Pharaoh design -->
  <svg v-if="side === 'heads'" viewBox="0 0 64 64" class="w-full h-full">
    <defs>
      <linearGradient id="headsGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFD700"/>
        <stop offset="50%" stop-color="#FFA500"/>
        <stop offset="100%" stop-color="#FFD700"/>
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#headsGold)" stroke="#B8860B" stroke-width="2"/>
    <circle cx="32" cy="32" r="26" fill="none" stroke="#B8860B" stroke-width="1" opacity="0.5"/>
    <!-- Crown/Star design -->
    <path d="M32 12 L36 22 L47 22 L38 29 L42 40 L32 33 L22 40 L26 29 L17 22 L28 22 Z" 
          fill="#8B4513" stroke="#5D2906" stroke-width="1"/>
    <circle cx="32" cy="26" r="3" fill="#FFD700"/>
    <text x="32" y="56" text-anchor="middle" fill="#5D2906" font-size="8" font-weight="bold">HEADS</text>
  </svg>
  
  <!-- Tails: Eagle/Serpent design -->
  <svg v-else-if="side === 'tails'" viewBox="0 0 64 64" class="w-full h-full">
    <defs>
      <linearGradient id="tailsSilver" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E8E8E8"/>
        <stop offset="50%" stop-color="#A0A0A0"/>
        <stop offset="100%" stop-color="#C0C0C0"/>
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#tailsSilver)" stroke="#707070" stroke-width="2"/>
    <circle cx="32" cy="32" r="26" fill="none" stroke="#808080" stroke-width="1" opacity="0.5"/>
    <!-- Serpent/Snake design -->
    <path d="M20 35 Q25 20 32 25 Q39 30 38 40 Q37 48 30 45 Q24 42 26 35 Q28 28 35 32" 
          fill="none" stroke="#404040" stroke-width="3" stroke-linecap="round"/>
    <circle cx="22" cy="33" r="2" fill="#404040"/>
    <text x="32" y="56" text-anchor="middle" fill="#404040" font-size="8" font-weight="bold">TAILS</text>
  </svg>
  
  <!-- Placeholder -->
  <svg v-else viewBox="0 0 64 64" class="w-full h-full opacity-30">
    <circle cx="32" cy="32" r="30" fill="#888" stroke="#666" stroke-width="2"/>
    <text x="32" y="40" text-anchor="middle" fill="#444" font-size="24" font-weight="bold">?</text>
  </svg>
</template>
