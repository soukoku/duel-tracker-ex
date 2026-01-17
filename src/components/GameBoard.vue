<template>
  <div class="space-y-4">
    <!-- Game Info Bar -->
    <GameInfoBar
      :mode-name="gameMode?.name ?? 'Game'"
      :turn-count="turnCount"
      @open-tools="$emit('open-tools')"
      @next-turn="$emit('next-turn')"
      @reset="$emit('reset-game')"
      @end="$emit('end-game')"
    />

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
          <button @click="$emit('reset-game')" class="btn bg-white text-gray-900 hover:bg-gray-100">
            Rematch
          </button>
          <button @click="$emit('end-game')" class="btn btn-secondary">
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
            @update-lp="(id, amount) => $emit('update-lp', id, amount)"
            @set-lp="(id, lp) => $emit('set-lp', id, lp)"
            @update-name="(id, name) => $emit('update-name', id, name)"
            @halve-lp="(id) => $emit('halve-lp', id)"
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
            @update-lp="(id, amount) => $emit('update-lp', id, amount)"
            @set-lp="(id, lp) => $emit('set-lp', id, lp)"
            @update-name="(id, name) => $emit('update-name', id, name)"
            @halve-lp="(id) => $emit('halve-lp', id)"
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
        @update-lp="(id, amount) => $emit('update-lp', id, amount)"
        @set-lp="(id, lp) => $emit('set-lp', id, lp)"
        @update-name="(id, name) => $emit('update-name', id, name)"
        @halve-lp="(id) => $emit('halve-lp', id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayerCard from './PlayerCard.vue'
import GameInfoBar from './GameInfoBar.vue'
import type { Player, Winner, Teams, GameMode } from '../composables/useGame'

defineProps<{
  gameMode: GameMode | null
  players: Player[]
  isTeamGame: boolean
  teams: Teams | null
  gameEnded: boolean
  winner: Winner | null
  turnCount: number
}>()

defineEmits<{
  'update-lp': [playerId: number, amount: number]
  'set-lp': [playerId: number, newLP: number]
  'update-name': [playerId: number, newName: string]
  'halve-lp': [playerId: number]
  'open-tools': []
  'next-turn': []
  'reset-game': []
  'end-game': []
}>()
</script>
