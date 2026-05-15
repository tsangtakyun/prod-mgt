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
    if (!name.trim()) {
      setError('請輸入片段名稱')
      return
    }
    if (day === null) {
      setError('請選擇拍攝日')
      return
    }
    if (!tod) {
      setError('請選擇拍攝時段')
      return
    }
    if (!dur) {
      setError('請選擇預計時長')
      return
    }
    if (!platform) {
      setError('請選擇平台 / 類型')
      return
    }
    if (!country) {
      setError('請選擇國家')
      return
    }
    if (!loc.trim()) {
      setError('請輸入拍攝地點')
      return
    }

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
        <div className="section-label mono-label">新場景</div>
        <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[var(--text)]">新增場景</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">填寫以下資料，完成後自動加入場景清單。</p>
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
          <p className="text-sm text-[var(--muted)]">請先建立行程日期範圍</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {trip.dates.map((date, index) => (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => setDay(index)}
                className={`pill ${day === index ? 'pill-primary' : 'pill-default'}`}
              >
                第 {index + 1} 日 · {fmtDateShort(new Date(date))}
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
              const selected = tod === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTod(key)}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all"
                  style={
                    selected
                      ? { borderColor: 'var(--soon-purple)', color: '#fff', background: 'var(--soon-purple)' }
                      : {
                          borderColor: 'var(--soon-border)',
                          color: 'var(--soon-text)',
                          background: 'var(--soon-surface2)',
                        }
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
            {DURATIONS.map((duration) => (
              <button
                key={duration.value}
                type="button"
                onClick={() => setDur(duration.value)}
                className={`pill ${dur === duration.value ? 'pill-primary' : 'pill-default'}`}
              >
                {duration.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label>平台 / 類型</Label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((item) => {
            const selected = platform?.id === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPlatform(item)}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all"
                style={
                  selected
                    ? { borderColor: 'var(--soon-purple)', color: '#fff', background: 'var(--soon-purple)' }
                    : {
                        borderColor: 'var(--soon-border)',
                        color: 'var(--soon-text)',
                        background: 'var(--soon-surface2)',
                      }
                }
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <Label>拍攝地點</Label>
        <div className="grid gap-2 lg:grid-cols-[190px_1fr]">
          <CountrySelector value={country} onChange={setCountry} />
          <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="城市 / 具體地點" className="input" />
        </div>
      </div>

      <div className="grid items-end gap-3 lg:grid-cols-[1fr_auto]">
        <div>
          <Label>所需道具 / 器材</Label>
          <input
            value={props}
            onChange={(e) => setProps(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="例：腳架、gimbal、無線咪..."
            className="input"
          />
        </div>
        <button onClick={submit} className="primary-btn" type="button">
          新增
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
