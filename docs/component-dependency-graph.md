# Component Dependency/Relation Graph

## Visual Dependency Tree

```
App.vue (Root Layout)
├── ThemeSelector.vue
│   └── useTheme composable
├── LanguageSelector.vue
│   └── useI18n composable (vue-i18n)
├── BackgroundMusicPlayer.vue
│   └── useBackgroundMusic composable
└── RouterView
    ├── HomePage.vue (Route: /)
    │   └── useGame composable (getSavedGameKeys)
    │
    └── GamePage.vue (Route: /game/:modeId)
        ├── useGame composable (per-route state)
        ├── GameInfoBar.vue
        ├── PlayerCard.vue
        │   ├── LPDisplay.vue
        │   ├── LPAdjuster.vue (combines quick buttons + calculator)
        │   └── LPHistory.vue
        └── GameToolsDialog.vue
            ├── CoinFlipTool.vue
            │   └── CoinFace.vue
            └── DiceRollTool.vue
                └── DiceFace.vue
```
