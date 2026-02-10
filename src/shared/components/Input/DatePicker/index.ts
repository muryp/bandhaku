import { Dropdown } from '@/shared/components/Dropdown'
import { Input } from '@/shared/components/Input'

interface DateRange {
  from: string
  to: string
}

interface DateFilterProps {
  onChange: (value: DateRange) => void
  className?: string
}

export const DateFilter = ({ onChange, className = '' }: DateFilterProps) => {
  // Helper untuk format YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  const now = new Date()
  const todayStr = formatDate(now)

  // State awal diset ke "Day" (Today)
  const state: DateRange = {
    from: new Date(now.setHours(0, 0, 0, 0)).toISOString(),
    to: new Date().toISOString(),
  }

  const emit = () => {
    if (state.from && state.to) {
      onChange({ ...state })
    }
  }

  const setPredefinedRange = (type: string) => {
    const start = new Date()
    const end = new Date()

    if (type === 'day' || type === 'custom') start.setHours(0, 0, 0, 0)
    else if (type === 'week') start.setDate(end.getDate() - 7)
    else if (type === 'month') start.setMonth(end.getMonth() - 1)
    else if (type === 'year') start.setFullYear(end.getFullYear() - 1)

    state.from = start.toISOString()
    state.to = end.toISOString()
    emit()

    return { from: formatDate(start), to: formatDate(end) }
  }

  // --- UI Components ---

  const RangeDropdown = Dropdown({
    label: 'Period',
    className: 'w-full',
    options: [
      { label: 'Today', value: 'day' },
      { label: 'This Week', value: 'week' },
      { label: 'This Month', value: 'month' },
      { label: 'This Year', value: 'year' },
      { label: 'Custom Range', value: 'custom' },
    ],
    onChange: (val, el) => {
      const root = el.closest('.date-filter-root')
      const customArea = root?.querySelector(
        '.custom-range-area',
      ) as HTMLElement

      if (val === 'custom') {
        const defaults = setPredefinedRange('custom')

        // Update value input date secara manual agar sinkron dengan UI
        const fromEl = customArea?.querySelector(
          'input[name="from"]',
        ) as HTMLInputElement
        const toEl = customArea?.querySelector(
          'input[name="to"]',
        ) as HTMLInputElement

        if (fromEl) fromEl.value = defaults.from
        if (toEl) toEl.value = defaults.to

        customArea?.classList.remove('hidden')
        customArea?.classList.add('flex')
      } else {
        customArea?.classList.add('hidden')
        customArea?.classList.remove('flex')
        setPredefinedRange(val)
      }
    },
  })

  const FromInput = Input({
    label: 'From',
    name: 'from',
    type: 'date',
    value: todayStr, // Default value langsung di args
    className: 'flex-1',
    onChange: (val) => {
      state.from = val ? new Date(val).toISOString() : ''
      emit()
    },
  })

  const ToInput = Input({
    label: 'To',
    name: 'to',
    type: 'date',
    value: todayStr, // Default value langsung di args
    className: 'flex-1',
    onChange: (val) => {
      state.to = val ? new Date(val).toISOString() : ''
      emit()
    },
  })

  return html`
    <div
      class="date-filter-root flex flex-col gap-4 ${className} text-base-content">
      <div class="w-full">${RangeDropdown}</div>

      <div class="custom-range-area hidden flex-row gap-2 transition-all">
        ${FromInput} ${ToInput}
      </div>
    </div>
  `
}
