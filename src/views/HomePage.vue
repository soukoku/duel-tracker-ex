<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { GAME_MODES, type GameMode, type CustomSettings, getSavedGameKeys } from '../composables/useGame'

const { t } = useI18n()
const router = useRouter()

// Game modes
const gameModes = Object.values(GAME_MODES)

// Selected mode tracking
const selectedModeId = ref<string | null>(null)

// Custom settings state
const customSettings = ref<CustomSettings>({
  startingLP: 8000,
  playerCount: 2,
  useTeams: false,
})

// Get saved games
const savedGames = computed(() => getSavedGameKeys())

function selectGameMode(mode: GameMode): void {
  if (mode.id === 'custom') {
    selectedModeId.value = mode.id
  } else {
    router.push({ name: 'game', params: { modeId: mode.id } })
  }
}

function startCustomGame(): void {
  // Pass custom settings via router state
  router.push({ 
    name: 'game', 
    params: { modeId: 'custom' },
    state: { customSettings: customSettings.value }
  })
}

function hasSavedGame(modeId: string): boolean {
  return savedGames.value.includes(modeId)
}

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

function getModeName(modeId: string): string {
  const modeKey = modeId === 'standard_1v1' ? 'standard' : 
                  modeId === 'speed_1v1' ? 'speed' :
                  modeId.startsWith('tag_') ? 'tag' : 
                  'custom'
  return t(`modes.${modeKey}.name`)
}

function getModeDescription(modeId: string): string {
  const modeKey = modeId === 'standard_1v1' ? 'standard' : 
                  modeId === 'speed_1v1' ? 'speed' :
                  modeId.startsWith('tag_') ? 'tag' : 
                  'custom'
  return t(`modes.${modeKey}.description`)
}
</script>

<template>
  <div class="space-y-6">
    <div class="card p-4 sm:p-6">
      <h2 class="text-lg sm:text-xl font-bold text-themed mb-4">
        {{ t('game.selectMode') }}
      </h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="mode in gameModes"
          :key="mode.id"
          @click="selectGameMode(mode)"
          class="card p-4 text-left hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer group relative"
          :class="{ 'ring-2 ring-primary': selectedModeId === mode.id }"
        >
          <!-- Saved Progress Badge -->
          <div 
            v-if="hasSavedGame(mode.id)" 
            class="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full bg-success text-white shadow-md"
            :title="t('game.savedProgress')"
          >
            💾
          </div>
          
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-bold text-themed group-hover:text-themed-primary transition-colors">
                {{ getModeName(mode.id) }}
              </h3>
              <p class="text-sm text-themed-muted mt-1">
                {{ getModeDescription(mode.id) }}
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
    <div v-if="selectedModeId === 'custom'" class="card p-4 sm:p-6">
      <h2 class="text-lg sm:text-xl font-bold text-themed mb-4">
        {{ t('game.customSettings') }}
      </h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-themed-secondary mb-2">
            {{ t('settings.startingLP') }}
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
            {{ t('settings.playerCount') }}
          </label>
          <select 
            v-model.number="customSettings.playerCount"
            class="input"
          >
            <option :value="2">{{ t('settings.players', { count: 2 }) }}</option>
            <option :value="3">{{ t('settings.players', { count: 3 }) }}</option>
            <option :value="4">{{ t('settings.players', { count: 4 }) }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-themed-secondary mb-2">
            {{ t('settings.teamMode') }}
          </label>
          <button
            @click="customSettings.useTeams = !customSettings.useTeams"
            class="w-full input flex items-center justify-between"
            :disabled="customSettings.playerCount < 4"
          >
            <span>{{ customSettings.useTeams ? t('settings.teamsEnabled') : t('settings.noTeams') }}</span>
            <span :class="customSettings.useTeams ? 'text-success' : 'text-themed-muted'">
              {{ customSettings.useTeams ? '✓' : '✗' }}
            </span>
          </button>
        </div>
      </div>
      
      <button
        @click="startCustomGame"
        class="btn btn-primary w-full mt-4"
      >
        {{ t('actions.startGame') }}
      </button>
    </div>
  </div>
</template>
