'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import TripSetupModal from '@/components/ui/TripSetupModal'
import ShotForm from '@/components/forms/ShotForm'
import ShotsTable from '@/components/schedule/ShotsTable'
import ScheduleView from '@/components/schedule/ScheduleView'
import AnalysisView from '@/components/schedule/AnalysisView'
import { fmtDate, fmtDateShort } from '@/lib/utils'

type Tab = 'plan' | 'schedule' | 'analysis'

export default function Home() {
  const trip = useStore((s) => s.trip)
  const shots = useStore((s) => s.shots)
  const countries = new Set(shots.map((s) => s.country.code)).size

  const [tab, setTab] = useState<Tab>('plan')
  const [showModal, setShowModal] = useState(!trip)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {showModal && <TripSetupModal onClose={() => setShowModal(false)} />}

      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/8 bg-[#111] px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[1, 0.4, 1].map((op, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-amber-300" style={{ opacity: op }} />
            ))}
          </div>
          <div>
            <div className="font-mono text-sm font-medium tracking-widest text-amber-300">PROD / MGT</div>
            <div className="text-[11px] font-light text-white/35">Production Management System</div>
          </div>
        </div>
        <div className="font-mono text-[11px] text-white/25">
          {new Date().toLocaleDateString('zh-HK', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Trip banner */}
      <div className="flex items-center justify-between border-b border-white/6 bg-[#161616] px-6 py-2.5">
        <div className="flex items-center gap-8 text-sm">
          <div>
            <div className="font-mono text-[10px] tracking-widest text-white/35">行程</div>
            <div className="font-mono font-medium text-amber-300">{trip?.name ?? '未設定'}</div>
          </div>
          {trip && (
            <>
              <div>
                <div className="font-mono text-[10px] tracking-widest text-white/35">日期範圍</div>
                <div className="font-mono font-medium text-amber-300">
                  {fmtDateShort(new Date(trip.start))} → {fmtDateShort(new Date(trip.end))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-widest text-white/35">共</div>
                <div className="font-mono font-medium text-amber-300">{trip.days} 日</div>
              </div>
            </>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded border border-white/10 px-3 py-1 font-mono text-[11px] text-white/35 transition-all hover:border-white/25 hover:text-white/70"
        >
          {trip ? '修改' : '設定行程'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/8 bg-[#111] px-6">
        {([['plan', '場景計劃'], ['schedule', '排程'], ['analysis', 'AI 分析']] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-2.5 font-mono text-xs tracking-wider transition-all ${
              tab === t
                ? 'border-amber-300 text-amber-300'
                : 'border-transparent text-white/40 hover:text-white/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl">
        {tab === 'plan' && (
          <>
            <ShotForm />
            <div className="border-t border-white/6 px-6 pb-6 pt-4">
              <div className="mb-2 font-mono text-[10px] tracking-widest text-white/35 uppercase">場景列表</div>
              <ShotsTable />
            </div>
          </>
        )}
        {tab === 'schedule' && <ScheduleView />}
        {tab === 'analysis' && <AnalysisView />}
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/8 bg-[#111] px-6 py-3">
        <div className="text-xs text-white/35">
          共 <span className="font-medium text-amber-300">{shots.length}</span> 個場景 ·{' '}
          <span className="font-medium text-amber-300">{countries}</span> 個國家
        </div>
        <button
          onClick={() => setTab('analysis')}
          className="rounded-md bg-amber-300 px-5 py-2 font-mono text-xs font-medium tracking-wider text-black transition-opacity hover:opacity-85"
        >
          ▶ AI 分析排程
        </button>
      </div>
    </div>
  )
}
