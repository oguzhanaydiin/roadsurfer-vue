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
                  :key="event.id"
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

          <CalendarInformation />
        </div>
      </div>
    </div>
  </div>

  <BookingDetailModal
    v-if="openBookingDetailModal"
    :title="bookingDetailTitle"
    :date="bookingDetailDate"
    :theme="bookingDetailTheme"
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

const currentDate = ref(new Date())
const bookingDetailTitle = ref('')
const bookingDetailDate = ref<Date | undefined>(undefined)
const bookingDetailTheme = ref(true)
const openBookingDetailModal = ref(false)
const selectedOption = ref<number | undefined>(undefined)
const stations = ref<Station[]>([])
const selectedYear = ref(currentDate.value.getFullYear())
const selectedMonth = ref(Months[currentDate.value.getMonth()])

const weekRange = computed(() => {
  const start = startOfWeek(new Date(currentDate.value))
  const end = endOfWeek(new Date(currentDate.value))
  const startMonth = start.getMonth()
  const endMonth = end.getMonth()
  const startYear = start.getFullYear()
  const endYear = end.getFullYear()
  return `${start.getDate()} ${startMonth == endMonth ? '' : Months[startMonth]} ${startYear == endYear ? '' : startYear} - ${end.getDate()} ${startMonth == endMonth ? '' : Months[endMonth]} ${startMonth == endMonth ? Months[startMonth] : ''} ${startYear == endYear ? '' : endYear} ${startYear == endYear ? startYear : ''}`
})

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

const bookings = computed(() => {
  const selectedStation = stations.value.find((station) => {
    return station.id.toString() === selectedOption.value?.toString()
  })
  if (!selectedStation) return []

  return selectedStation.bookings
})

const events = computed(() =>
  bookings.value.flatMap((booking) => [
    {
      id: booking.id,
      event_date: new Date(booking.startDate),
      event_title: booking.customerName,
      isPickup: true
    },
    {
      id: booking.id,
      event_date: new Date(booking.endDate),
      event_title: booking.customerName,
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

const dateClass = (date: Date) => ({
  'bg-blue-500 text-white': new Date().toDateString() === date.toDateString(),
  'text-gray-700 hover:bg-blue-200': new Date().toDateString() !== date.toDateString()
})

const showBookingDetailModal = async (id: number, date: Date) => {
  const bookingDetail = (await fetchBookingDetail(id)) as Booking

  if (bookingDetail) {
    //if its equal with starting day then its picking up
    bookingDetailTheme.value =
      date.getDay() === bookingDetail.startDate.getDay() &&
      date.getMonth() === bookingDetail.startDate.getMonth() &&
      date.getFullYear() === bookingDetail.startDate.getFullYear()
    bookingDetailDate.value = bookingDetailTheme.value
      ? bookingDetail.startDate
      : bookingDetail.endDate
    bookingDetailTitle.value = bookingDetail.customerName
    openBookingDetailModal.value = true
  }
}

const changeWeek = (step: number) => {
  currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() + step * 7))
  selectedMonth.value = Months[currentDate.value.getMonth()]
  selectedYear.value = currentDate.value.getFullYear()
}

const selectedMonthChanged = (month: string) => {
  const monthIndex = Months.indexOf(month)
  currentDate.value = new Date(currentDate.value.setMonth(monthIndex))
  selectedMonth.value = month
}

const selectedYearChanged = (year: number) => {
  currentDate.value = new Date(currentDate.value.setFullYear(year))
  selectedYear.value = year
}

const handleSelectedOptionUpdate = (newValue: number) => {
  selectedOption.value = newValue
}

const filteredEvents = (date: Date) => {
  return events.value.filter(
    (event) => new Date(event.event_date).toDateString() === date.toDateString()
  )
}

const themeClass = (event: Event) => ({
  'border-blue-200 text-blue-800 bg-blue-100': event.isPickup,
  'border-green-200 text-green-800 bg-green-100': !event.isPickup
})

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
