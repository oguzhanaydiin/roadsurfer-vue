<template>
  <div
    class="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="p-4 max-w-xl mx-auto absolute left-0 right-0 overflow-hidden mt-24">
      <div
        class="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
        @click="closeModal"
      >
        <svg class="fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z"
          />
        </svg>
      </div>

      <div class="shadow w-full rounded-lg bg-white overflow-hidden block p-8">
        <h2 class="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">Booking Details</h2>

        <div class="mb-4">
          <label class="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Customer</label>
          <div
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          >
            {{ title }}
          </div>
        </div>

        <div class="mb-4">
          <label class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
            >Booking Date</label
          >
          <div
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            readonly
          >
            {{ dateDisplay }}
          </div>
        </div>

        <div class="mb-4">
          <label class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
            >Booking Reason</label
          >
          <div
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            readonly
          >
            {{ theme ? 'Picking Up' : 'Returning' }}
          </div>
        </div>

        <div class="mt-8 text-right">
          <button
            type="button"
            class="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
            @click="closeModal"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  title: String,
  date: Date,
  theme: Boolean
})

console.log(props.theme)

const emits = defineEmits(['close'])

const closeModal = () => {
  emits('close')
}

const dateDisplay = computed(() =>
  props.date?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)
</script>
