export const getDateRange = (
  period: string,
  customStart?: string,
  customEnd?: string,
) => {
  const now = new Date()
  const today = now.toISOString().split('T')[0]

  switch (period) {
  case 'day':
    return { start: today, end: today }
  case 'week': {
    const first = now.getDate() - now.getDay()
    return {
      start: new Date(now.setDate(first)).toISOString().split('T')[0],
      end: new Date(now.setDate(first + 6)).toISOString().split('T')[0],
    }
  }
  case 'month':
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0],
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0],
    }
  case 'year':
    return {
      start: `${now.getFullYear()}-01-01`,
      end: `${now.getFullYear()}-12-31`,
    }
  case 'custom':
    return { start: customStart || '', end: customEnd || '' }
  default:
    return { start: '', end: '' }
  }
}
