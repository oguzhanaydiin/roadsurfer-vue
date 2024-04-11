import type { Booking } from '@/models/Booking'
import type { Station } from '@/models/Station'
import type { Ref } from 'vue'

// Fetch stations from external API
export const fetchStations = async () => {
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

// Fetch booking detail with chosen station and clicked booking's id
export const fetchBookingDetail = async (bookingId: number, selectedOption: Ref) => {
  try {
    const stationId = selectedOption.value

    const response = await fetch(
      `https://605c94c36d85de00170da8b4.mockapi.io/stations/${stationId}/bookings/${bookingId}`
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
