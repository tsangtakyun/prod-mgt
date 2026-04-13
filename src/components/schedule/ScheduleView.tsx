'use client'
import { useStore } from '@/lib/store'
import { TOD_META, TOD_ORDER } from '@/lib/constants'
import { fmtDate, durLabel } from '@/lib/utils'

export default function ScheduleView() {
  const trip = useStore((s) => s.trip)
  const shots = useStore((s) => s.shots)

  if (!trip || !shots.length) {
    return <div className="p-6 text-center text-sm text-[var(--muted)]">請先設定行程日期並加入場景</div>
  }

  const totalMins = shots.reduce((a, s) => a + parseInt(s.dur), 0)
  const countries = new Set(shots.map((s) => s.country.code)).size

  return (
    <div className="p-5">
      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          { val: shots.length, key: '場景數量', color: 'text-[var(--primary)]' },
          { val: `${trip.days} 日`, key: '行程天數', color: 'text-[#7f56d9]' },
          { val: `${(totalMins / 60).toFixed(1)} h`, key: '總拍攝時間', color: 'text-[var(--warning)]' },
          { val: countries, key: '拍攝國家', color: 'text-[var(--success)]' },
        ].map((s) => (
          <div key={s.key} className="workspace-card px-4 py-4">
            <div className={`text-3xl font-bold tracking-[-0.04em] ${s.color}`}>{s.val}</div>
            <div className="mt-1 text-sm text-[var(--muted)]">{s.key}</div>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {trip.dates.map((d, dayIdx) => {
          const dayShots = shots
            .filter((s) => s.day === dayIdx)
            .sort((a, b) => (TOD_ORDER[a.tod] ?? 9) - (TOD_ORDER[b.tod] ?? 9))
          const dateObj = new Date(d)

          return (
            <section key={dayIdx} className="workspace-card overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] bg-[var(--surface-soft)] px-5 py-4">
                <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[#cfd5ff]">
                  DAY {dayIdx + 1}
                </span>
                <span className="text-sm font-medium text-[var(--text)]">{fmtDate(dateObj)}</span>
                {!dayShots.length && (
                  <span className="text-sm italic text-[var(--muted)]">未有安排</span>
                )}
              </div>

              <div className="space-y-0">
                {dayShots.length === 0 ? (
                  <div className="px-5 py-8 text-sm text-[var(--muted)]">呢一日仲未安排任何拍攝。</div>
                ) : (
                  dayShots.map((s, i) => {
                    const tm = TOD_META[s.tod]
                    const prevShot = dayShots[i - 1]
                    const crossCountry = prevShot && prevShot.country.code !== s.country.code

                    return (
                      <div key={s.id} className="border-t border-[var(--line)] first:border-t-0">
                        {crossCountry && (
                          <div className="border-b border-[var(--line)] bg-[rgba(255,169,77,0.10)] px-5 py-2 text-xs font-semibold text-[var(--warning)]">
                            ✈ 跨國移動
                          </div>
                        )}
                        <div className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 text-lg font-semibold text-[var(--text)]">{s.name}</div>
                            <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                              <span>{s.country.flag} {s.loc}</span>
                              <span className="font-medium" style={{ color: tm.color }}>{tm.hint}</span>
                              <span>{durLabel(s.dur)}</span>
                            </div>
                            {s.props && (
                              <div className="mt-2 text-sm text-[var(--muted)]">🎒 {s.props}</div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold"
                              style={{ borderColor: `${s.type.color}44`, color: s.type.color, background: `rgba(${s.type.rgb},0.08)` }}
                            >
                              {s.type.label}
                            </span>
                            <span
                              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                              style={{ borderColor: `${tm.color}44`, color: tm.color, background: `${tm.color}12` }}
                            >
                              <span>{tm.icon}</span>
                              <span>{tm.label}</span>
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
