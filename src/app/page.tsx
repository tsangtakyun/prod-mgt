'use client'

import { useState } from 'react'
import { CalendarDays, LayoutGrid, Sparkles, MapPinned, Plus } from 'lucide-react'
import { useStore } from '@/lib/store'
import TripSetupModal from '@/components/ui/TripSetupModal'
import ShotForm from '@/components/forms/ShotForm'
import ShotsTable from '@/components/schedule/ShotsTable'
import ScheduleView from '@/components/schedule/ScheduleView'
import AnalysisView from '@/components/schedule/AnalysisView'
import { fmtDateShort } from '@/lib/utils'

type Tab = 'plan' | 'schedule' | 'analysis'

const TABS: Array<{ key: Tab; label: string; icon: typeof LayoutGrid }> = [
  { key: 'plan', label: 'Content Board', icon: LayoutGrid },
  { key: 'schedule', label: 'Schedule', icon: CalendarDays },
  { key: 'analysis', label: 'AI Insights', icon: Sparkles },
]

export default function Home() {
  const trip = useStore((s) => s.trip)
  const shots = useStore((s) => s.shots)
  const countries = new Set(shots.map((s) => s.country.code)).size

  const [tab, setTab] = useState<Tab>('plan')
  const [showModal, setShowModal] = useState(!trip)

  return (
    <div className="workspace-shell">
      {showModal && <TripSetupModal onClose={() => setShowModal(false)} />}

      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-5 pb-8 pt-5 lg:px-8">
        <header className="workspace-card mb-4 flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <div>
              <div className="top-pill mb-2 inline-flex items-center gap-2">prod-mgt workspace</div>
              <h1 className="text-2xl font-bold tracking-[-0.03em] text-slate-800 lg:text-[30px]">
                Production Board
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                用 monday.com 風格去整理拍攝計劃、場景安排同 AI 分析，成個 trip 一眼睇晒。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3">
              <div className="section-label mono-label">today</div>
              <div className="mt-1 text-sm font-semibold text-slate-700">
                {new Date().toLocaleDateString('zh-HK', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <button onClick={() => setShowModal(true)} className="primary-btn inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {trip ? 'Edit Trip' : 'Setup Trip'}
            </button>
          </div>
        </header>

        <section className="mb-4 grid gap-3 lg:grid-cols-[1.3fr_repeat(3,0.7fr)]">
          <div className="workspace-card flex flex-col gap-3 px-5 py-4">
            <div className="section-label mono-label">trip summary</div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-2xl font-bold tracking-[-0.03em] text-slate-800">
                  {trip?.name ?? '未設定拍攝行程'}
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                  {trip ? (
                    <>
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                        <CalendarDays className="h-4 w-4 text-[var(--primary)]" />
                        {fmtDateShort(new Date(trip.start))} → {fmtDateShort(new Date(trip.end))}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                        <MapPinned className="h-4 w-4 text-[var(--success)]" />
                        {countries} 個拍攝國家
                      </span>
                    </>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1">請先設定日期範圍同 trip 名稱</span>
                  )}
                </div>
              </div>
              {trip && (
                <div className="rounded-2xl bg-[var(--surface-soft)] px-4 py-3 text-right">
                  <div className="section-label mono-label">duration</div>
                  <div className="mt-1 text-xl font-bold text-slate-800">{trip.days} days</div>
                </div>
              )}
            </div>
          </div>

          {[
            { label: 'Shots', value: shots.length, tone: 'text-[var(--primary)]' },
            { label: 'Countries', value: countries, tone: 'text-[var(--success)]' },
            { label: 'Status', value: trip ? 'Active' : 'Pending', tone: 'text-[#7f56d9]' },
          ].map((item) => (
            <div key={item.label} className="workspace-card px-5 py-4">
              <div className="section-label mono-label">{item.label}</div>
              <div className={`mt-3 text-3xl font-bold tracking-[-0.04em] ${item.tone}`}>{item.value}</div>
            </div>
          ))}
        </section>

        <section className="workspace-card flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-[var(--line)] bg-[var(--surface-soft)] px-4 pt-4">
            <div className="flex flex-wrap gap-2">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`inline-flex items-center gap-2 rounded-t-2xl border border-b-0 px-4 py-3 text-sm font-semibold transition-all ${
                    tab === key
                      ? 'border-[var(--line)] bg-white text-[var(--primary)]'
                      : 'border-transparent bg-transparent text-slate-500 hover:bg-white/70 hover:text-slate-700'
                  }`}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white">
            {tab === 'plan' && (
              <div className="grid gap-0 xl:grid-cols-[420px_minmax(0,1fr)]">
                <div className="border-b border-[var(--line)] bg-[var(--surface-soft)] xl:border-b-0 xl:border-r">
                  <ShotForm />
                </div>
                <div className="px-5 pb-6 pt-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="section-label mono-label">shot inventory</div>
                      <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-slate-800">Scene List</h2>
                    </div>
                    <div className="rounded-full bg-[var(--primary-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--primary)]">
                      {shots.length} items
                    </div>
                  </div>
                  <ShotsTable />
                </div>
              </div>
            )}

            {tab === 'schedule' && <ScheduleView />}
            {tab === 'analysis' && <AnalysisView />}
          </div>
        </section>
      </div>
    </div>
  )
}
