<!--
  Component: WeeklyCalendar.vue

  Description:
  Displays the weekly calendar of Roadsurfer navigation and booking details.
  Allows users to view bookings for each day and click on them for more information.
  Fetches stations and bookings from an external API.

  Uses:
  - CalendarNavbar: Component for selecting stations.
  - DateNavigation: Component for navigating weeks and selecting months/years.
  - WeekDays: Component for displaying the days of the week.
  - BookingDetailModal: Modal component for displaying detailed booking information.
  - CalendarInformation: Component for displaying legend information.
 
-->

<template>
  <div class="antialiased sans-serif bg-gray-100">
    <div class="flex items-center justify-center min-h-screen">
      <div class="container mx-auto px-4">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <CalendarNavbar
            :selectedOption="selectedOption"
            :stations="stations"
            @update:selectedOption="handleSelectedOptionUpdate"
          />

          <DateNavigation
            :weekRange="weekRange"
            :selectedMonth="selectedMonth"
            :selectedYear="selectedYear"
            @update:selectedMonth="selectedMonthChanged"
            @update:selectedYear="selectedYearChanged"
            @changeWeek="changeWeek"
          />

          <WeekDays />

          <!-- Bookings by Days -->
          <div class="grid grid-cols-7">
            <div
              v-for="date in weekDates"
              :key="date.day"
              class="border-r border-b p-2 min-h-[600px]"
            >
              <!-- Number of the day -->
              <div
                :class="dateClass(date.date)"
                class="inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100"
              >
                {{ date.day }}
              </div>
              <!-- Booking List for the unique date -->
              <div class="overflow-y-auto mt-1 h-56">
                <div
                  v-for="event in filteredEvents(date.date)"
                  :key="event.id"
                  class="px-2 py-1 rounded-lg mt-1 overflow-hidden border"
                  :class="bookingReasonClass(event)"
                >
                  <!-- Shows Event Customer  -->
                  <p
                    @click="showBookingDetailModal(event.id, date.date)"
                    class="text-sm truncate leading-tight cursor-pointer"
                  >
                    {{ event.eventCustomer }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <CalendarInformation />
        </div>
      </div>
    </div>
  </div>

  <BookingDetailModal
    v-if="openBookingDetailModal"
    :customer="bookingDetailCustomer"
    :date="bookingDetailDate"
    :reason="bookingDetailReason"
    @close="toggleEventDetailModal"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CalendarNavbar from './CalendarNavbar.vue'
import DateNavigation from './DateNavigation.vue'
import WeekDays from './WeekDays.vue'
import BookingDetailModal from './BookingDetailModal.vue'
import CalendarInformation from './CalendarInformation.vue'
import type { Booking } from '@/models/Booking'
import type { Station } from '@/models/Station'
import type { Event } from '@/models/Event'
import { Months } from '@/models/Months'
import { fetchBookingDetail, fetchStations } from '@/utils/api'

const currentDate = ref(new Date())
const bookingDetailCustomer = ref('')
const bookingDetailDate = ref<Date | undefined>(undefined)
const bookingDetailReason = ref(true)
const openBookingDetailModal = ref(false)
const selectedOption = ref<number | undefined>(undefined)
const stations = ref<Station[]>([])
const selectedYear = ref(currentDate.value.getFullYear())
const selectedMonth = ref(Months[currentDate.value.getMonth()])

// Compute shown week range in UI (date - date)
const weekRange = computed(() => {
  const start = startOfWeek(new Date(currentDate.value))
  const end = endOfWeek(new Date(currentDate.value))
  const startMonth = start.getMonth()
  const endMonth = end.getMonth()
  const startYear = start.getFullYear()
  const endYear = end.getFullYear()
  return `${start.getDate()} ${startMonth == endMonth ? '' : Months[startMonth]} ${startYear == endYear ? '' : startYear} - ${end.getDate()} ${startMonth == endMonth ? '' : Months[endMonth]} ${startMonth == endMonth ? Months[startMonth] : ''} ${startYear == endYear ? '' : endYear} ${startYear == endYear ? startYear : ''}`
})

// Calculate which date range shown week is using in UI
const weekDates = computed(() => {
  const start = startOfWeek(new Date(currentDate.value))
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    return {
      date,
      day: date.getDate()
    }
  })
})

// Get Individual Bookings from seleted station
const bookings = computed(() => {
  const selectedStation = stations.value.find((station) => {
    return station.id.toString() === selectedOption.value?.toString()
  })
  if (!selectedStation) return []

  return selectedStation.bookings
})

// Create picking up and returning events based on bookings of selected station
// Events are temporary variables to be shown on screen created from bookings
const events = computed(() =>
  bookings.value.flatMap((booking) => [
    {
      id: booking.id,
      eventDate: new Date(booking.startDate),
      eventCustomer: booking.customerName,
      isPickup: true
    },
    {
      id: booking.id,
      eventDate: new Date(booking.endDate),
      eventCustomer: booking.customerName,
      isPickup: false
    }
  ])
)

function startOfWeek(date: Date) {
  const diff = date.getDay() === 0 ? -6 : 1 - date.getDay()
  return new Date(date.setDate(date.getDate() + diff))
}

function endOfWeek(date: Date) {
  return new Date(startOfWeek(date).setDate(startOfWeek(date).getDate() + 6))
}

// If this date is today then mark it
const dateClass = (date: Date) => ({
  'bg-blue-500 text-white': new Date().toDateString() === date.toDateString(),
  'text-gray-700 hover:bg-blue-200': new Date().toDateString() !== date.toDateString()
})

// Open details of clicked booking
const showBookingDetailModal = async (id: number, date: Date) => {
  const bookingDetail = (await fetchBookingDetail(id, selectedOption)) as Booking

  if (bookingDetail) {
    //if its equal with starting day then its picking up
    bookingDetailReason.value =
      date.getDay() === bookingDetail.startDate.getDay() &&
      date.getMonth() === bookingDetail.startDate.getMonth() &&
      date.getFullYear() === bookingDetail.startDate.getFullYear()
    bookingDetailDate.value = bookingDetailReason.value
      ? bookingDetail.startDate
      : bookingDetail.endDate
    bookingDetailCustomer.value = bookingDetail.customerName
    openBookingDetailModal.value = true
  }
}

// Navigate through weeks with -1 or +1 step
const changeWeek = (step: number) => {
  currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() + step * 7))
  selectedMonth.value = Months[currentDate.value.getMonth()]
  selectedYear.value = currentDate.value.getFullYear()
}

// Change selected month
const selectedMonthChanged = (month: string) => {
  const monthIndex = Months.indexOf(month)
  currentDate.value = new Date(currentDate.value.setMonth(monthIndex))
  selectedMonth.value = month
}

// Change seleted year
const selectedYearChanged = (year: number) => {
  currentDate.value = new Date(currentDate.value.setFullYear(year))
  selectedYear.value = year
}

// handle emitted value from child component
const handleSelectedOptionUpdate = (newValue: number) => {
  selectedOption.value = newValue
}

// filter events to shown dates to put it on UI
const filteredEvents = (date: Date) => {
  return events.value.filter(
    (event) => new Date(event.eventDate).toDateString() === date.toDateString()
  )
}

// Give a booking blue or green color to indicate its pickup or return
const bookingReasonClass = (event: Event) => ({
  'border-blue-200 text-blue-800 bg-blue-100': event.isPickup,
  'border-green-200 text-green-800 bg-green-100': !event.isPickup
})

// Toggle Event Detail Modal
const toggleEventDetailModal = () => {
  openBookingDetailModal.value = !openBookingDetailModal.value
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
