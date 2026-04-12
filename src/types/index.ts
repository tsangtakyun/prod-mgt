export type TimeOfDay = 'dawn' | 'day' | 'golden' | 'dusk' | 'night' | 'flex'

export type Platform =
  | 'ig_reel'
  | 'youtube'
  | 'photo'
  | 'podcast'
  | 'tiktok'
  | 'event'
  | 'bts'
  | 'other'

export type Duration = '30' | '60' | '120' | '180' | '240' | '360'

export interface Country {
  code: string
  flag: string
  name: string
}

export interface PlatformMeta {
  id: Platform
  label: string
  color: string
  rgb: string
}

export interface TimeOfDayMeta {
  label: string
  icon: string
  hint: string
  color: string
}

export interface Shot {
  id: number
  name: string
  day: number          // 0-indexed day within the trip
  tod: TimeOfDay
  dur: Duration
  type: PlatformMeta
  country: Country
  loc: string
  props: string
}

export interface Trip {
  name: string
  start: string        // ISO date string YYYY-MM-DD
  end: string
  days: number
  dates: Date[]
}
