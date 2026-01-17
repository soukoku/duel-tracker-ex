<template>
  <div class="min-h-screen p-4 sm:p-6 space-y-6 bg-themed">
    <!-- Header -->
    <header class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button 
          @click="router.push('/')"
          class="flex items-center gap-3 hover:opacity-75 transition-opacity cursor-pointer"
        >
          <img 
            src="/assets/icons/android-chrome-192x192.png" 
            alt="Duel Tracker Logo" 
            class="w-12 h-12 sm:w-14 sm:h-14"
          />
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-themed">
              {{ t('app.title') }}
            </h1>
            <p class="text-xs sm:text-sm text-themed-muted">{{ t('app.subtitle') }}</p>
          </div>
        </button>
      </div>
      
      <div class="flex items-center gap-2">
        <LanguageSelector />
        <ThemeSelector
          :current-theme-id="currentThemeId"
          :current-theme="currentTheme"
          :is-dark="isDark"
          :available-themes="availableThemes"
          @set-theme="setTheme"
          @toggle-dark-mode="toggleDarkMode"
        />
      </div>
    </header>

    <!-- Game Mode Selection -->
    <GameModeSelector
      :game-modes="gameModes"
      :selected-mode-id="null"
      :custom-settings="defaultCustomSettings"
      :saved-games="savedGames"
      @select-mode="selectGameMode"
      @start-custom="startCustomGame"
      @update-custom-setting="updateCustomSetting"
    />

    <!-- Footer -->
    <footer class="text-center text-sm text-themed-muted pt-4">
      <div class="flex items-center justify-center gap-2">
        <p>{{ t('app.footer') }}</p>
        <a 
          href="https://github.com/soukoku/duel-tracker-ex" 
          target="_blank" 
          rel="noopener noreferrer"
          class="inline-flex items-center text-themed-muted hover:text-themed transition-colors"
          title="View on GitHub"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
          </svg>
        </a>
      </div>
    </footer>

    <!-- Background Music Player -->
    <BackgroundMusicPlayer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ThemeSelector from '../components/ThemeSelector.vue'
import LanguageSelector from '../components/LanguageSelector.vue'
import GameModeSelector from '../components/GameModeSelector.vue'
import BackgroundMusicPlayer from '../components/BackgroundMusicPlayer.vue'
import { GAME_MODES, type GameMode, type CustomSettings, getSavedGameKeys } from '../composables/useGame'
import { useThemeSystem } from '../composables/useTheme'

const { t } = useI18n()
const router = useRouter()

// Theme
const { 
  currentThemeId,
  currentTheme,
  isDark, 
  availableThemes,
  setTheme,
  toggleDarkMode,
} = useThemeSystem()

// Game modes
const gameModes = Object.values(GAME_MODES)

// Custom settings state
const customSettings = ref<CustomSettings>({
  startingLP: 8000,
  playerCount: 2,
  useTeams: false,
})

const defaultCustomSettings = computed(() => customSettings.value)

// Get saved games
const savedGames = computed(() => getSavedGameKeys())

function selectGameMode(mode: GameMode): void {
  router.push({ name: 'game', params: { modeId: mode.id } })
}

function startCustomGame(): void {
  // Store custom settings to localStorage temporarily
  localStorage.setItem('duel-tracker-custom-settings-temp', JSON.stringify(customSettings.value))
  router.push({ name: 'game', params: { modeId: 'custom' } })
}

function updateCustomSetting(key: keyof CustomSettings, value: number | boolean): void {
  customSettings.value = { ...customSettings.value, [key]: value }
}
</script>
