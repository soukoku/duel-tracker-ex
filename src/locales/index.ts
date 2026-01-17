import { createI18n } from 'vue-i18n'
import en from './en.json'
import zhCN from './zh-CN.json'
import zhTW from './zh-TW.json'

export type MessageSchema = typeof en

// Get browser language
function getBrowserLocale(): string {
  const browserLang = navigator.language || (navigator as any).userLanguage
  // Return full locale code for Chinese variants, otherwise just language code
  const lowerLang = browserLang.toLowerCase()
  if (lowerLang.startsWith('zh-')) {
    // Handle Chinese variants
    if (lowerLang.includes('cn') || lowerLang.includes('hans')) {
      return 'zh-CN' // Simplified Chinese
    } else if (lowerLang.includes('tw') || lowerLang.includes('hk') || lowerLang.includes('hant')) {
      return 'zh-TW' // Traditional Chinese
    }
    return 'zh-CN' // Default to Simplified for generic 'zh'
  }
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

export const supportedLocales = ['en', 'zh-CN', 'zh-TW']

export const availableLocales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' }
]

export const i18n = createI18n<[MessageSchema], 'en' | 'zh-CN' | 'zh-TW', false>({
  legacy: false, // Use Composition API mode
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN,
    'zh-TW': zhTW
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
