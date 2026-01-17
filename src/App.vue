<template>
  <RouterView />
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTitle } from '@vueuse/core'
import { useThemeSystem } from './composables/useTheme'

const { t } = useI18n()

// Initialize theme system
const { initTheme } = useThemeSystem()
onMounted(() => {
  initTheme()
})

// Set page title with translations
const pageTitle = useTitle()
watch(() => t('app.title'), (newTitle) => {
  pageTitle.value = newTitle
}, { immediate: true })
</script>
