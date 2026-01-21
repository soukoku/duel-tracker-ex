<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'

const { t } = useI18n()

interface MusicTrack {
  title: string
  youtubeId: string
}

// Collection of Yu-Gi-Oh! duel music from YouTube
const MUSIC_TRACKS: MusicTrack[] = [
  {
    title: 'Fang of Critias',
    youtubeId: '8WXYajeP9TE'
  }, {
    title: 'Savior/Majestic Star Dragon',
    youtubeId: '_cUX5HvzwhE'
  }, {
    title: 'Passionate Duelist',
    youtubeId: 'UJprpCvb9pw'
  }, {
    title: 'Dark Magician',
    youtubeId: 'b61ROQ13Hv4'
  }, {
    title: "Yugi's Transformation Theme & Opening",
    youtubeId: 'birUZUIZdEE'
  }, {
    title: "Camula's Theme",
    youtubeId: 'yROgA9k3X9U'
  }
]

// Persisted state
const currentTrackIndex = useStorage('duel-tracker-music-track', 0)
const isMinimized = useStorage('duel-tracker-music-minimized', true)

// Computed properties
const currentTrack = computed(() => MUSIC_TRACKS[currentTrackIndex.value])
const tracks = computed(() => MUSIC_TRACKS)
const embedUrl = computed(() => {
  const videoId = currentTrack.value?.youtubeId
  return `https://www.youtube.com/embed/${videoId}?rel=0`
})

// Methods
function selectTrack(index: number): void {
  if (index >= 0 && index < MUSIC_TRACKS.length) {
    currentTrackIndex.value = index
  }
}

function toggleMinimized(): void {
  isMinimized.value = !isMinimized.value
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Minimized View -->
    <button v-if="isMinimized"
      class="bg-themed-card border border-themed rounded-full p-3 shadow-lg cursor-pointer hover:scale-105 transition-transform"
      @click="toggleMinimized" :title="t('music.openPlayer')">
      <svg class="w-8 h-8 text-themed-primary" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    </button>

    <!-- Expanded View -->
    <div v-show="!isMinimized" class="bg-themed-card border border-themed rounded-xl shadow-xl w-92 overflow-hidden">
      <!-- Header -->
      <button @click="toggleMinimized"
        class="w-full cursor-pointer bg-themed-primary/10 px-4 py-3 flex items-center justify-between border-b border-themed">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-themed-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
          <span class="font-semibold text-themed">{{ t('music.title') }}</span>
        </div>
        <div @click="toggleMinimized" class="text-themed-muted hover:text-themed transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <!-- Embedded YouTube Player (iframe) -->
      <div class="aspect-video bg-black">
        <iframe :key="currentTrackIndex" :src="embedUrl" title="YouTube video player" class="w-full h-full"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>

      <!-- Track List -->
      <div class="max-h-48 overflow-y-auto">
        <button v-for="(track, index) in tracks" :key="track.youtubeId" @click="selectTrack(index)" type="button"
          class="w-full px-4 py-1 text-left hover:bg-themed-secondary/50 transition-colors flex items-center gap-3 cursor-pointer"
          :class="{ 'bg-themed-primary/10': currentTrackIndex === index }">
          <div class="w-8 h-8 rounded flex items-center justify-center shrink-0"
            :class="currentTrackIndex !== index ? 'bg-themed-primary text-themed' : 'bg-themed-secondary text-themed-muted'">
            <span class="font-medium">{{ index + 1 }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-medium text-themed truncate leading-tight">{{ track.title }}</p>
            <!-- <p class="text-sm text-themed-muted truncate leading-tight">{{ track.artist }}</p> -->
          </div>
        </button>
      </div>

      <!-- YouTube Attribution -->
      <!-- <div class="px-4 py-2 bg-themed-secondary/30 border-t border-themed">
        <p class="text-xs text-themed-muted text-center">
          {{ t('music.poweredBy') }}
        </p>
      </div> -->
    </div>
  </div>
</template>
