'use client'
import { useStore } from '@/lib/store'
import { TOD_META, TOD_ORDER, DURATIONS } from '@/lib/constants'
import { fmtDate, durLabel } from '@/lib/utils'

export default function ScheduleView() {
  const trip = useStore((s) => s.trip)
  const shots = useStore((s) => s.shots)

  if (!trip || !shots.length) {
    return <div className="py-10 text-center text-sm text-white/25">請先設定行程日期並加入場景</div>
  }

  const totalMins = shots.reduce((a, s) => a + parseInt(s.dur), 0)
  const countries = new Set(shots.map((s) => s.country.code)).size

  return (
    <div className="p-6">
      {/* Stats */}
      <div className="mb-5 grid grid-cols-4 gap-3">
        {[
          { val: shots.length, key: '場景數量' },
          { val: `${trip.days}日`, key: '行程天數' },
          { val: `${(totalMins / 60).toFixed(1)}h`, key: '總拍攝時間' },
          { val: countries, key: '拍攝國家' },
        ].map((s) => (
          <div key={s.key} className="rounded-lg border border-white/7 bg-[#161616] p-3">
            <div className="font-mono text-xl font-medium text-amber-300">{s.val}</div>
            <div className="mt-0.5 text-[11px] text-white/35">{s.key}</div>
          </div>
        ))}
      </div>

      {/* Day sections */}
      <div className="space-y-5">
        {trip.dates.map((d, dayIdx) => {
          const dayShots = shots
            .filter((s) => s.day === dayIdx)
            .sort((a, b) => (TOD_ORDER[a.tod] ?? 9) - (TOD_ORDER[b.tod] ?? 9))
          const dateObj = new Date(d)

          return (
            <div key={dayIdx}>
              <div className="mb-2 flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-widest text-amber-300">
                  DAY {dayIdx + 1}
                </span>
                <span className="text-[11px] text-white/35">{fmtDate(dateObj)}</span>
                {!dayShots.length && (
                  <span className="text-[11px] italic text-white/20">（未有安排）</span>
                )}
              </div>

              <div className="space-y-1.5">
                {dayShots.map((s, i) => {
                  const tm = TOD_META[s.tod]
                  const prevShot = dayShots[i - 1]
                  const crossCountry = prevShot && prevShot.country.code !== s.country.code

                  return (
                    <div key={s.id}>
                      {crossCountry && (
                        <div className="my-1 ml-8 font-mono text-[11px] text-red-400">
                          ✈ 跨國移動
                        </div>
                      )}
                      <div className="flex items-start gap-3 rounded-md bg-[#161616] p-3">
                        <span className="mt-0.5 text-lg leading-none">{tm.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 font-medium">{s.name}</div>
                          <div className="flex flex-wrap gap-3 text-[11px] text-white/40">
                            <span>{s.country.flag} {s.loc}</span>
                            <span style={{ color: tm.color }}>{tm.hint}</span>
                            <span>{durLabel(s.dur)}</span>
                            <span
                              className="rounded-full border px-2 py-0.5 font-mono text-[10px]"
                              style={{ borderColor: s.type.color, color: s.type.color, background: `rgba(${s.type.rgb},0.08)` }}
                            >
                              {s.type.label}
                            </span>
                          </div>
                          {s.props && (
                            <div className="mt-1 text-[11px] text-white/30">
                              🎒 {s.props}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
