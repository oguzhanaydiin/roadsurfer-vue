<!-- 
 * App.vue
 * 
 * Description: Root component to run the App
 */ -->
<script setup lang="ts">
import WeeklyCalendar from './components/WeeklyCalendar.vue'
</script>

<template>
  <header class="bg-red-600"></header>

  <main class="bg-orange-600">
    <WeeklyCalendar />
  </main>
</template>
