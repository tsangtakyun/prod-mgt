'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { PLATFORMS, TOD_META, DURATIONS } from '@/lib/constants'
import CountrySelector from '@/components/ui/CountrySelector'
import { fmtDateShort } from '@/lib/utils'
import type { Country, PlatformMeta, TimeOfDay, Duration } from '@/types'

export default function ShotForm() {
  const trip = useStore((s) => s.trip)
  const addShot = useStore((s) => s.addShot)

  const [name, setName] = useState('')
  const [day, setDay] = useState<number | null>(null)
  const [tod, setTod] = useState<TimeOfDay | null>(null)
  const [dur, setDur] = useState<Duration | null>(null)
  const [platform, setPlatform] = useState<PlatformMeta | null>(null)
  const [country, setCountry] = useState<Country | null>(null)
  const [loc, setLoc] = useState('')
  const [props, setProps] = useState('')
  const [error, setError] = useState('')

  function submit() {
    if (!name.trim()) { setError('請填寫片段名稱'); return }
    if (day === null) { setError('請選擇第幾日拍攝'); return }
    if (!tod) { setError('請選擇拍攝時段'); return }
    if (!dur) { setError('請選擇預計時長'); return }
    if (!platform) { setError('請選擇平台 / 類型'); return }
    if (!country) { setError('請選擇拍攝國家'); return }
    if (!loc.trim()) { setError('請填寫具體地點'); return }
    setError('')
    addShot({ name: name.trim(), day, tod, dur, type: platform, country, loc: loc.trim(), props: props.trim() })
    setName(''); setDay(null); setTod(null); setDur(null); setPlatform(null); setLoc(''); setProps('')
  }

  const todKeys = Object.keys(TOD_META) as TimeOfDay[]

  return (
    <div className="space-y-4 p-6">
      {/* Name */}
      <div>
        <Label>片段名稱</Label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：海邊訪問、市集 B-roll、產品平放..."
          className="input"
        />
      </div>

      {/* Day selector */}
      <div>
        <Label>拍攝日（第幾日）</Label>
        {!trip ? (
          <p className="text-xs text-white/25">請先設定行程日期</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {trip.dates.map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDay(i)}
                className={`pill ${day === i ? 'pill-amber' : 'pill-default'}`}
              >
                Day {i + 1} · {fmtDateShort(new Date(d))}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TOD + Duration */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label>拍攝時段</Label>
          <div className="flex flex-wrap gap-2">
            {todKeys.map((key) => {
              const meta = TOD_META[key]
              const sel = tod === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTod(key)}
                  style={sel ? { borderColor: meta.color, color: meta.color, background: `rgba(${meta.color},0.1)` } : {}}
                  className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition-all ${
                    sel ? 'border-current' : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <Label>預計時長</Label>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDur(d.value)}
                className={`pill ${dur === d.value ? 'pill-amber' : 'pill-default'}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Platform */}
      <div>
        <Label>平台 / 類型</Label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => {
            const sel = platform?.id === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p)}
                style={sel ? { borderColor: p.color, color: p.color, background: `rgba(${p.rgb},0.1)` } : {}}
                className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-all ${
                  sel ? 'border-current' : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70'
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Location */}
      <div>
        <Label>拍攝地點</Label>
        <div className="grid grid-cols-[190px_1fr] gap-2">
          <CountrySelector value={country} onChange={setCountry} />
          <input
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            placeholder="城市 / 具體地點"
            className="input"
          />
        </div>
      </div>

      {/* Props + Submit */}
      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
        <div>
          <Label>所需道具 / 器材</Label>
          <input
            value={props}
            onChange={(e) => setProps(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="例：腳架、gimbal、無線咪、反光板..."
            className="input"
          />
        </div>
        <button
          onClick={submit}
          className="rounded-md bg-amber-300 px-5 py-2.5 font-mono text-xs font-medium tracking-wider text-black transition-opacity hover:opacity-85"
        >
          + 加入
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 font-mono text-[10px] tracking-widest text-white/35 uppercase">
      {children}
    </p>
  )
}
