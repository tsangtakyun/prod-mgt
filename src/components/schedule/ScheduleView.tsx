'use client'

import { useStore } from '@/lib/store'
import { TOD_META, TOD_ORDER } from '@/lib/constants'
import { fmtDate, durLabel } from '@/lib/utils'

export default function ScheduleView() {
  const trip = useStore((s) => s.trip)
  const shots = useStore((s) => s.shots)

  if (!trip || !shots.length) {
    return <div className="p-6 text-center text-sm text-[var(--muted)]">請先建立行程同新增場景。</div>
  }

  const totalMins = shots.reduce((total, shot) => total + Number.parseInt(shot.dur, 10), 0)
  const countries = new Set(shots.map((shot) => shot.country.code)).size

  return (
    <div className="p-5">
      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          { val: shots.length, key: '場景數量', color: 'text-[var(--primary)]' },
          { val: `${trip.days} 日`, key: '行程日數', color: 'text-[#7f56d9]' },
          { val: `${(totalMins / 60).toFixed(1)} 小時`, key: '預計總時長', color: 'text-[var(--warning)]' },
          { val: countries, key: '拍攝國家', color: 'text-[var(--success)]' },
        ].map((item) => (
          <div key={item.key} className="workspace-card px-4 py-4">
            <div className={`text-3xl font-bold tracking-[-0.04em] ${item.color}`}>{item.val}</div>
            <div className="mt-1 text-sm text-[var(--muted)]">{item.key}</div>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {trip.dates.map((date, dayIndex) => {
          const dayShots = shots
            .filter((shot) => shot.day === dayIndex)
            .sort((a, b) => (TOD_ORDER[a.tod] ?? 9) - (TOD_ORDER[b.tod] ?? 9))
          const dateObj = new Date(date)

          return (
            <section key={dayIndex} className="workspace-card overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] bg-[var(--surface-soft)] px-5 py-4">
                <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[#cfd5ff]">
                  第 {dayIndex + 1} 日
                </span>
                <span className="text-sm font-medium text-[var(--text)]">{fmtDate(dateObj)}</span>
                {!dayShots.length && <span className="text-sm italic text-[var(--muted)]">未有場景</span>}
              </div>

              <div>
                {dayShots.length === 0 ? (
                  <div className="px-5 py-8 text-sm text-[var(--muted)]">呢一日暫時未安排拍攝場景。</div>
                ) : (
                  dayShots.map((shot, index) => {
                    const timeMeta = TOD_META[shot.tod]
                    const previousShot = dayShots[index - 1]
                    const crossCountry = previousShot && previousShot.country.code !== shot.country.code

                    return (
                      <div key={shot.id} className="border-t border-[var(--line)] first:border-t-0">
                        {crossCountry && (
                          <div className="border-b border-[var(--line)] bg-[rgba(255,169,77,0.10)] px-5 py-2 text-xs font-semibold text-[var(--warning)]">
                            注意：上一個場景同呢個場景位於不同國家
                          </div>
                        )}
                        <div className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 text-lg font-semibold text-[var(--text)]">{shot.name}</div>
                            <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                              <span>
                                {shot.country.flag} {shot.loc}
                              </span>
                              <span className="font-medium" style={{ color: timeMeta.color }}>
                                {timeMeta.hint}
                              </span>
                              <span>{durLabel(shot.dur)}</span>
                            </div>
                            {shot.props && <div className="mt-2 text-sm text-[var(--text)]">道具 / 器材：{shot.props}</div>}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold"
                              style={{
                                borderColor: `${shot.type.color}44`,
                                color: shot.type.color,
                                background: `rgba(${shot.type.rgb},0.08)`,
                              }}
                            >
                              {shot.type.label}
                            </span>
                            <span
                              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                              style={{ borderColor: `${timeMeta.color}44`, color: timeMeta.color, background: `${timeMeta.color}12` }}
                            >
                              <span>{timeMeta.icon}</span>
                              <span>{timeMeta.label}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
