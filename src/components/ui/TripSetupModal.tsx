'use client'
import { useState } from 'react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-[400px] rounded-xl border border-white/10 bg-[#161616] p-6">
        <div className="mb-5 font-mono text-sm tracking-widest text-amber-300">
          設定行程日期範圍
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-widest text-white/35">出發日期</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-md border border-white/8 bg-[#1c1c1c] px-3 py-2 text-sm text-white outline-none focus:border-amber-300"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-widest text-white/35">返回日期</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-md border border-white/8 bg-[#1c1c1c] px-3 py-2 text-sm text-white outline-none focus:border-amber-300"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-1 block font-mono text-[10px] tracking-widest text-white/35">行程名稱（可選）</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：東京拍攝之旅、IG Reel 香港篇..."
            className="w-full rounded-md border border-white/8 bg-[#1c1c1c] px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-amber-300"
          />
        </div>

        {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

        <button
          onClick={confirm}
          className="w-full rounded-md bg-amber-300 py-2.5 font-mono text-xs font-medium tracking-widest text-black transition-opacity hover:opacity-85"
        >
          確認行程
        </button>
      </div>
    </div>
  )
}
