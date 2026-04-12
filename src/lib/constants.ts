import type { Country, PlatformMeta, TimeOfDayMeta, Duration } from '@/types'

export const COUNTRIES: Country[] = [
  { code: 'HK', flag: '🇭🇰', name: '香港' },
  { code: 'MO', flag: '🇲🇴', name: '澳門' },
  { code: 'TW', flag: '🇹🇼', name: '台灣' },
  { code: 'CN', flag: '🇨🇳', name: '中國內地' },
  { code: 'JP', flag: '🇯🇵', name: '日本' },
  { code: 'KR', flag: '🇰🇷', name: '南韓' },
  { code: 'SG', flag: '🇸🇬', name: '新加坡' },
  { code: 'TH', flag: '🇹🇭', name: '泰國' },
  { code: 'VN', flag: '🇻🇳', name: '越南' },
  { code: 'MY', flag: '🇲🇾', name: '馬來西亞' },
  { code: 'ID', flag: '🇮🇩', name: '印尼' },
  { code: 'PH', flag: '🇵🇭', name: '菲律賓' },
  { code: 'GB', flag: '🇬🇧', name: '英國' },
  { code: 'FR', flag: '🇫🇷', name: '法國' },
  { code: 'DE', flag: '🇩🇪', name: '德國' },
  { code: 'IT', flag: '🇮🇹', name: '意大利' },
  { code: 'ES', flag: '🇪🇸', name: '西班牙' },
  { code: 'PT', flag: '🇵🇹', name: '葡萄牙' },
  { code: 'NL', flag: '🇳🇱', name: '荷蘭' },
  { code: 'CH', flag: '🇨🇭', name: '瑞士' },
  { code: 'US', flag: '🇺🇸', name: '美國' },
  { code: 'CA', flag: '🇨🇦', name: '加拿大' },
  { code: 'AU', flag: '🇦🇺', name: '澳洲' },
  { code: 'NZ', flag: '🇳🇿', name: '新西蘭' },
  { code: 'AE', flag: '🇦🇪', name: '阿聯酋' },
  { code: 'TR', flag: '🇹🇷', name: '土耳其' },
  { code: 'IN', flag: '🇮🇳', name: '印度' },
  { code: 'ZA', flag: '🇿🇦', name: '南非' },
  { code: 'MX', flag: '🇲🇽', name: '墨西哥' },
  { code: 'BR', flag: '🇧🇷', name: '巴西' },
  { code: 'IS', flag: '🇮🇸', name: '冰島' },
  { code: 'NO', flag: '🇳🇴', name: '挪威' },
  { code: 'SE', flag: '🇸🇪', name: '瑞典' },
  { code: 'DK', flag: '🇩🇰', name: '丹麥' },
  { code: 'GR', flag: '🇬🇷', name: '希臘' },
  { code: 'HR', flag: '🇭🇷', name: '克羅地亞' },
  { code: 'MA', flag: '🇲🇦', name: '摩洛哥' },
  { code: 'EG', flag: '🇪🇬', name: '埃及' },
]

export const PLATFORMS: PlatformMeta[] = [
  { id: 'ig_reel', label: 'IG Reel',        color: '#e040c8', rgb: '224,64,200' },
  { id: 'youtube', label: 'YouTube',         color: '#ff5555', rgb: '255,85,85' },
  { id: 'photo',   label: 'Photo Shooting',  color: '#7a9ee8', rgb: '122,158,232' },
  { id: 'podcast', label: 'Podcast',         color: '#78d492', rgb: '120,212,146' },
  { id: 'tiktok',  label: 'TikTok',          color: '#00d4aa', rgb: '0,212,170' },
  { id: 'event',   label: 'Event',           color: '#e8c97a', rgb: '232,201,122' },
  { id: 'bts',     label: 'BTS',             color: '#b07aff', rgb: '176,122,255' },
  { id: 'other',   label: '其他',             color: '#888888', rgb: '136,136,136' },
]

export const TOD_META: Record<string, TimeOfDayMeta> = {
  dawn:   { label: '日出/清晨', icon: '🌅', hint: '約 5:30–7:30am', color: '#f4a261' },
  day:    { label: '日光',     icon: '☀️',  hint: '約 9am–4pm',    color: '#e8c97a' },
  golden: { label: '黃金時段', icon: '🌇', hint: '日落前 1小時',   color: '#ff8c42' },
  dusk:   { label: '黃昏',     icon: '🌆', hint: '約 6–8pm',      color: '#c77dff' },
  night:  { label: '夜晚',     icon: '🌙', hint: '8pm 後',        color: '#7a9ee8' },
  flex:   { label: '彈性',     icon: '🔄', hint: 'AI 決定最佳時間', color: '#78d492' },
}

export const DURATIONS: { value: Duration; label: string }[] = [
  { value: '30',  label: '30分' },
  { value: '60',  label: '1小時' },
  { value: '120', label: '2小時' },
  { value: '180', label: '3小時' },
  { value: '240', label: '4小時' },
  { value: '360', label: '半日' },
]

export const TOD_ORDER: Record<string, number> = {
  dawn: 0, day: 1, golden: 2, dusk: 3, night: 4, flex: 5,
}
