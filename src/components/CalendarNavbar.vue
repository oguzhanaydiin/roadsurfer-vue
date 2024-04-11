<template>
  <div class="flex items-center justify-between bg-[#6bbbae] py-2 px-6">
    <!-- Title -->
    <div>
      <RoadsurferLogo />
    </div>
    <!-- Stations dropdown -->
    <div class="flex items-center border bg-white rounded-lg px-1 h-[34.67px]">
      <select v-model="selectedOptionValue" @change="selectOption" class="w-28 outline-none">
        <option v-for="(option, index) in dropdownOptions" :key="index" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoadsurferLogo from './icons/RoadsurferLogo.vue'
import { computed, toRefs } from 'vue'
import type { Station } from '@/models/Station'

// Define props
const props = defineProps<{
  selectedOption: number | undefined
  stations: Station[]
}>()
const emits = defineEmits(['update:selectedOption'])
// Destructure props
const { selectedOption, stations } = toRefs(props)

// Define a computed property for the selected option value
const selectedOptionValue = computed(() => selectedOption.value)

const dropdownOptions = computed(() => {
  return Object.values(stations.value).map((item) => {
    return { label: item.name, value: item.id }
  })
})

const selectOption = (event: Event) => {
  const selectedValue = (event.target as HTMLSelectElement).value

  emits('update:selectedOption', Number(selectedValue))
}
</script>
