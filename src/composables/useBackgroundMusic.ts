import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

export interface MusicTrack {
  title: string
  artist: string
  youtubeId: string
}

// Collection of Yu-Gi-Oh! duel music from YouTube
// Using popular, long-standing uploads that are less likely to be removed
export const MUSIC_TRACKS: MusicTrack[] = [
  {
    title: 'Fang of Critias',
    artist: 'Bl00dyBizkitz',
    youtubeId: '8WXYajeP9TE'
  },
  {
    title: 'Savior/Majestic Star Dragon',
    artist: 'iShinigamiKnight',
    youtubeId: '_cUX5HvzwhE'
  },
  {
    title: 'Passionate Duelist',
    artist: 'Bingus Bongus',
    youtubeId: 'ch0ACDFffNk'
  },
  {
    title: 'Dark Magician',
    artist: "BoomRiderZ Aiger's",
    youtubeId: 'b61ROQ13Hv4'
  }
]

// Persisted state
const currentTrackIndex = useStorage('duel-tracker-music-track', 0)
const isMinimized = useStorage('duel-tracker-music-minimized', true)

export function useBackgroundMusic() {
  const currentTrack = computed(() => MUSIC_TRACKS[currentTrackIndex.value])
  const tracks = computed(() => MUSIC_TRACKS)

  // Generate YouTube embed URL
  const embedUrl = computed(() => {
    const videoId = currentTrack.value.youtubeId
    return `https://www.youtube.com/embed/${videoId}?si=1&rel=0&modestbranding=1`
  })

  function selectTrack(index: number): void {
    if (index >= 0 && index < MUSIC_TRACKS.length) {
      currentTrackIndex.value = index
    }
  }

  function nextTrack(): void {
    currentTrackIndex.value =
      (currentTrackIndex.value + 1) % MUSIC_TRACKS.length
  }

  function previousTrack(): void {
    currentTrackIndex.value =
      currentTrackIndex.value === 0
        ? MUSIC_TRACKS.length - 1
        : currentTrackIndex.value - 1
  }

  function toggleMinimized(): void {
    isMinimized.value = !isMinimized.value
  }

  return {
    // State
    currentTrack,
    currentTrackIndex,
    tracks,
    embedUrl,
    isMinimized,

    // Methods
    selectTrack,
    nextTrack,
    previousTrack,
    toggleMinimized
  }
}
