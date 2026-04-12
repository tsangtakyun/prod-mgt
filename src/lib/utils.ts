import { format, addDays, parseISO } from 'date-fns'
import { zhHK } from 'date-fns/locale'

export function buildTripDates(start: string, end: string): Date[] {
  const startDate = parseISO(start)
  const endDate = parseISO(end)
  const days: Date[] = []
  let current = startDate
  while (current <= endDate) {
    days.push(new Date(current))
    current = addDays(current, 1)
  }
  return days
}

export function fmtDate(date: Date): string {
  return format(date, 'M月d日 (EEE)', { locale: zhHK })
}

export function fmtDateShort(date: Date): string {
  return format(date, 'M/d')
}

export function durLabel(dur: string): string {
  const map: Record<string, string> = {
    '30': '30分', '60': '1小時', '120': '2小時',
    '180': '3小時', '240': '4小時', '360': '半日',
  }
  return map[dur] ?? dur
}

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
