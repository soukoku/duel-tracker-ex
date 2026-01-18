<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { availableLocales, setLocale } from '../locales'

const { locale } = useI18n()
const isOpen = ref(false)

const currentLocale = computed(() => locale.value)

const currentLanguage = computed(() => 
  availableLocales.find(lang => lang.code === currentLocale.value)
)

function changeLanguage(langCode: string): void {
  setLocale(langCode)
  isOpen.value = false
}
</script>

<template>
  <div class="relative" v-if="availableLocales.length > 1">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-xl bg-themed-secondary hover:bg-themed-hover transition-colors"
      :title="currentLanguage?.name"
    >
      <span class="text-xl -my-1">{{ currentLanguage?.flag }}</span>
      <span class="hidden sm:inline text-sm font-medium text-themed">{{ currentLanguage?.name }}</span>
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

    <!-- Dropdown -->
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
        <div class="p-2 space-y-2">
          <button
            v-for="lang in availableLocales"
            :key="lang.code"
            @click="changeLanguage(lang.code)"
            class="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left"
            :class="[
              currentLocale === lang.code 
                ? 'ring-2 ring-primary bg-primary-light' 
                : 'hover:bg-themed-hover'
            ]"
          >
            <span class="text-xl -my-1">{{ lang.flag }}</span>
            <span class="font-medium text-themed">{{ lang.name }}</span>
            <svg 
              v-if="currentLocale === lang.code"
              class="w-5 h-5 ml-auto" 
              style="color: var(--color-primary);"
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
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
