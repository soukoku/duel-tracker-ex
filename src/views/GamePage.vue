<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import GameToolsDialog from '../components/GameToolsDialog.vue'
import PlayerCard from '../components/PlayerCard.vue'
import GameInfoBar from '../components/GameInfoBar.vue'
import { useGameState, GAME_MODES, type GameMode, GAME_ACTIONS_KEY } from '../composables/useGame'

const props = defineProps<{
  modeId: string
}>()

const { t } = useI18n()
const router = useRouter()

function getModeName(mode: GameMode | null): string {
  if (!mode) return 'Game'
  return t(`modes.${mode.id}.name`)
}

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
  updatePlayerName,
  halveLP,
} = useGameState({ t }, props.modeId)

// Provide game actions to child components (avoids prop drilling)
provide(GAME_ACTIONS_KEY, {
  updatePlayerLP,
  setPlayerLP,
  updatePlayerName,
  halveLP,
})

// Tools dialog
const showToolsDialog = ref(false)

// Wrapper functions to clear saved state and navigate home
function resetGame(): void {
  resetGameState()
}

function endGame(): void {
  endGameState()
  router.push('/')
}

// Initialize game on mount
onMounted(() => {
  if (mode) {
    selectGameMode(mode)
  } else if (props.modeId === 'custom') {
    // Load custom settings from router state
    const state = history.state as { customSettings?: { startingLP: number; playerCount: number; useTeams: boolean } }
    if (state.customSettings) {
      const settings = state.customSettings
      selectGameMode({
        id: 'custom',
        name: 'Custom Game',
        description: 'Set your own rules',
        startingLP: settings.startingLP,
        playerCount: settings.playerCount,
        teams: settings.useTeams ? 2 : 1,
      })
    }
  }

  // Initialize if not already started
  if (!gameStarted.value) {
    initializeGame()
  }
})
</script>

<template>
  <div class="space-y-4">
    <!-- Game Info Bar -->
    <GameInfoBar :mode-name="getModeName(gameMode)" :turn-count="turnCount" @open-tools="showToolsDialog = true"
      @next-turn="nextTurn" @reset="resetGame" @end="endGame" />

    <!-- Winner Announcement -->
    <transition enter-active-class="transition-all duration-500 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100">
      <div v-if="gameEnded && winner" class="card p-6 text-center gradient-primary text-white">
        <div class="text-4xl mb-2">🏆</div>
        <h2 class="text-2xl font-bold">{{ t('game.winner', { name: winner.name }) }}</h2>
        <p class="text-sm opacity-75 mt-1">{{ t('game.endedOnTurn', { turn: turnCount }) }}</p>
        <div class="flex justify-center gap-3 mt-4">
          <button @click="resetGame" class="btn bg-white text-gray-900 hover:bg-gray-100">
            {{ t('actions.rematch') }}
          </button>
          <button @click="endGame" class="btn btn-secondary">
            {{ t('actions.newGame') }}
          </button>
        </div>
      </div>
    </transition>

    <!-- Team Display (for 2v2) -->
    <div v-if="isTeamGame && teams" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="space-y-4">
        <div class="card p-3 border-l-4 border-player-1" style="background-color: var(--color-bg-secondary);">
          <h3 class="font-bold player-1 text-center">
            {{ t('player.team', { n: 1 }) }} - {{ t('player.totalLP', { lp: teams.team1.totalLP.toLocaleString() }) }}
          </h3>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PlayerCard v-for="(player, index) in teams.team1.players" :key="player.id" :player="player"
            :player-index="index" />
        </div>
      </div>

      <div class="space-y-4">
        <div class="card p-3 border-l-4 border-player-2" style="background-color: var(--color-bg-secondary);">
          <h3 class="font-bold player-2 text-center">
            {{ t('player.team', { n: 2 }) }} - {{ t('player.totalLP', { lp: teams.team2.totalLP.toLocaleString() }) }}
          </h3>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PlayerCard v-for="(player, index) in teams.team2.players" :key="player.id" :player="player"
            :player-index="index + 2" />
        </div>
      </div>
    </div>

    <!-- Standard Player Display (for 1v1) -->
    <div v-else class="grid gap-4"
      :class="players.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'">
      <PlayerCard v-for="(player, index) in players" :key="player.id" :player="player" :player-index="index" />
    </div>
  </div>

  <!-- Game Tools Dialog -->
  <GameToolsDialog :is-open="showToolsDialog" :current-turn="turnCount" @close="showToolsDialog = false" />
</template>
