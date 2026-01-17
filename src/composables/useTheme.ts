import { computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'

// Theme definitions
export interface ThemeColors {
  // Primary colors
  primary: string
  primaryHover: string
  primaryLight: string
  primaryDark: string
  
  // Secondary/Accent
  secondary: string
  secondaryHover: string
  accent: string
  accentHover: string
  
  // Gradient
  gradientFrom: string
  gradientTo: string
  
  // Text
  textPrimary: string
  textSecondary: string
  textMuted: string
  
  // Backgrounds
  bgPrimary: string
  bgSecondary: string
  bgCard: string
  bgHover: string
  
  // Borders
  border: string
  borderHover: string
  
  // Status colors
  success: string
  danger: string
  warning: string
  
  // Player colors
  player1: string
  player2: string
  player3: string
  player4: string
}

export interface Theme {
  id: string
  name: string
  description: string
  icon: string
  light: ThemeColors
  dark: ThemeColors
}

// Egyptian Theme - Season 1 inspired (Gold, Sand, Deep Blue)
const egyptianTheme: Theme = {
  id: 'egyptian',
  name: 'Egyptian',
  description: 'Ancient Egypt - Season 1',
  icon: '🏛️',
  light: {
    primary: '#C5A028',        // Gold
    primaryHover: '#A88A20',
    primaryLight: '#F5E6A3',
    primaryDark: '#8B7355',
    
    secondary: '#1E3A5F',      // Deep blue
    secondaryHover: '#152C4A',
    accent: '#D4AF37',         // Bright gold
    accentHover: '#B8972F',
    
    gradientFrom: '#C5A028',
    gradientTo: '#8B6914',
    
    textPrimary: '#1A1A2E',
    textSecondary: '#4A4A5A',
    textMuted: '#7A7A8A',
    
    bgPrimary: '#FDF8E8',      // Warm sand
    bgSecondary: '#F5EED6',
    bgCard: '#FFFEF9',
    bgHover: '#F0E8D0',
    
    border: '#E0D5B8',
    borderHover: '#C5A028',
    
    success: '#2D6A4F',
    danger: '#9B2C2C',
    warning: '#B7791F',
    
    player1: '#1E3A5F',        // Deep blue
    player2: '#9B2C2C',        // Dark red
    player3: '#2D6A4F',        // Forest green
    player4: '#744210',        // Brown
  },
  dark: {
    primary: '#D4AF37',        // Bright gold
    primaryHover: '#E5C158',
    primaryLight: '#5C4A1F',
    primaryDark: '#A88A20',
    
    secondary: '#3B5998',      // Lighter blue for dark mode
    secondaryHover: '#4A6BB5',
    accent: '#F5D742',         // Brighter gold
    accentHover: '#FFE55C',
    
    gradientFrom: '#D4AF37',
    gradientTo: '#C5A028',
    
    textPrimary: '#FDF8E8',
    textSecondary: '#D4C5A0',
    textMuted: '#A89880',
    
    bgPrimary: '#1A1A2E',      // Dark navy
    bgSecondary: '#252540',
    bgCard: '#2A2A45',
    bgHover: '#35355A',
    
    border: '#3D3D5C',
    borderHover: '#D4AF37',
    
    success: '#48BB78',
    danger: '#FC8181',
    warning: '#F6AD55',
    
    player1: '#63B3ED',        // Light blue
    player2: '#FC8181',        // Light red
    player3: '#68D391',        // Light green
    player4: '#F6AD55',        // Orange
  },
}

// Classic Purple Theme (Original app design)
const classicTheme: Theme = {
  id: 'classic',
  name: 'Classic',
  description: 'Original Purple & Pink',
  icon: '💜',
  light: {
    primary: '#7C3AED',
    primaryHover: '#6D28D9',
    primaryLight: '#EDE9FE',
    primaryDark: '#5B21B6',
    
    secondary: '#DB2777',
    secondaryHover: '#BE185D',
    accent: '#EC4899',
    accentHover: '#DB2777',
    
    gradientFrom: '#7C3AED',
    gradientTo: '#DB2777',
    
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    
    bgPrimary: '#F9FAFB',
    bgSecondary: '#F3F4F6',
    bgCard: '#FFFFFF',
    bgHover: '#E5E7EB',
    
    border: '#E5E7EB',
    borderHover: '#7C3AED',
    
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    
    player1: '#3B82F6',
    player2: '#EF4444',
    player3: '#10B981',
    player4: '#F59E0B',
  },
  dark: {
    primary: '#8B5CF6',
    primaryHover: '#A78BFA',
    primaryLight: '#4C1D95',
    primaryDark: '#7C3AED',
    
    secondary: '#EC4899',
    secondaryHover: '#F472B6',
    accent: '#F472B6',
    accentHover: '#F9A8D4',
    
    gradientFrom: '#8B5CF6',
    gradientTo: '#EC4899',
    
    textPrimary: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    
    bgPrimary: '#111827',
    bgSecondary: '#1F2937',
    bgCard: '#1F2937',
    bgHover: '#374151',
    
    border: '#374151',
    borderHover: '#8B5CF6',
    
    success: '#34D399',
    danger: '#F87171',
    warning: '#FBBF24',
    
    player1: '#60A5FA',
    player2: '#F87171',
    player3: '#34D399',
    player4: '#FBBF24',
  },
}

// Shadow Realm Theme (Dark, mysterious)
const shadowRealmTheme: Theme = {
  id: 'shadow-realm',
  name: 'Shadow Realm',
  description: 'Dark & Mysterious',
  icon: '🌑',
  light: {
    primary: '#4A0E4E',
    primaryHover: '#3D0B40',
    primaryLight: '#E9D5EA',
    primaryDark: '#2D0630',
    
    secondary: '#1A1A2E',
    secondaryHover: '#0F0F1A',
    accent: '#9333EA',
    accentHover: '#7E22CE',
    
    gradientFrom: '#4A0E4E',
    gradientTo: '#1A1A2E',
    
    textPrimary: '#1A1A2E',
    textSecondary: '#4A4A5A',
    textMuted: '#7A7A8A',
    
    bgPrimary: '#F5F3F7',
    bgSecondary: '#EBE8EE',
    bgCard: '#FFFFFF',
    bgHover: '#E0DCE5',
    
    border: '#D5D0DC',
    borderHover: '#4A0E4E',
    
    success: '#059669',
    danger: '#DC2626',
    warning: '#D97706',
    
    player1: '#4A0E4E',
    player2: '#DC2626',
    player3: '#059669',
    player4: '#7C3AED',
  },
  dark: {
    primary: '#9333EA',
    primaryHover: '#A855F7',
    primaryLight: '#3B0764',
    primaryDark: '#7E22CE',
    
    secondary: '#6366F1',
    secondaryHover: '#818CF8',
    accent: '#C084FC',
    accentHover: '#D8B4FE',
    
    gradientFrom: '#9333EA',
    gradientTo: '#4F46E5',
    
    textPrimary: '#F3E8FF',
    textSecondary: '#C4B5FD',
    textMuted: '#8B5CF6',
    
    bgPrimary: '#0A0A0F',
    bgSecondary: '#12121A',
    bgCard: '#1A1A25',
    bgHover: '#252530',
    
    border: '#2D2D3A',
    borderHover: '#9333EA',
    
    success: '#10B981',
    danger: '#F87171',
    warning: '#FBBF24',
    
    player1: '#A855F7',
    player2: '#F87171',
    player3: '#34D399',
    player4: '#60A5FA',
  },
}

// All available themes
export const THEMES: Record<string, Theme> = {
  egyptian: egyptianTheme,
  classic: classicTheme,
  'shadow-realm': shadowRealmTheme,
}

// Theme composable using VueUse's useStorage for persistence
export function useThemeSystem() {
  // Use useStorage for automatic persistence
  const currentThemeId = useStorage<string>('duel-tracker-theme-id', 'egyptian')
  const isDark = useStorage<boolean>('duel-tracker-dark-mode', 
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  )
  
  const currentTheme = computed(() => THEMES[currentThemeId.value] || THEMES.egyptian)
  const colors = computed(() => isDark.value ? currentTheme.value.dark : currentTheme.value.light)
  const availableThemes = computed(() => Object.values(THEMES))

  function applyThemeColors(): void {
    const root = document.documentElement
    const c = colors.value
    
    // Apply CSS custom properties
    root.style.setProperty('--color-primary', c.primary)
    root.style.setProperty('--color-primary-hover', c.primaryHover)
    root.style.setProperty('--color-primary-light', c.primaryLight)
    root.style.setProperty('--color-primary-dark', c.primaryDark)
    
    root.style.setProperty('--color-secondary', c.secondary)
    root.style.setProperty('--color-secondary-hover', c.secondaryHover)
    root.style.setProperty('--color-accent', c.accent)
    root.style.setProperty('--color-accent-hover', c.accentHover)
    
    root.style.setProperty('--color-gradient-from', c.gradientFrom)
    root.style.setProperty('--color-gradient-to', c.gradientTo)
    
    root.style.setProperty('--color-text-primary', c.textPrimary)
    root.style.setProperty('--color-text-secondary', c.textSecondary)
    root.style.setProperty('--color-text-muted', c.textMuted)
    
    root.style.setProperty('--color-bg-primary', c.bgPrimary)
    root.style.setProperty('--color-bg-secondary', c.bgSecondary)
    root.style.setProperty('--color-bg-card', c.bgCard)
    root.style.setProperty('--color-bg-hover', c.bgHover)
    
    root.style.setProperty('--color-border', c.border)
    root.style.setProperty('--color-border-hover', c.borderHover)
    
    root.style.setProperty('--color-success', c.success)
    root.style.setProperty('--color-danger', c.danger)
    root.style.setProperty('--color-warning', c.warning)
    
    root.style.setProperty('--color-player-1', c.player1)
    root.style.setProperty('--color-player-2', c.player2)
    root.style.setProperty('--color-player-3', c.player3)
    root.style.setProperty('--color-player-4', c.player4)
    
    // Apply dark class
    if (isDark.value) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  function initTheme(): void {
    // useStorage already loads saved values, just apply them
    applyThemeColors()
  }

  function setTheme(themeId: string): void {
    if (THEMES[themeId]) {
      currentThemeId.value = themeId
      // useStorage automatically persists
      applyThemeColors()
    }
  }

  function toggleDarkMode(): void {
    isDark.value = !isDark.value
    // useStorage automatically persists
    applyThemeColors()
  }

  function setDarkMode(dark: boolean): void {
    isDark.value = dark
    // useStorage automatically persists
    applyThemeColors()
  }

  // Watch for changes
  watch([currentThemeId, isDark], applyThemeColors)

  return {
    currentThemeId,
    currentTheme,
    isDark,
    colors,
    availableThemes,
    initTheme,
    setTheme,
    toggleDarkMode,
    setDarkMode,
  }
}
