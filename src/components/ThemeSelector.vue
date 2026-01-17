<template>
  <div class="relative">
    <!-- Theme Toggle Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-xl bg-themed-secondary hover:bg-themed-hover transition-colors"
      title="Change Theme"
    >
      <span class="text-xl">{{ currentTheme.icon }}</span>
      <span class="hidden sm:inline text-sm font-medium text-themed">{{ currentTheme.name }}</span>
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
          <h3 class="font-semibold text-themed">Choose Theme</h3>
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
            <span class="text-2xl">{{ theme.icon }}</span>
            <div class="flex-1">
              <div class="font-medium text-themed">{{ theme.name }}</div>
              <div class="text-xs text-themed-muted">{{ theme.description }}</div>
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
              <span class="text-sm font-medium text-themed">{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>
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
import type { Theme } from '../composables/useTheme'

const props = defineProps<{
  currentThemeId: string
  currentTheme: Theme
  isDark: boolean
  availableThemes: Theme[]
}>()

const emit = defineEmits<{
  'set-theme': [themeId: string]
  'toggle-dark-mode': []
}>()

const isOpen = ref(false)

function selectTheme(themeId: string): void {
  emit('set-theme', themeId)
  isOpen.value = false
}

function toggleDarkMode(): void {
  emit('toggle-dark-mode')
}
</script>
