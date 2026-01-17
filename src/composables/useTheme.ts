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
  description: 'Ancient Egypt',
  icon: '',
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
    
    // Hieroglyphic pattern - Eye of Horus, Ankh, scarab, and Egyptian symbols
    bgPattern: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.h{fill:%23B8860B;fill-opacity:0.04}%3C/style%3E%3C/defs%3E%3C!-- Ankh --%3E%3Cpath class='h' d='M30 45c0-8.3 6.7-15 15-15s15 6.7 15 15c0 5-2.5 9.5-6.3 12.2L53 58v12h-6v20h-4V70h-6V58l-.7-.8C32.5 54.5 30 50 30 45zm15-9c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z'/%3E%3C!-- Eye of Horus --%3E%3Cpath class='h' d='M140 35c-15 0-28 8-35 20 7 12 20 20 35 20s28-8 35-20c-7-12-20-20-35-20zm0 32c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12zm0-18c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z'/%3E%3Cpath class='h' d='M125 60l-8 15h-12l10-15h10zm30 0l8 15h12l-10-15h-10z'/%3E%3C!-- Scarab --%3E%3Cellipse class='h' cx='45' cy='140' rx='18' ry='12'/%3E%3Ccircle class='h' cx='45' cy='125' r='8'/%3E%3Cpath class='h' d='M30 135l-10-8M60 135l10-8M30 145l-12 5M60 145l12 5M35 152v10M55 152v10'/%3E%3C!-- Pyramid --%3E%3Cpath class='h' d='M140 120l25 45h-50z'/%3E%3Cpath class='h' d='M140 120l-5 45h10z' fill-opacity='0.02'/%3E%3C!-- Lotus --%3E%3Cpath class='h' d='M95 170c0-10 5-18 5-18s5 8 5 18c0 5-2.2 10-5 10s-5-5-5-10z'/%3E%3Cpath class='h' d='M85 175c5-8 15-10 15-10s-2 12-7 17c-3 3-8 2-10-2s-1-8 2-5z'/%3E%3Cpath class='h' d='M105 175c-5-8-15-10-15-10s2 12 7 17c3 3 8 2 10-2s1-8-2-5z'/%3E%3C!-- Wavy water lines --%3E%3Cpath class='h' d='M10 95q10-5 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0' fill='none' stroke='%23B8860B' stroke-opacity='0.03' stroke-width='2'/%3E%3Cpath class='h' d='M10 105q10-5 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0' fill='none' stroke='%23B8860B' stroke-opacity='0.03' stroke-width='2'/%3E%3C/svg%3E")`,
    bgOverlay: 'linear-gradient(180deg, transparent 0%, rgba(197, 160, 40, 0.02) 50%, rgba(197, 160, 40, 0.04) 100%)',
    
    // Golden glow effects
    glowColor: 'rgba(212, 175, 55, 0.5)',
    glowIntensity: '15px',
  },
  light: {
    primary: '#B8860B',        // Darker gold for better contrast
    primaryHover: '#996F0A',
    primaryLight: '#FDF3D0',   // Lighter background for badges
    primaryDark: '#705A10',    // Darker for text on light badges
    
    secondary: '#1E3A5F',      // Deep blue
    secondaryHover: '#152C4A',
    accent: '#B8860B',         // Match primary for consistency
    accentHover: '#996F0A',
    
    gradientFrom: '#C5A028',
    gradientTo: '#8B6914',
    
    textPrimary: '#1A1408',    // Very dark brown-black for max contrast
    textSecondary: '#3D3520',  // Dark brown
    textMuted: '#5C5240',      // Medium brown (still readable)
    
    bgPrimary: '#FDF8E8',      // Warm sand
    bgSecondary: '#F5EED6',
    bgCard: '#FFFEF9',
    bgHover: '#F0E8D0',
    
    border: '#D4C9A8',         // Slightly darker border
    borderHover: '#B8860B',
    
    success: '#1D5A3F',        // Darker green
    danger: '#8B1A1A',         // Darker red
    warning: '#8B5A00',        // Darker orange
    
    player1: '#1E3A5F',        // Deep blue
    player2: '#8B1A1A',        // Dark red
    player3: '#1D5A3F',        // Forest green
    player4: '#5C3510',        // Darker brown
  },
  dark: {
    primary: '#E5C158',        // Brighter gold for dark mode
    primaryHover: '#F0D06A',
    primaryLight: '#3D3520',   // Dark gold-brown for badge backgrounds
    primaryDark: '#E5C158',    // Bright gold for text on dark badges
    
    secondary: '#5B8BD0',      // Brighter blue for dark mode
    secondaryHover: '#6E9CE0',
    accent: '#F5D742',         // Bright gold
    accentHover: '#FFE55C',
    
    gradientFrom: '#E5C158',
    gradientTo: '#C5A028',
    
    textPrimary: '#FDF8E8',    // Warm white
    textSecondary: '#E0D5B8',  // Brighter secondary text
    textMuted: '#B8A880',      // Brighter muted text
    
    bgPrimary: '#1A1A2E',      // Dark navy
    bgSecondary: '#252540',
    bgCard: '#2A2A45',
    bgHover: '#35355A',
    
    border: '#454560',         // Brighter border
    borderHover: '#E5C158',
    
    success: '#22C55E',        // Vivid green - good contrast with white
    danger: '#EF4444',         // Vivid red - good contrast with white
    warning: '#F59E0B',        // Vivid amber
    
    player1: '#7DC4FF',        // Brighter light blue
    player2: '#FF8A8A',        // Brighter light red
    player3: '#5DD99A',        // Brighter light green
    player4: '#FFB84D',        // Brighter orange
  },
}

// Kaiba Corp Theme - Futuristic technology (Blue/White)
const kaibaCorpTheme: Theme = {
  id: 'kaiba-corp',
  name: 'Kaiba Corp',
  description: 'Futuristic Technology',
  icon: '',
  styles: {
    // Sharp, angular corners for tech look
    radiusSmall: '0px',
    radiusMedium: '0px',
    radiusLarge: '0px',
    radiusCard: '0px',
    
    // Blue tech glow shadows
    shadowCard: '0 4px 20px -2px rgba(0, 100, 200, 0.2), 0 2px 8px -2px rgba(0, 0, 0, 0.15)',
    shadowElevated: '0 8px 30px -4px rgba(0, 150, 255, 0.3), 0 4px 12px -2px rgba(0, 0, 0, 0.2)',
    shadowGlow: '0 0 25px rgba(0, 150, 255, 0.5)',
    
    // Compact, efficient spacing
    cardPadding: '1.25rem',
    cardGap: '1rem',
    
    // Modern tech typography
    fontFamily: '"Rajdhani", "Segoe UI", sans-serif',
    fontFamilyDisplay: '"Orbitron", "Rajdhani", sans-serif',
    titleWeight: '700',
    
    // Sharp angular buttons
    buttonRadius: '0px',
    buttonPadding: '0.625rem 1.5rem',
    
    // Fast, snappy animations
    transitionSpeed: '0.2s',
    animationIntensity: 'moderate',
    
    // Circuit board / tech grid pattern
    bgPattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.c{stroke:%230066CC;stroke-opacity:0.06;fill:none;stroke-width:1}%3C/style%3E%3C/defs%3E%3Cpath class='c' d='M0 50h40M60 50h40M50 0v40M50 60v40'/%3E%3Ccircle class='c' cx='50' cy='50' r='3'/%3E%3Cpath class='c' d='M20 20h10v10M70 20h10v10M20 70h10v10M70 70h10v10'/%3E%3Cpath class='c' d='M0 25h15l10 10M0 75h15l10-10M100 25h-15l-10 10M100 75h-15l-10-10'/%3E%3C/svg%3E")`,
    bgOverlay: 'linear-gradient(135deg, rgba(0, 100, 200, 0.02) 0%, transparent 50%, rgba(0, 150, 255, 0.03) 100%)',
    
    // Blue tech glow effects
    glowColor: 'rgba(0, 150, 255, 0.6)',
    glowIntensity: '20px',
  },
  light: {
    primary: '#0066CC',        // Kaiba Corp blue
    primaryHover: '#0052A3',
    primaryLight: '#E6F2FF',   // Light blue for badges
    primaryDark: '#004080',    // Dark blue for text
    
    secondary: '#2D3748',      // Dark slate
    secondaryHover: '#1A202C',
    accent: '#00A3FF',         // Bright cyan accent
    accentHover: '#0080CC',
    
    gradientFrom: '#0066CC',
    gradientTo: '#00A3FF',
    
    textPrimary: '#1A202C',    // Near black
    textSecondary: '#2D3748',  // Dark slate
    textMuted: '#4A5568',      // Medium gray
    
    bgPrimary: '#F7FAFC',      // Cool white
    bgSecondary: '#EDF2F7',    // Light gray
    bgCard: '#FFFFFF',
    bgHover: '#E2E8F0',
    
    border: '#CBD5E0',         // Cool gray border
    borderHover: '#0066CC',
    
    success: '#059669',        // Tech green
    danger: '#DC2626',         // Alert red
    warning: '#D97706',        // Warning amber
    
    player1: '#0066CC',        // Blue
    player2: '#DC2626',        // Red
    player3: '#059669',        // Green
    player4: '#7C3AED',        // Purple
  },
  dark: {
    primary: '#00A3FF',        // Bright cyan
    primaryHover: '#33B5FF',
    primaryLight: '#1A3A5C',   // Dark blue for badge backgrounds
    primaryDark: '#66CCFF',    // Light cyan for text on dark badges
    
    secondary: '#64B5F6',      // Light blue
    secondaryHover: '#90CAF9',
    accent: '#00E5FF',         // Bright cyan accent
    accentHover: '#33EBFF',
    
    gradientFrom: '#0066CC',
    gradientTo: '#00A3FF',
    
    textPrimary: '#F7FAFC',    // Cool white
    textSecondary: '#E2E8F0',  // Light gray
    textMuted: '#A0AEC0',      // Medium gray
    
    bgPrimary: '#0D1117',      // Deep dark blue-black
    bgSecondary: '#161B22',    // Slightly lighter
    bgCard: '#1C2128',         // Card dark
    bgHover: '#252D38',
    
    border: '#30363D',         // Dark border
    borderHover: '#00A3FF',
    
    success: '#10B981',        // Bright green
    danger: '#F87171',         // Bright red
    warning: '#FBBF24',        // Bright amber
    
    player1: '#00A3FF',        // Cyan
    player2: '#F87171',        // Red
    player3: '#10B981',        // Green
    player4: '#A78BFA',        // Purple
  },
}

// All available themes
export const THEMES: Record<string, Theme> = {
  egyptian: egyptianTheme,
  'kaiba-corp': kaibaCorpTheme,
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
