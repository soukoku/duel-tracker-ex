# Component Dependency/Relation Graph

## Visual Dependency Tree

```
App.vue (Root)
├── ThemeSelector.vue
│   └── useTheme composable
├── GameModeSelector.vue
│   └── useGame composable
├── GameBoard.vue
│   ├── GameInfoBar.vue
│   └── PlayerCard.vue
│       ├── LPDisplay.vue
│       ├── QuickAdjustButtons.vue
│       ├── LPCalculator.vue
│       └── LPHistory.vue
├── GameToolsDialog.vue
│   ├── CoinFlipTool.vue
│   │   └── CoinFace.vue
│   ├── DiceRollTool.vue
│   │   └── DiceFace.vue
│   └── ToolHistory.vue
└── BackgroundMusicPlayer.vue
    └── useBackgroundMusic composable
```
