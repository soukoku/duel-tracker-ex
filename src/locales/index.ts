import { createI18n } from 'vue-i18n'
import en from './en.json'

export type MessageSchema = typeof en

// Get browser language
function getBrowserLocale(): string {
  const browserLang = navigator.language || (navigator as any).userLanguage
  // Extract language code (e.g., 'en-US' -> 'en')
  return browserLang.split('-')[0].toLowerCase()
}

// Get initial locale with fallback chain:
// 1. Saved setting from localStorage
// 2. Browser language (if supported)
// 3. English (default fallback)
function getInitialLocale(): string {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && supportedLocales.includes(savedLocale)) {
    return savedLocale
  }
  
  const browserLocale = getBrowserLocale()
  if (supportedLocales.includes(browserLocale)) {
    return browserLocale
  }
  
  return 'en' // Final fallback
}

export const supportedLocales = ['en'] // Add more as they're translated

export const availableLocales = [
  { code: 'en', name: 'English', flag: '🇺🇸' }
  // Add more languages here:
  // { code: 'es', name: 'Español', flag: '🇪🇸' },
  // { code: 'ja', name: '日本語', flag: '🇯🇵' }
]

export const i18n = createI18n<[MessageSchema], 'en', false>({
  legacy: false, // Use Composition API mode
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en
  },
  missingWarn: false, // Disable missing translation warnings in production
  fallbackWarn: false
})

// Helper to change locale and persist
export function setLocale(locale: string): void {
  if (supportedLocales.includes(locale)) {
    i18n.global.locale.value = locale as any
    localStorage.setItem('locale', locale)
  }
}
