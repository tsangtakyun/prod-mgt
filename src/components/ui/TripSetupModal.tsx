'use client'
import { useState } from 'react'
import { CalendarDays, Plane } from 'lucide-react'
import { buildTripDates } from '@/lib/utils'
import { useStore } from '@/lib/store'
import type { Trip } from '@/types'

interface Props {
  onClose: () => void
}

export default function TripSetupModal({ onClose }: Props) {
  const setTrip = useStore((s) => s.setTrip)
  const existingTrip = useStore((s) => s.trip)

  const [start, setStart] = useState(existingTrip?.start ?? '')
  const [end, setEnd] = useState(existingTrip?.end ?? '')
  const [name, setName] = useState(existingTrip?.name ?? '')
  const [error, setError] = useState('')

  function confirm() {
    if (!start || !end) { setError('請選擇出發同返回日期'); return }
    if (end < start) { setError('返回日期不能早於出發日期'); return }
    const dates = buildTripDates(start, end)
    const trip: Trip = {
      name: name.trim() || '未命名行程',
      start,
      end,
      days: dates.length,
      dates,
    }
    setTrip(trip)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.32)]">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <div className="section-label mono-label">trip setup</div>
            <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[var(--text)]">設定行程日期範圍</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">先建立 trip 基本資料，之後先可以安排每一個拍攝場景。</p>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]">出發日期</label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-soft)]" />
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]">返回日期</label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-soft)]" />
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]">行程名稱（可選）</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：東京拍攝之旅、IG Reel 香港篇..."
            className="input"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-[rgba(226,68,92,0.18)] bg-[rgba(226,68,92,0.08)] px-3 py-2 text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="secondary-btn flex-1" type="button">
            Cancel
          </button>
          <button onClick={confirm} className="primary-btn flex-1" type="button">
            Confirm Trip
          </button>
        </div>
      </div>
    </div>
  )
}
