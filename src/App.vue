<template>
  <div class="min-h-screen p-4 sm:p-6 space-y-6 bg-themed">
    <!-- Header -->
    <header class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 sm:w-12 sm:h-12 gradient-primary-br rounded-xl flex items-center justify-center shadow-lg">
          <span class="text-white font-bold text-lg sm:text-xl">LP</span>
        </div>
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
    <div v-if="!gameStarted" class="space-y-6">
      <div class="card p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-bold text-themed mb-4">
          Select Game Mode
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="mode in gameModes"
            :key="mode.id"
            @click="selectAndInitGame(mode)"
            class="card p-4 text-left hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
            :class="{ 'ring-2 ring-[var(--color-primary)]': gameMode?.id === mode.id }"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-bold text-themed group-hover:text-themed-primary transition-colors">
                  {{ mode.name }}
                </h3>
                <p class="text-sm text-themed-muted mt-1">
                  {{ mode.description }}
                </p>
              </div>
              <div class="text-2xl">
                {{ getModeIcon(mode.id) }}
              </div>
            </div>
            <div class="mt-3 flex gap-2">
              <span class="px-2 py-1 text-xs font-medium rounded-full" style="background-color: var(--color-primary-light); color: var(--color-primary-dark);">
                {{ mode.startingLP }} LP
              </span>
              <span class="px-2 py-1 text-xs font-medium rounded-full" style="background-color: var(--color-bg-secondary); color: var(--color-secondary);">
                {{ mode.playerCount }} Players
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Custom Settings -->
      <div v-if="gameMode?.id === 'custom'" class="card p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-bold text-themed mb-4">
          Custom Settings
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-themed-secondary mb-2">
              Starting Life Points
            </label>
            <input
              v-model.number="customSettings.startingLP"
              type="number"
              class="input"
              min="100"
              step="100"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-themed-secondary mb-2">
              Number of Players
            </label>
            <select v-model.number="customSettings.playerCount" class="input">
              <option :value="2">2 Players</option>
              <option :value="3">3 Players</option>
              <option :value="4">4 Players</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-themed-secondary mb-2">
              Team Mode
            </label>
            <button
              @click="customSettings.useTeams = !customSettings.useTeams"
              class="w-full input flex items-center justify-between"
              :disabled="customSettings.playerCount < 4"
            >
              <span>{{ customSettings.useTeams ? 'Teams Enabled' : 'No Teams' }}</span>
              <span :class="customSettings.useTeams ? 'text-success' : 'text-themed-muted'">
                {{ customSettings.useTeams ? '✓' : '✗' }}
              </span>
            </button>
          </div>
        </div>
        
        <button
          @click="initializeGame"
          class="btn btn-primary w-full mt-4"
        >
          Start Custom Game
        </button>
      </div>
    </div>

    <!-- Game Board -->
    <div v-else class="space-y-4">
      <!-- Game Info Bar -->
      <div class="card p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full text-sm font-medium" style="background-color: var(--color-primary-light); color: var(--color-primary-dark);">
            {{ gameMode?.name }}
          </span>
          <span class="text-themed-muted text-sm">
            Turn {{ turnCount }}
          </span>
        </div>
        
        <div class="flex gap-2">
          <button @click="nextTurn" class="btn btn-secondary text-sm">
            Next Turn
          </button>
          <button @click="resetGame" class="btn btn-secondary text-sm">
            Reset
          </button>
          <button @click="endGame" class="btn btn-danger text-sm">
            End Game
          </button>
        </div>
      </div>

      <!-- Winner Announcement -->
      <transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
      >
        <div 
          v-if="gameEnded && winner" 
          class="card p-6 text-center gradient-primary text-white"
        >
          <div class="text-4xl mb-2">🏆</div>
          <h2 class="text-2xl font-bold">{{ winner.name }} Wins!</h2>
          <p class="text-sm opacity-75 mt-1">Game ended on Turn {{ turnCount }}</p>
          <div class="flex justify-center gap-3 mt-4">
            <button @click="resetGame" class="btn bg-white text-gray-900 hover:bg-gray-100">
              Rematch
            </button>
            <button @click="endGame" class="btn btn-secondary">
              New Game
            </button>
          </div>
        </div>
      </transition>

      <!-- Team Display (for 2v2) -->
      <div v-if="isTeamGame && teams" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="space-y-4">
          <div class="card p-3 border-l-4 border-player-1" style="background-color: var(--color-bg-secondary);">
            <h3 class="font-bold player-1 text-center">
              Team 1 - Total: {{ teams.team1.totalLP.toLocaleString() }} LP
            </h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PlayerCard
              v-for="(player, index) in teams.team1.players"
              :key="player.id"
              :player="player"
              :player-index="index"
              @update-lp="updatePlayerLP"
              @set-lp="setPlayerLP"
              @update-name="updatePlayerName"
              @halve-lp="halveLP"
            />
          </div>
        </div>
        
        <div class="space-y-4">
          <div class="card p-3 border-l-4 border-player-2" style="background-color: var(--color-bg-secondary);">
            <h3 class="font-bold player-2 text-center">
              Team 2 - Total: {{ teams.team2.totalLP.toLocaleString() }} LP
            </h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PlayerCard
              v-for="(player, index) in teams.team2.players"
              :key="player.id"
              :player="player"
              :player-index="index + 2"
              @update-lp="updatePlayerLP"
              @set-lp="setPlayerLP"
              @update-name="updatePlayerName"
              @halve-lp="halveLP"
            />
          </div>
        </div>
      </div>

      <!-- Standard Player Display (for 1v1) -->
      <div 
        v-else 
        class="grid gap-4"
        :class="players.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'"
      >
        <PlayerCard
          v-for="(player, index) in players"
          :key="player.id"
          :player="player"
          :player-index="index"
          @update-lp="updatePlayerLP"
          @set-lp="setPlayerLP"
          @update-name="updatePlayerName"
          @halve-lp="halveLP"
        />
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center text-sm text-themed-muted pt-4">
      <p>Yu-Gi-Oh! Duel Tracker • Track your duels with ease</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PlayerCard from './components/PlayerCard.vue'
import ThemeSelector from './components/ThemeSelector.vue'
import { useGameState, GAME_MODES, type GameMode } from './composables/useGame'
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

// Game modes array for iteration
const gameModes = Object.values(GAME_MODES)

// Initialize theme on mount
onMounted(() => {
  initTheme()
})

// Helper functions
function getModeIcon(modeId: string): string {
  const icons: Record<string, string> = {
    standard_1v1: '⚔️',
    speed_1v1: '⚡',
    tag_2v2: '👥',
    tag_2v2_speed: '🏃',
    custom: '⚙️',
  }
  return icons[modeId] || '🎮'
}

function selectAndInitGame(mode: GameMode): void {
  selectGameMode(mode)
  if (mode.id !== 'custom') {
    initializeGame()
  }
}
</script>
