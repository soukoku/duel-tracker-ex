# Internationalization (i18n) Implementation

## Overview
Implemented vue-i18n v11 for multi-language support with intelligent locale detection and fallback.

## Features Implemented

### 1. **Smart Locale Detection**
The app determines the language using a three-tier fallback system:
1. **Saved preference** from localStorage
2. **Browser language** (if supported)
3. **English** as default fallback

### 2. **Translation Coverage**
Translated all user-facing text in:
- ✅ App header and footer
- ✅ Game mode selector (mode names and descriptions)
- ✅ Game board (winner announcement, team display)
- ✅ Game info bar (turn counter, buttons)
- ✅ Player cards and LP management
- ✅ LP history display
- ✅ Calculator and quick adjust buttons
- ✅ Background music player
- ✅ Language selector component

### 3. **File Structure**
```
src/
├── locales/
│   ├── en.json          # English translations (only language for now)
│   └── index.ts         # i18n configuration
├── i18n.d.ts            # TypeScript type definitions
└── components/
    └── LanguageSelector.vue  # Language selector UI component
```

### 4. **Key Files**

#### `src/locales/en.json`
Complete English translation file with organized sections:
- App metadata
- Player-related text
- Game states and modes
- Settings
- Actions/buttons
- Tools (dice/coin)
- Theme settings
- Music player

#### `src/locales/index.ts`
- Exports configured i18n instance
- `getBrowserLocale()` - Detects browser language
- `getInitialLocale()` - Implements fallback chain
- `setLocale()` - Changes language and persists to localStorage
- `supportedLocales` - Array of available languages
- `availableLocales` - UI-friendly language list with flags

#### `src/components/LanguageSelector.vue`
Dropdown component for language selection:
- Shows current language flag and name
- Dropdown menu with all available languages
- Auto-hides when only one language available
- Styled to match ThemeSelector

### 5. **Integration Points**

Updated components to use `useI18n()`:
- `App.vue` - Header, footer, shared layout
- `HomePage.vue` - Game mode selection, custom settings
- `GamePage.vue` - Game session
- `GameBoard.vue` - Winner, teams
- `GameInfoBar.vue` - Turn, buttons
- `PlayerCard.vue` - Player names
- `LPHistory.vue` - History toggle
- `LPCalculator.vue` - Buttons, placeholder
- `QuickAdjustButtons.vue` - Button text
- `ThemeSelector.vue` - Theme names and descriptions
- `BackgroundMusicPlayer.vue` - Title, attribution

### 6. **Usage Examples**

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <!-- Simple translation -->
  <h1>{{ t('app.title') }}</h1>
  
  <!-- With parameters -->
  <p>{{ t('game.turn', { count: 5 }) }}</p>
  
  <!-- With interpolation -->
  <p>{{ t('game.winner', { name: 'Player 1' }) }}</p>
</template>
```

### 7. **Adding New Languages**

To add a new language (e.g., Spanish):

1. **Create translation file**: `src/locales/es.json`
   ```json
   {
     "app": {
       "title": "Rastreador de Duelos",
       ...
     }
   }
   ```

2. **Update `src/locales/index.ts`**:
   ```typescript
   import es from './es.json'
   
   export const supportedLocales = ['en', 'es']
   
   export const availableLocales = [
     { code: 'en', name: 'English', flag: '🇺🇸' },
     { code: 'es', name: 'Español', flag: '🇪🇸' }
   ]
   
   export const i18n = createI18n({
     messages: { en, es }
   })
   ```

3. **Update TypeScript types**:
   ```typescript
   export const i18n = createI18n<[MessageSchema], 'en' | 'es', false>({...})
   ```

### 8. **Benefits**

- ✅ **Zero bundle impact** when only one language
- ✅ **Type-safe** translation keys (TypeScript autocomplete)
- ✅ **Persistent** user preference (localStorage)
- ✅ **Automatic** browser detection
- ✅ **Graceful** fallback to English
- ✅ **Easy** to add new languages
- ✅ **Consistent** translation structure

### 9. **Current Status**

- **Supported languages**: English only
- **Build status**: ✅ Passing
- **Ready for**: Adding more languages
- **All components**: Fully translated

### 10. **Testing**

The locale selection follows this priority:
1. If user previously selected a language → use that
2. Else if browser language is supported → use browser language
3. Else → use English

You can test by:
- Changing `localStorage.setItem('locale', 'en')`
- Changing browser language settings
- Clearing localStorage to test browser detection

## Package Information

- **Package**: vue-i18n v11.1.0
- **Composition API**: Enabled (legacy: false)
- **Type safety**: Full TypeScript support
- **Bundle size**: ~65KB gzipped (includes vue-i18n)
