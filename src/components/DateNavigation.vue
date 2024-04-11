<template>
  <div class="flex items-center justify-between py-2 px-6">
    <div>
      <span class="text-lg font-bold text-gray-800">{{ weekRange }}</span>
    </div>
    <div class="flex gap-2">
      <div class="flex items-center border bg-white rounded-lg px-1 h-[34.67px]">
        <select v-model="selectedMonth" @change="selectedMonthChanged" class="w-28 outline-none">
          <option v-for="(option, index) in Months" :key="index" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="flex items-center border bg-white rounded-lg px-1 h-[34.67px]">
        <select v-model="selectedYear" @change="selectedYearChanged" class="w-28 outline-none">
          <option v-for="(option, index) in AvailableYears" :key="index" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="border rounded-lg px-1">
        <button
          id="previous-week"
          type="button"
          class="leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center"
          @click="changeWeek(-1)"
        >
          <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div class="border-r inline-flex h-6"></div>
        <button
          id="next-week"
          type="button"
          class="leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1"
          @click="changeWeek(1)"
        >
          <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { Months } from '@/models/Months'
import { AvailableYears } from '@/models/AvailableYears'

const props = defineProps({
  weekRange: String,
  selectedMonth: String,
  selectedYear: Number
})

const { selectedMonth, selectedYear } = toRefs(props)

const emits = defineEmits(['update:selectedMonth', 'update:selectedYear', 'changeWeek'])

const selectedMonthChanged = (event: Event) => {
  emits('update:selectedMonth', (event.target as HTMLSelectElement).value)
}

const selectedYearChanged = (event: Event) => {
  emits('update:selectedYear', parseInt((event.target as HTMLSelectElement).value))
}

const changeWeek = (step: number) => {
  emits('changeWeek', step)
}
</script>
