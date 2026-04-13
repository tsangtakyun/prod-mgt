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
    setName('')
    setDay(null)
    setTod(null)
    setDur(null)
    setPlatform(null)
    setCountry(null)
    setLoc('')
    setProps('')
  }

  const todKeys = Object.keys(TOD_META) as TimeOfDay[]

  return (
    <div className="space-y-5 p-5">
      <div>
        <div className="section-label mono-label">new shot</div>
        <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[var(--text)]">Add New Scene</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">好似喺 SOON internal board 開一個 item 咁，填完就會自動加入 scene list。</p>
      </div>

      <div>
        <Label>片段名稱</Label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：海邊訪問、市集 B-roll、產品平放..."
          className="input"
        />
      </div>

      <div>
        <Label>拍攝日（第幾日）</Label>
        {!trip ? (
          <p className="text-sm text-[var(--muted)]">請先設定行程日期</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {trip.dates.map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDay(i)}
                className={`pill ${day === i ? 'pill-primary' : 'pill-default'}`}
              >
                Day {i + 1} · {fmtDateShort(new Date(d))}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
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
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    sel ? 'text-[var(--text)] shadow-sm' : 'text-[var(--muted)]'
                  }`}
                  style={
                    sel
                      ? { borderColor: meta.color, color: meta.color, background: '#fff' }
                      : { borderColor: 'var(--line)', background: '#fff' }
                  }
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
                className={`pill ${dur === d.value ? 'pill-primary' : 'pill-default'}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

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
                className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all"
                style={
                  sel
                    ? { borderColor: p.color, color: p.color, background: '#fff' }
                    : { borderColor: 'var(--line)', color: 'var(--muted)', background: '#fff' }
                }
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <Label>拍攝地點</Label>
        <div className="grid gap-2 lg:grid-cols-[190px_1fr]">
          <CountrySelector value={country} onChange={setCountry} />
          <input
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            placeholder="城市 / 具體地點"
            className="input"
          />
        </div>
      </div>

      <div className="grid items-end gap-3 lg:grid-cols-[1fr_auto]">
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
        <button onClick={submit} className="primary-btn">
          Add item
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-[rgba(255,168,168,0.22)] bg-[rgba(255,168,168,0.08)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]">{children}</p>
}
