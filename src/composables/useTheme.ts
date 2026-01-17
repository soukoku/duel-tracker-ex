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

// Extended styling properties beyond colors
export interface ThemeStyles {
  // Border radius
  radiusSmall: string
  radiusMedium: string
  radiusLarge: string
  radiusCard: string
  
  // Shadows
  shadowCard: string
  shadowElevated: string
  shadowGlow: string
  
  // Spacing
  cardPadding: string
  cardGap: string
  
  // Typography
  fontFamily: string
  fontFamilyDisplay: string
  titleWeight: string
  
  // Button styles
  buttonRadius: string
  buttonPadding: string
  
  // Animations
  transitionSpeed: string
  animationIntensity: string // 'none' | 'subtle' | 'moderate' | 'intense'
  
  // Background patterns/images
  bgPattern: string
  bgOverlay: string
  
  // Special effects
  glowColor: string
  glowIntensity: string
}

export interface Theme {
  id: string
  name: string
  description: string
  icon: string
  light: ThemeColors
  dark: ThemeColors
  styles: ThemeStyles
}

// Egyptian Theme - Season 1 inspired (Gold, Sand, Deep Blue)
const egyptianTheme: Theme = {
  id: 'egyptian',
  name: 'Egyptian',
  description: 'Ancient Egypt - Season 1',
  icon: '🏛️',
  styles: {
    // Angular, hieroglyphic-inspired corners
    radiusSmall: '2px',
    radiusMedium: '4px',
    radiusLarge: '8px',
    radiusCard: '4px',
    
    // Golden glow shadows
    shadowCard: '0 4px 20px -2px rgba(197, 160, 40, 0.15), 0 2px 8px -2px rgba(0, 0, 0, 0.1)',
    shadowElevated: '0 8px 30px -4px rgba(197, 160, 40, 0.25), 0 4px 12px -2px rgba(0, 0, 0, 0.15)',
    shadowGlow: '0 0 20px rgba(212, 175, 55, 0.4)',
    
    // Generous spacing for regal feel
    cardPadding: '1.5rem',
    cardGap: '1.25rem',
    
    // Egyptian-inspired typography
    fontFamily: '"Cinzel", "Times New Roman", serif',
    fontFamilyDisplay: '"Cinzel Decorative", "Cinzel", serif',
    titleWeight: '700',
    
    // Angular buttons
    buttonRadius: '2px',
    buttonPadding: '0.75rem 1.5rem',
    
    // Moderate animations with golden shimmer
    transitionSpeed: '0.3s',
    animationIntensity: 'moderate',
    
    // Hieroglyphic/papyrus pattern
    bgPattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L35 15H25L30 5zM15 30L5 25V35L15 30zM45 30L55 35V25L45 30zM30 55L25 45H35L30 55z' fill='%23C5A028' fill-opacity='0.03'/%3E%3Cpath d='M30 20a10 10 0 100 20 10 10 0 000-20zm0 5a5 5 0 110 10 5 5 0 010-10z' fill='%23C5A028' fill-opacity='0.02'/%3E%3C/svg%3E")`,
    bgOverlay: 'linear-gradient(180deg, transparent 0%, rgba(197, 160, 40, 0.03) 100%)',
    
    // Golden glow effects
    glowColor: 'rgba(212, 175, 55, 0.5)',
    glowIntensity: '15px',
  },
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

// Shadow Realm Theme (Dark, mysterious)
const shadowRealmTheme: Theme = {
  id: 'shadow-realm',
  name: 'Shadow Realm',
  description: 'Dark & Mysterious',
  icon: '🌑',
  styles: {
    // Soft, ethereal corners
    radiusSmall: '8px',
    radiusMedium: '12px',
    radiusLarge: '20px',
    radiusCard: '16px',
    
    // Mysterious purple glow
    shadowCard: '0 4px 25px -5px rgba(147, 51, 234, 0.2), 0 2px 10px -2px rgba(0, 0, 0, 0.3)',
    shadowElevated: '0 10px 40px -8px rgba(147, 51, 234, 0.35), 0 4px 15px -3px rgba(0, 0, 0, 0.25)',
    shadowGlow: '0 0 30px rgba(147, 51, 234, 0.5)',
    
    // Compact, mysterious spacing
    cardPadding: '1.25rem',
    cardGap: '1rem',
    
    // Mystical typography
    fontFamily: '"Philosopher", "Georgia", serif',
    fontFamilyDisplay: '"Creepster", "Philosopher", cursive',
    titleWeight: '600',
    
    // Rounded buttons
    buttonRadius: '12px',
    buttonPadding: '0.625rem 1.25rem',
    
    // Intense, swirling animations
    transitionSpeed: '0.4s',
    animationIntensity: 'intense',
    
    // Swirling shadow pattern
    bgPattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='25' cy='25' r='20' fill='none' stroke='%239333EA' stroke-opacity='0.03' stroke-width='1'/%3E%3Ccircle cx='75' cy='75' r='25' fill='none' stroke='%239333EA' stroke-opacity='0.02' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='35' fill='none' stroke='%234F46E5' stroke-opacity='0.02' stroke-width='1'/%3E%3C/svg%3E")`,
    bgOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(147, 51, 234, 0.08) 0%, transparent 70%)',
    
    // Purple ethereal glow
    glowColor: 'rgba(147, 51, 234, 0.6)',
    glowIntensity: '25px',
  },
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
  const styles = computed(() => currentTheme.value.styles)
  const availableThemes = computed(() => Object.values(THEMES))

  function applyThemeColors(): void {
    const root = document.documentElement
    const c = colors.value
    const s = styles.value
    
    // Apply color CSS custom properties
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
    
    // Apply style CSS custom properties
    root.style.setProperty('--radius-small', s.radiusSmall)
    root.style.setProperty('--radius-medium', s.radiusMedium)
    root.style.setProperty('--radius-large', s.radiusLarge)
    root.style.setProperty('--radius-card', s.radiusCard)
    
    root.style.setProperty('--shadow-card', s.shadowCard)
    root.style.setProperty('--shadow-elevated', s.shadowElevated)
    root.style.setProperty('--shadow-glow', s.shadowGlow)
    
    root.style.setProperty('--card-padding', s.cardPadding)
    root.style.setProperty('--card-gap', s.cardGap)
    
    root.style.setProperty('--font-family', s.fontFamily)
    root.style.setProperty('--font-family-display', s.fontFamilyDisplay)
    root.style.setProperty('--title-weight', s.titleWeight)
    
    root.style.setProperty('--button-radius', s.buttonRadius)
    root.style.setProperty('--button-padding', s.buttonPadding)
    
    root.style.setProperty('--transition-speed', s.transitionSpeed)
    root.style.setProperty('--animation-intensity', s.animationIntensity)
    
    root.style.setProperty('--bg-pattern', s.bgPattern)
    root.style.setProperty('--bg-overlay', s.bgOverlay)
    
    root.style.setProperty('--glow-color', s.glowColor)
    root.style.setProperty('--glow-intensity', s.glowIntensity)
    
    // Apply theme class to body for theme-specific CSS
    document.body.classList.remove('theme-egyptian', 'theme-shadow-realm')
    document.body.classList.add(`theme-${currentTheme.value.id}`)
    
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
    styles,
    availableThemes,
    initTheme,
    setTheme,
    toggleDarkMode,
    setDarkMode,
  }
}
