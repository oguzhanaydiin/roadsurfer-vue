import type { Booking } from './Booking'

export interface Station {
  id: number
  name: string
  bookings: Booking[]
}
