<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PlayerCard from './PlayerCard.vue'
import GameInfoBar from './GameInfoBar.vue'
import type { Player, Winner, Teams, GameMode } from '../composables/useGame'

const { t } = useI18n()

function getModeName(mode: GameMode | null): string {
  if (!mode) return 'Game'
  const modeKey = mode.id === 'standard_1v1' ? 'standard' : 
                  mode.id === 'speed_1v1' ? 'speed' :
                  mode.id.startsWith('tag_') ? 'tag' : 
                  'custom'
  return t(`modes.${modeKey}.name`)
}

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
  'open-tools': []
  'next-turn': []
  'reset-game': []
  'end-game': []
}>()
</script>

<template>
  <div class="space-y-4">
    <!-- Game Info Bar -->
    <GameInfoBar
      :mode-name="getModeName(gameMode)"
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
        <h2 class="text-2xl font-bold">{{ t('game.winner', { name: winner.name }) }}</h2>
        <p class="text-sm opacity-75 mt-1">{{ t('game.endedOnTurn', { turn: turnCount }) }}</p>
        <div class="flex justify-center gap-3 mt-4">
          <button @click="$emit('reset-game')" class="btn bg-white text-gray-900 hover:bg-gray-100">
            {{ t('actions.rematch') }}
          </button>
          <button @click="$emit('end-game')" class="btn btn-secondary">
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
          <PlayerCard
            v-for="(player, index) in teams.team1.players"
            :key="player.id"
            :player="player"
            :player-index="index"
          />
        </div>
      </div>
      
      <div class="space-y-4">
        <div class="card p-3 border-l-4 border-player-2" style="background-color: var(--color-bg-secondary);">
          <h3 class="font-bold player-2 text-center">
            {{ t('player.team', { n: 2 }) }} - {{ t('player.totalLP', { lp: teams.team2.totalLP.toLocaleString() }) }}
          </h3>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PlayerCard
            v-for="(player, index) in teams.team2.players"
            :key="player.id"
            :player="player"
            :player-index="index + 2"
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
      />
    </div>
  </div>
</template>
