<template>
  <div class="antialiased sans-serif bg-gray-100">
    <div class="flex items-center justify-center min-h-screen">
      <div class="container mx-auto px-4">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <!-- Nav -->
          <div class="flex items-center justify-between bg-[#6bbbae] py-2 px-6">
            <!-- Title -->
            <div>
              <RoadsurferLogo />
            </div>
            <!-- Stations dropdown -->
            <div class="flex items-center border bg-white rounded-lg px-1 h-[34.67px]">
              <select v-model="selectedOption" class="w-28 outline-none">
                <option
                  v-for="(option, index) in dropdownOptions"
                  :key="index"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Change date buttons -->
          <div class="flex items-center justify-between py-2 px-6">
            <div>
              <span class="text-lg font-bold text-gray-800">{{ weekRange }}</span>
            </div>

            <div class="flex gap-2">
              <!-- Month dropdown -->
              <div class="flex items-center border bg-white rounded-lg px-1 h-[34.67px]">
                <select
                  v-model="selectedMonth"
                  @change="selectedMonthChanged"
                  class="w-28 outline-none"
                >
                  <option v-for="(option, index) in Months" :key="index" :value="option">
                    {{ option }}
                  </option>
                </select>
              </div>
              <!-- Year dropdown -->
              <div class="flex items-center border bg-white rounded-lg px-1 h-[34.67px]">
                <select
                  v-model="selectedYear"
                  @change="selectedYearChanged"
                  class="w-28 outline-none"
                >
                  <option v-for="(option, index) in AvailableYears" :key="index" :value="option">
                    {{ option }}
                  </option>
                </select>
              </div>
              <!-- Previous and Next Week -->
              <div class="border rounded-lg px-1">
                <button
                  type="button"
                  class="leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center"
                  @click="changeWeek(-1)"
                >
                  <svg
                    class="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
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
                  type="button"
                  class="leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1"
                  @click="changeWeek(1)"
                >
                  <svg
                    class="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
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

          <!-- WeekDays -->
          <WeekDays />

          <!-- Days of the current week -->
          <div class="grid grid-cols-7">
            <div
              v-for="date in weekDates"
              :key="date.day"
              class="border-r border-b p-2 min-h-[600px]"
            >
              <div
                :class="dateClass(date.date)"
                class="inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100"
              >
                {{ date.day }}
              </div>
              <div class="overflow-y-auto mt-1 h-56">
                <div
                  v-for="event in filteredEvents(date.date)"
                  :key="event.event_title"
                  class="px-2 py-1 rounded-lg mt-1 overflow-hidden border"
                  :class="themeClass(event)"
                >
                  <p
                    @click="showBookingDetailModal(event.id, date.date)"
                    class="text-sm truncate leading-tight"
                  >
                    {{ event.event_title }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Plot -->
          <CalendarInformation />
        </div>
      </div>
    </div>
  </div>

  <!-- Show Event Modal -->
  <div
    v-if="openBookingDetailModal"
    class="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="p-4 max-w-xl mx-auto absolute left-0 right-0 overflow-hidden mt-24">
      <div
        class="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
        @click="toggleEventDetailModal"
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
            {{ bookingDetailTitle }}
          </div>
        </div>

        <div class="mb-4">
          <label class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
            >Booking Date
          </label>
          <div
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            readonly
          >
            {{
              bookingDetailDate?.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            }}
          </div>
        </div>

        <div class="mb-4">
          <label class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
            >Booking Reason
          </label>
          <div
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            readonly
          >
            {{ bookingDetailTheme ? Themes['true'] : Themes['false'] }}
          </div>
        </div>

        <div class="mt-8 text-right">
          <button
            type="button"
            class="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
            @click="toggleEventDetailModal"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import RoadsurferLogo from './icons/RoadsurferLogo.vue'
import CalendarInformation from './CalendarInformation.vue'
import WeekDays from './WeekDays.vue'
import type { Station } from '@/models/Station'
import type { Event } from '@/models/Event'
import { Months } from '@/models/Months'
import { AvailableYears } from '@/models/AvailableYears'
import type { Booking } from '@/models/Booking'

// Const Values

const enum Themes {
  'true' = 'Picking Up',
  'false' = 'Returning'
}

// Ref Values
const currentDate = ref(new Date())
const bookingDetailTitle = ref('')
const bookingDetailDate: Ref<null | Date> = ref(null)
const bookingDetailTheme = ref(true)
const openBookingDetailModal = ref(false)
const selectedOption: Ref<null | number> = ref(null)
const stations = ref<Station[]>([])
const selectedYear = ref(currentDate.value.getFullYear())
const selectedMonth = ref(Months[currentDate.value.getMonth()])

// Computed Values
const dropdownOptions = computed(() => {
  return Object.values(stations.value).map((item) => {
    return { label: item.name, value: item.id }
  })
})

const weekRange = computed(() => {
  const start = startOfWeek(new Date(currentDate.value))
  const end = endOfWeek(new Date(currentDate.value))
  const startMonth = start.getMonth()
  const endMonth = end.getMonth()
  const startYear = start.getFullYear()
  const endYear = end.getFullYear()
  return `${start.getDate()} ${startMonth == endMonth ? '' : Months[startMonth]}
    ${startYear == endYear ? '' : startYear} -
    ${end.getDate()} ${startMonth == endMonth ? '' : Months[endMonth]}
    ${startMonth == endMonth ? Months[startMonth] : ''}
    ${startYear == endYear ? '' : endYear} ${startYear == endYear ? startYear : ''}`
})

const weekDates = computed(() => {
  const start = startOfWeek(new Date(currentDate.value))
  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    return {
      date: date,
      day: date.getDate()
    }
  })
})

const bookings = computed(() => {
  const selectedStation = stations.value.find((station) => station.id === selectedOption.value)

  if (!selectedStation) {
    return [] // Return empty array if no station is found
  }

  return selectedStation.bookings
})

const events = computed(() => {
  const generatedEvents: Event[] = []

  bookings.value.forEach((booking) => {
    // First event
    const firstEvent = {
      id: booking.id,
      event_date: new Date(booking.startDate),
      event_title: booking.customerName,
      isPickup: true
    }

    // Second event
    const secondEvent = {
      id: booking.id,
      event_date: new Date(booking.endDate),
      event_title: booking.customerName,
      isPickup: false
    }

    generatedEvents.push(firstEvent)
    generatedEvents.push(secondEvent)
  })

  return generatedEvents
})

// Local Functions
const selectedMonthChanged = () => {
  currentDate.value = new Date(currentDate.value.setMonth(Months.indexOf(selectedMonth.value)))
}

const selectedYearChanged = () => {
  currentDate.value = new Date(new Date(currentDate.value).setFullYear(selectedYear.value))
}

function startOfWeek(date: Date) {
  const diff = date.getDay() === 0 ? -6 : 1 - date.getDay()
  return new Date(date.setDate(date.getDate() + diff))
}

function endOfWeek(date: Date) {
  return new Date(startOfWeek(new Date(date)).setDate(startOfWeek(date).getDate() + 6))
}

const dateClass = (date: Date) => {
  const today = new Date()
  return {
    'bg-blue-500 text-white': today.toDateString() === date.toDateString(),
    'text-gray-700 hover:bg-blue-200': today.toDateString() !== date.toDateString()
  }
}

const areDatesEqual = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const showBookingDetailModal = async (id: number, date: Date) => {
  const bookingDetail = (await fetchBookingDetail(id)) as Booking

  if (bookingDetail) {
    if (areDatesEqual(date, bookingDetail.startDate)) {
      bookingDetailTheme.value = true
    }
    if (areDatesEqual(date, bookingDetail.endDate)) {
      bookingDetailTheme.value = false
    }
    bookingDetailDate.value = bookingDetail.startDate
    bookingDetailTitle.value = bookingDetail.customerName
    openBookingDetailModal.value = true
  }
}

const changeWeek = (step: number) => {
  currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() + 7 * step))
  //if selected month and current month not same
  if (currentDate.value.getMonth() !== Months.indexOf(selectedMonth.value)) {
    selectedMonth.value = Months[currentDate.value.getMonth()]
  }
  //if selected year and current year not same
  if (currentDate.value.getFullYear() !== selectedYear.value) {
    selectedYear.value = currentDate.value.getFullYear()
  }
}

const filteredEvents = (date: Date) => {
  return events.value.filter((event) => {
    return new Date(event.event_date).toDateString() === date.toDateString()
  })
}

const themeClass = (event: Event) => {
  return {
    'border-blue-200 text-blue-800 bg-blue-100': event.isPickup,
    'border-green-200 text-green-800 bg-green-100': !event.isPickup
  }
}

const toggleEventDetailModal = () => {
  openBookingDetailModal.value = !openBookingDetailModal.value
}

const fetchStations = async () => {
  try {
    const response = await fetch('https://605c94c36d85de00170da8b4.mockapi.io/stations')
    if (!response.ok) {
      throw new Error('Failed to fetch')
    }
    const data = await response.json()
    // Filter out stations with empty names

    const stationList: Station[] = data
      .map((station: any) => {
        return {
          id: station.id,
          name: station.name,
          bookings: station.bookings.map((booking: any) => ({
            id: booking.id,
            pickupReturnStationId: booking.pickupReturnStationId,
            startDate: new Date(booking.startDate),
            endDate: new Date(booking.endDate),
            customerName: booking.customerName
          }))
        }
      })
      .filter((station: Station) => station.name && !station.name.includes('station-name{{i}}'))
    return stationList
  } catch (error) {
    console.error('Error fetching stations:', error)
    return []
  }
}

const fetchBookingDetail = async (eventId: number) => {
  try {
    const stationId = selectedOption.value

    const response = await fetch(
      `https://605c94c36d85de00170da8b4.mockapi.io/stations/${stationId}/bookings/${eventId}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch')
    }
    const data = await response.json()

    const bookingDetail: Booking = {
      id: data.id,
      pickupReturnStationId: data.pickupReturnStationId,
      customerName: data.customerName,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate)
    }

    return bookingDetail
  } catch (error) {
    console.error('Error fetching stations:', error)
    return []
  }
}

// Life Cycle Functions

onMounted(async () => {
  try {
    // Fetch stations
    const fetchedStations = await fetchStations()

    stations.value = fetchedStations
    selectedOption.value = stations.value[0].id
  } catch (error) {
    console.error('Error fetching stations:', error)
  }
})
</script>
