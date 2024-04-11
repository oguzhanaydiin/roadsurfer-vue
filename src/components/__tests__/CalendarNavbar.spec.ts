import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CalendarNavbar from '@/components/CalendarNavbar.vue'

// mock logo
vi.mock('@/components/icons/RoadsurferLogo.vue', () => ({
  default: {
    // default export
    name: 'RoadsurferLogo',
    template: '<div></div>'
  }
}))

describe('CalendarNavbar', () => {
  it('renders options correctly', () => {
    const stations = [
      { id: 1, name: 'Station 1', bookings: [] },
      { id: 2, name: 'Station 2', bookings: [] }
    ]

    const wrapper = mount(CalendarNavbar, {
      props: { selectedOption: 1, stations }
    })

    const options = wrapper.findAll('option')
    expect(options).toHaveLength(stations.length)
    expect(options[0].text()).toContain('Station 1')
    expect(options[1].text()).toContain('Station 2')
  })

  it('emits update:selectedOption event when selection changes', async () => {
    const stations = [
      { id: 1, name: 'Station 1', bookings: [] },
      { id: 2, name: 'Station 2', bookings: [] }
    ]

    const wrapper = mount(CalendarNavbar, {
      props: { selectedOption: 1, stations }
    })

    await wrapper.find('select').setValue(stations[1].id)

    const emittedEvents = wrapper.emitted('update:selectedOption')
    expect(emittedEvents).toBeTruthy()
    expect(emittedEvents && emittedEvents[0]).toEqual([stations[1].id])
  })
})
