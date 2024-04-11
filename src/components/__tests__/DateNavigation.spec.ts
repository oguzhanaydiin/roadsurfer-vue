import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DateNavigation from '@/components/DateNavigation.vue'

describe('DateNavigation', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(DateNavigation, {
      props: {
        weekRange: '01-07 January',
        selectedMonth: 'Jan',
        selectedYear: 2023
      }
    })
  })

  it('renders the correct initial month and year', () => {
    const monthSelect = wrapper.find('select').element as HTMLSelectElement
    const yearSelect = wrapper.findAll('select').at(1)?.element as HTMLSelectElement

    expect(monthSelect.value).toBe('Jan')
    expect(yearSelect.value).toBe('2023')
  })

  it('updates the month when a different option is selected', async () => {
    const monthSelect = wrapper.find('select')
    await monthSelect.setValue('Feb')

    expect(wrapper.emitted('update:selectedMonth')).toBeTruthy()
    expect(wrapper.emitted('update:selectedMonth')![0]).toEqual(['Feb'])
  })

  it('updates the year when a different option is selected', async () => {
    const yearSelect = wrapper.findAll('select').at(1)
    await yearSelect?.setValue('2024')

    expect(wrapper.emitted('update:selectedYear')).toBeTruthy()
    expect(wrapper.emitted('update:selectedYear')![0]).toEqual([2024])
  })

  it('emits changeWeek event with -1 when < button is clicked', async () => {
    const prevWeekButton = wrapper.find('button#previous-week')
    await prevWeekButton.trigger('click')

    expect(wrapper.emitted('changeWeek')).toBeTruthy()
    expect(wrapper.emitted('changeWeek')![0]).toEqual([-1])
  })

  it('emits changeWeek event with 1 when > button is clicked', async () => {
    const nextWeekButton = wrapper.find('button#next-week')
    await nextWeekButton.trigger('click')

    expect(wrapper.emitted('changeWeek')).toBeTruthy()
    expect(wrapper.emitted('changeWeek')![0]).toEqual([1])
  })
})
