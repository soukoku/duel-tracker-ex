<template>
  <div class="relative">
    <!-- Theme Toggle Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-xl bg-themed-secondary hover:bg-themed-hover transition-colors"
      title="Change Theme"
    >
      <svg class="w-5 h-5 text-themed-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
      <span class="hidden sm:inline text-sm font-medium text-themed">{{ getThemeName(currentTheme.id) }}</span>
      <svg 
        class="w-4 h-4 text-themed-muted transition-transform" 
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Panel -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div 
        v-if="isOpen"
        class="absolute right-0 mt-2 w-72 rounded-xl shadow-xl z-50 overflow-hidden"
        style="background-color: var(--color-bg-card); border: 1px solid var(--color-border);"
      >
        <!-- Header -->
        <div class="p-3 pl-8 border-b" style="border-color: var(--color-border);">
          <h3 class="font-semibold text-themed">{{ t('theme.chooseTheme') }}</h3>
        </div>

        <!-- Theme Options -->
        <div class="p-2 space-y-2">
          <button
            v-for="theme in availableThemes"
            :key="theme.id"
            @click="selectTheme(theme.id)"
            class="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left"
            :class="[
              currentThemeId === theme.id 
                ? 'ring-2 ring-primary bg-primary-light' 
                : 'hover:bg-themed-hover'
            ]"
          >
            <div class="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-themed-primary">
              <span class="text-xs font-bold">{{ theme.name.charAt(0) }}</span>
            </div>
            <div class="flex-1">
              <div class="font-medium text-themed">{{ getThemeName(theme.id) }}</div>
              <div class="text-xs text-themed-muted">{{ getThemeDescription(theme.id) }}</div>
            </div>
            <svg 
              v-if="currentThemeId === theme.id"
              class="w-5 h-5" 
              style="color: var(--color-primary);"
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Dark Mode Toggle -->
        <div class="p-3 border-t" style="border-color: var(--color-border);">
          <button
            @click="toggleDarkMode"
            class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-themed-hover transition-colors"
          >
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ isDark ? '🌙' : '☀️' }}</span>
              <span class="text-sm font-medium text-themed">{{ isDark ? t('theme.darkMode') : t('theme.lightMode') }}</span>
            </div>
            <div 
              class="relative w-11 h-6 rounded-full transition-colors"
              :style="{ backgroundColor: isDark ? 'var(--color-primary)' : 'var(--color-border)' }"
            >
              <div 
                class="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                :class="isDark ? 'translate-x-5' : 'translate-x-0.5'"
              ></div>
            </div>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Click outside to close -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-40" 
      @click="isOpen = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeSystem } from '../composables/useTheme'

const { t } = useI18n()

const {
  currentThemeId,
  currentTheme,
  isDark,
  availableThemes,
  setTheme,
  toggleDarkMode,
} = useThemeSystem()

const isOpen = ref(false)

function selectTheme(themeId: string): void {
  setTheme(themeId)
  isOpen.value = false
}

function getThemeName(themeId: string): string {
  const key = themeId === 'kaiba-corp' ? 'kaibaCorp' : themeId
  return t(`theme.${key}.name`)
}

function getThemeDescription(themeId: string): string {
  const key = themeId === 'kaiba-corp' ? 'kaibaCorp' : themeId
  return t(`theme.${key}.description`)
}
</script>
