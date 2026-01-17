# Vue Router Implementation - Route-Based Game State

## Overview
Implemented vue-router 4.5.0 to enable each game mode to have its own route with independent saved progress. The main page displays which games have saved states.

## Architecture Changes

### 1. Router Configuration (`src/router/index.ts`)
- Created router with two main routes:
  - `/` - Home page (game mode selection)
  - `/game/:modeId` - Game page for specific mode
- Uses HTML5 history mode for clean URLs

### 2. View Components

#### App.vue (Root Layout)
- Shared header with branding, language selector, and theme selector
- Clickable logo/title that navigates to home
- Footer with GitHub link
- Background music player
- RouterView for page content
- Initializes theme system on mount

#### HomePage (`src/views/HomePage.vue`)
- Displays game mode selection cards with saved progress indicators (💾)
- Shows custom settings panel when custom mode selected
- Navigates to game route when mode is selected
- Custom game settings stored in temporary localStorage before navigation

#### GamePage (`src/views/GamePage.vue`)
- Displays active game board for specific mode
- Accepts `modeId` as route parameter
- Initializes game with mode-specific storage
- Includes game tools dialog
- Clears saved state and navigates to home on End Game / New Game
- Redirects to home if invalid mode ID provided

### 3. Game State Management (`src/composables/useGame.ts`)

#### Updated `useGameState()` Function
```typescript
export function useGameState(
  i18nInstance?: { t: Composer['t'] }, 
  modeId?: string
)
```
- Now accepts optional `modeId` parameter
- Uses mode-specific storage key: `duel-tracker-game-{modeId}`
- Maintains backward compatibility with default key for non-routed usage

#### New Export: `getSavedGameKeys()`
```typescript
export function getSavedGameKeys(): string[]
```
- Scans localStorage for all saved game states
- Returns array of mode IDs that have saved progress
- Used by HomePage to show saved progress indicators

### 4. Updated Components

#### App.vue (Layout Component)
- Contains shared header, footer, and background music player
- RouterView for page content
- Manages theme initialization and page title translations
- Header is clickable and navigates to home route

#### HomePage.vue
- Game mode selection functionality merged directly into HomePage
- Shows 💾 badge on modes with saved progress
- Inline custom game settings panel
- Uses `getSavedGameKeys()` to display saved progress indicators

### 5. Main Entry Point (`src/main.ts`)
- Registers router before i18n
- Order: Vue app → router → i18n → mount

### 6. Translation Updates
Added new translation key across all locales:
```json
"game": {
  "savedProgress": "Saved Progress" // EN
  "savedProgress": "已保存进度" // zh-CN
  "savedProgress": "已儲存進度" // zh-TW
}
```

## Storage Keys

### Per-Mode Storage
Each game mode now has its own storage key:
- `duel-tracker-game-standard_1v1`
- `duel-tracker-game-speed_1v1`
- `duel-tracker-game-tag_2v2`
- `duel-tracker-game-tag_2v2_speed`
- `duel-tracker-game-custom`

### Temporary Storage
- `duel-tracker-custom-settings-temp` - Stores custom game settings during navigation

## User Flow

1. **Landing on Home Page**
   - User sees all available game modes
   - Modes with saved progress show a 💾 badge
   - User can select language and theme

2. **Starting a Game**
   - Click on any game mode → navigates to `/game/{modeId}`
   - GamePage initializes with mode-specific storage
   - If saved progress exists, game resumes from saved state
   - If no saved progress, new game starts

3. **Custom Game Flow**
   - Select custom mode on home page
   - Configure settings (LP, player count, teams)
   - Click "Start Game"
   - Settings stored temporarily
   - Navigates to `/game/custom`
   - GamePage loads temporary settings and initializes game
   - Temporary settings cleared after use

4. **During Game**
   - Click logo/title in header → returns to home page
   - Game state automatically saved to mode-specific storage
   - Can switch between games via home page

5. **Returning to Home**
   - Click "End Game" button or click header logo
   - Navigates back to `/`
   - Saved progress indicators update accordingly

## Benefits

### Independent Game States
- Play multiple game modes concurrently
- Each mode maintains its own:
  - Players and life points
  - Turn count
  - History
  - Game status

### Visual Feedback
- Clear indication of which games have active progress
- 💾 badge helps users identify resumable games

### URL-Based Navigation
- Clean URLs: `/game/standard_1v1`, `/game/speed_1v1`, etc.
- Shareable game links (state persists in localStorage)
- Browser back/forward navigation works naturally

### Backward Compatibility
- `useGameState()` without modeId still works
- Existing code patterns remain valid

## Technical Details

### Storage Pattern
```typescript
// Storage key generation
const storageKey = modeId 
  ? `${STORAGE_KEY_PREFIX}${modeId}` 
  : 'duel-tracker-game-state'

// Retrieve all saved games
function getSavedGameKeys(): string[] {
  const savedGames: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
      const modeId = key.replace(STORAGE_KEY_PREFIX, '')
      savedGames.push(modeId)
    }
  }
  return savedGames
}
```

### Router Integration
```typescript
// In HomePage.vue
function selectGameMode(mode: GameMode): void {
  router.push({ name: 'game', params: { modeId: mode.id } })
}

// In GamePage.vue
const props = defineProps<{
  modeId: string
}>()

const { ... } = useGameState({ t }, props.modeId)
```

## Files Changed/Created

### Created:
- `src/router/index.ts` - Router configuration
- `src/views/HomePage.vue` - Home page view with inline game mode selection
- `src/views/GamePage.vue` - Game page view

### Modified:
- `src/composables/useGame.ts` - Added modeId parameter and getSavedGameKeys()
- `src/App.vue` - Converted to layout component with shared header/footer/music
- `src/main.ts` - Added router registration
- `src/locales/en.json` - Added savedProgress translation
- `src/locales/zh-CN.json` - Added savedProgress translation
- `src/locales/zh-TW.json` - Added savedProgress translation
- `package.json` - Added vue-router 4.5.0 dependency

## Testing

### Manual Testing Checklist
- [x] Navigate to home page
- [ ] Start standard 1v1 game → verify URL changes to `/game/standard_1v1`
- [ ] Make LP changes → return to home → verify 💾 badge appears
- [ ] Start speed duel → verify it has separate state from standard
- [ ] Return to standard game → verify state persists
- [ ] Configure custom game → verify settings transfer correctly
- [ ] Test all three languages with route navigation
- [ ] Test theme switching across routes
- [ ] Test browser back/forward buttons

### Development Server
Running on: http://localhost:5174/

All TypeScript compilation successful with no errors.
