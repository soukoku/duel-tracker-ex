<template>
  <!-- Game Board -->
  <GameBoard
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

  <!-- Game Tools Dialog -->
  <GameToolsDialog
    :is-open="showToolsDialog"
    :current-turn="turnCount"
    @close="showToolsDialog = false"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import GameToolsDialog from '../components/GameToolsDialog.vue'
import GameBoard from '../components/GameBoard.vue'
import { useGameState, GAME_MODES, type GameMode } from '../composables/useGame'

const props = defineProps<{
  modeId: string
}>()

const { t } = useI18n()
const router = useRouter()

// Find the game mode
const mode = Object.values(GAME_MODES).find(m => m.id === props.modeId)

if (!mode && props.modeId !== 'custom') {
  // Invalid mode, redirect to home
  router.push('/')
}

// Initialize game with mode-specific storage
const {
  gameMode,
  players,
  gameStarted,
  gameEnded,
  winner,
  turnCount,
  isTeamGame,
  teams,
  selectGameMode,
  initializeGame,
  updatePlayerLP,
  setPlayerLP,
  nextTurn,
  resetGame: resetGameState,
  endGame: endGameState,
  clearSavedGame,
  updatePlayerName,
  halveLP,
} = useGameState({ t }, props.modeId)

// Tools dialog
const showToolsDialog = ref(false)

// Wrapper functions to clear saved state and navigate home
function resetGame(): void {
  clearSavedGame()
  router.push('/')
}

function endGame(): void {
  clearSavedGame()
  router.push('/')
}

// Initialize game on mount
onMounted(() => {
  if (mode) {
    selectGameMode(mode)
  } else if (props.modeId === 'custom') {
    // Load custom settings from temporary storage
    const tempSettings = localStorage.getItem('duel-tracker-custom-settings-temp')
    if (tempSettings) {
      const settings = JSON.parse(tempSettings)
      selectGameMode({
        id: 'custom',
        name: 'Custom Game',
        description: 'Set your own rules',
        startingLP: settings.startingLP,
        playerCount: settings.playerCount,
        teams: settings.useTeams ? 2 : 1,
      })
      localStorage.removeItem('duel-tracker-custom-settings-temp')
    }
  }
  
  // Initialize if not already started
  if (!gameStarted.value) {
    initializeGame()
  }
})
</script>
