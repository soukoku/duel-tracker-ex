<template>
  <div class="min-h-screen p-4 sm:p-6 space-y-6 bg-themed">
    <!-- Header -->
    <header class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img 
          src="/assets/icons/android-chrome-192x192.png" 
          alt="Duel Tracker Logo" 
          class="w-12 h-12 sm:w-14 sm:h-14"
        />
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-themed">
            Duel Tracker
          </h1>
          <p class="text-xs sm:text-sm text-themed-muted">Yu-Gi-Oh! Life Point Counter</p>
        </div>
      </div>
      
      <ThemeSelector
        :current-theme-id="currentThemeId"
        :current-theme="currentTheme"
        :is-dark="isDark"
        :available-themes="availableThemes"
        @set-theme="setTheme"
        @toggle-dark-mode="toggleDarkMode"
      />
    </header>

    <!-- Game Mode Selection -->
    <GameModeSelector
      v-if="!gameStarted"
      :game-modes="gameModes"
      :selected-mode-id="gameMode?.id ?? null"
      :custom-settings="customSettings"
      @select-mode="selectAndInitGame"
      @start-custom="initializeGame"
      @update-custom-setting="updateCustomSetting"
    />

    <!-- Game Board -->
    <GameBoard
      v-else
      :game-mode="gameMode"
      :players="players"
      :turn-count="turnCount"
      :game-ended="gameEnded"
      :winner="winner"
      :is-team-game="isTeamGame"
      :teams="teams"
      @open-tools="showToolsDialog = true"
      @next-turn="nextTurn"
      @reset-game="resetGame"
      @end-game="endGame"
      @update-lp="updatePlayerLP"
      @set-lp="setPlayerLP"
      @update-name="updatePlayerName"
      @halve-lp="halveLP"
    />

    <!-- Footer -->
    <footer class="text-center text-sm text-themed-muted pt-4">
      <p>Yu-Gi-Oh! Duel Tracker • Track your duels with ease</p>
    </footer>

    <!-- Game Tools Dialog -->
    <GameToolsDialog
      :is-open="showToolsDialog"
      :current-turn="turnCount"
      @close="showToolsDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ThemeSelector from './components/ThemeSelector.vue'
import GameToolsDialog from './components/GameToolsDialog.vue'
import GameModeSelector from './components/GameModeSelector.vue'
import GameBoard from './components/GameBoard.vue'
import { useGameState, GAME_MODES, type GameMode, type CustomSettings } from './composables/useGame'
import { useThemeSystem } from './composables/useTheme'

// Game state
const {
  gameMode,
  players,
  gameStarted,
  gameEnded,
  winner,
  turnCount,
  customSettings,
  isTeamGame,
  teams,
  selectGameMode,
  initializeGame,
  updatePlayerLP,
  setPlayerLP,
  nextTurn,
  resetGame,
  endGame,
  updatePlayerName,
  halveLP,
} = useGameState()

// Theme
const { 
  currentThemeId,
  currentTheme,
  isDark, 
  availableThemes,
  initTheme, 
  setTheme,
  toggleDarkMode 
} = useThemeSystem()

// Game tools dialog
const showToolsDialog = ref(false)

// Game modes array for iteration
const gameModes = Object.values(GAME_MODES)

// Initialize theme on mount
onMounted(() => {
  initTheme()
})

// Helper functions
function selectAndInitGame(mode: GameMode): void {
  selectGameMode(mode)
  if (mode.id !== 'custom') {
    initializeGame()
  }
}

function updateCustomSetting(key: keyof CustomSettings, value: number | boolean): void {
  if (key === 'startingLP' || key === 'playerCount') {
    customSettings[key] = value as number
  } else if (key === 'useTeams') {
    customSettings[key] = value as boolean
  }
}
</script>
