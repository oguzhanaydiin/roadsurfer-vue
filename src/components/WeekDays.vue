<template>
  <!-- Week Days Row -->
  <div class="grid grid-cols-7 border-b">
    <div v-for="day in Object.values(WeekDays)" :key="day" class="border-r py-2">
      <div class="text-gray-600 text-sm uppercase tracking-wide font-bold text-center">
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WeekDays } from '@/models/WeekDays'
</script>
