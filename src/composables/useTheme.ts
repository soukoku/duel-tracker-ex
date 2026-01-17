import { computed, watch } from 'vue'
import { useStorage, useDark, usePreferredDark } from '@vueuse/core'

// Simple theme metadata (colors and styles are defined in CSS)
export interface ThemeInfo {
  id: string
  name: string
  description: string
}

// Available themes
export const THEMES: ThemeInfo[] = [
  {
    id: 'egyptian',
    name: 'Egyptian',
    description: 'Ancient Egypt'
  },
  {
    id: 'kaiba-corp',
    name: 'Kaiba Corp',
    description: 'Futuristic Technology'
  }
]

// Theme composable - manages theme ID and dark mode, applies classes to root
export function useThemeSystem() {
  const currentThemeId = useStorage<string>('duel-tracker-theme-id', 'egyptian')
  const preferredDark = usePreferredDark()
  const isDark = useDark({
    storageKey: 'duel-tracker-dark-mode',
    initialValue: preferredDark.value ? 'dark' : 'light'
  })

  const currentTheme = computed(
    () => THEMES.find((t) => t.id === currentThemeId.value) || THEMES[0]
  )
  const availableThemes = computed(() => THEMES)

  function applyThemeClasses(): void {
    const root = document.documentElement

    // Remove all theme classes
    THEMES.forEach((theme) => {
      root.classList.remove(`theme-${theme.id}`)
    })

    // Add current theme class
    root.classList.add(`theme-${currentThemeId.value}`)
    
    // Dark mode class is automatically handled by useDark()
  }

  function initTheme(): void {
    applyThemeClasses()
  }

  function setTheme(themeId: string): void {
    const themeExists = THEMES.some((t) => t.id === themeId)
    if (themeExists) {
      currentThemeId.value = themeId
      applyThemeClasses()
    }
  }

  function toggleDarkMode(): void {
    isDark.value = !isDark.value
  }

  function setDarkMode(dark: boolean): void {
    isDark.value = dark
  }

  // Watch for theme changes (dark mode is handled by useDark)
  watch(currentThemeId, applyThemeClasses)

  return {
    currentThemeId,
    currentTheme,
    isDark,
    availableThemes,
    initTheme,
    setTheme,
    toggleDarkMode,
    setDarkMode
  }
}
