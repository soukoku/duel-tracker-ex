import { ref, reactive, computed, watch } from 'vue'

// Game mode configurations
export const GAME_MODES = {
  STANDARD_1V1: {
    id: 'standard_1v1',
    name: 'Standard 1v1',
    description: '8000 LP - Classic Format',
    startingLP: 8000,
    playerCount: 2,
    teams: 1,
  },
  SPEED_1V1: {
    id: 'speed_1v1',
    name: 'Speed Duel 1v1',
    description: '4000 LP - Speed Format',
    startingLP: 4000,
    playerCount: 2,
    teams: 1,
  },
  TAG_2V2: {
    id: 'tag_2v2',
    name: 'Tag Duel 2v2',
    description: '8000 LP per team',
    startingLP: 8000,
    playerCount: 4,
    teams: 2,
  },
  TAG_2V2_SPEED: {
    id: 'tag_2v2_speed',
    name: 'Speed Tag 2v2',
    description: '4000 LP per team',
    startingLP: 4000,
    playerCount: 4,
    teams: 2,
  },
  CUSTOM: {
    id: 'custom',
    name: 'Custom Game',
    description: 'Set your own rules',
    startingLP: 8000,
    playerCount: 2,
    teams: 1,
  },
}

// Create a player object
function createPlayer(id, name, startingLP, team = null) {
  return {
    id,
    name,
    lifePoints: startingLP,
    startingLP,
    team,
    history: [],
  }
}

// Main game state composable
export function useGameState() {
  const gameMode = ref(null)
  const players = reactive([])
  const gameStarted = ref(false)
  const gameEnded = ref(false)
  const winner = ref(null)
  const turnCount = ref(0)
  const customSettings = reactive({
    startingLP: 8000,
    playerCount: 2,
    useTeams: false,
  })

  // Computed properties
  const isTeamGame = computed(() => {
    if (!gameMode.value) return false
    return gameMode.value.teams === 2 || customSettings.useTeams
  })

  const teams = computed(() => {
    if (!isTeamGame.value) return null
    const team1 = players.filter(p => p.team === 1)
    const team2 = players.filter(p => p.team === 2)
    return {
      team1: {
        players: team1,
        totalLP: team1.reduce((sum, p) => sum + p.lifePoints, 0),
      },
      team2: {
        players: team2,
        totalLP: team2.reduce((sum, p) => sum + p.lifePoints, 0),
      },
    }
  })

  // Methods
  function selectGameMode(mode) {
    gameMode.value = mode
  }

  function initializeGame() {
    players.length = 0
    const mode = gameMode.value
    const startingLP = mode.id === 'custom' ? customSettings.startingLP : mode.startingLP
    const playerCount = mode.id === 'custom' ? customSettings.playerCount : mode.playerCount
    const useTeams = mode.teams === 2 || (mode.id === 'custom' && customSettings.useTeams)

    for (let i = 0; i < playerCount; i++) {
      const team = useTeams ? (i < playerCount / 2 ? 1 : 2) : null
      const playerName = useTeams 
        ? `Team ${team} - Player ${(i % (playerCount / 2)) + 1}`
        : `Player ${i + 1}`
      players.push(createPlayer(i + 1, playerName, startingLP, team))
    }

    gameStarted.value = true
    gameEnded.value = false
    winner.value = null
    turnCount.value = 1
  }

  function updatePlayerLP(playerId, amount) {
    const player = players.find(p => p.id === playerId)
    if (!player || gameEnded.value) return

    const previousLP = player.lifePoints
    player.lifePoints = Math.max(0, player.lifePoints + amount)
    
    player.history.push({
      turn: turnCount.value,
      previousLP,
      change: amount,
      newLP: player.lifePoints,
      timestamp: new Date().toISOString(),
    })

    checkWinCondition()
  }

  function setPlayerLP(playerId, newLP) {
    const player = players.find(p => p.id === playerId)
    if (!player || gameEnded.value) return

    const previousLP = player.lifePoints
    player.lifePoints = Math.max(0, newLP)
    
    player.history.push({
      turn: turnCount.value,
      previousLP,
      change: newLP - previousLP,
      newLP: player.lifePoints,
      timestamp: new Date().toISOString(),
    })

    checkWinCondition()
  }

  function checkWinCondition() {
    if (isTeamGame.value) {
      // Team game: check if all players on a team are at 0
      const team1AllOut = teams.value.team1.players.every(p => p.lifePoints <= 0)
      const team2AllOut = teams.value.team2.players.every(p => p.lifePoints <= 0)
      
      if (team1AllOut) {
        gameEnded.value = true
        winner.value = { type: 'team', id: 2, name: 'Team 2' }
      } else if (team2AllOut) {
        gameEnded.value = true
        winner.value = { type: 'team', id: 1, name: 'Team 1' }
      }
    } else {
      // 1v1 game: check if any player is at 0
      const loser = players.find(p => p.lifePoints <= 0)
      if (loser) {
        const winnerPlayer = players.find(p => p.lifePoints > 0)
        if (winnerPlayer) {
          gameEnded.value = true
          winner.value = { type: 'player', id: winnerPlayer.id, name: winnerPlayer.name }
        }
      }
    }
  }

  function nextTurn() {
    turnCount.value++
  }

  function resetGame() {
    players.forEach(player => {
      player.lifePoints = player.startingLP
      player.history = []
    })
    gameEnded.value = false
    winner.value = null
    turnCount.value = 1
  }

  function endGame() {
    gameStarted.value = false
    gameEnded.value = false
    gameMode.value = null
    players.length = 0
    winner.value = null
    turnCount.value = 0
  }

  function updatePlayerName(playerId, newName) {
    const player = players.find(p => p.id === playerId)
    if (player) {
      player.name = newName
    }
  }

  function updateCustomSettings(settings) {
    Object.assign(customSettings, settings)
  }

  function halveLP(playerId) {
    const player = players.find(p => p.id === playerId)
    if (!player || gameEnded.value) return
    
    const halfLP = Math.ceil(player.lifePoints / 2)
    updatePlayerLP(playerId, -halfLP)
  }

  return {
    // State
    gameMode,
    players,
    gameStarted,
    gameEnded,
    winner,
    turnCount,
    customSettings,
    
    // Computed
    isTeamGame,
    teams,
    
    // Methods
    selectGameMode,
    initializeGame,
    updatePlayerLP,
    setPlayerLP,
    nextTurn,
    resetGame,
    endGame,
    updatePlayerName,
    updateCustomSettings,
    halveLP,
  }
}

// Theme composable
export function useTheme() {
  const isDark = ref(false)

  // Check for saved preference or system preference
  function initTheme() {
    const savedTheme = localStorage.getItem('duel-tracker-theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('duel-tracker-theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  watch(isDark, applyTheme)

  return {
    isDark,
    initTheme,
    toggleTheme,
  }
}
