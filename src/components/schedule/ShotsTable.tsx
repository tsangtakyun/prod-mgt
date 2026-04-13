'use client'
import { Trash2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import { TOD_META, TOD_ORDER, DURATIONS } from '@/lib/constants'

const durLabel = Object.fromEntries(DURATIONS.map((d) => [d.value, d.label]))

export default function ShotsTable() {
  const shots = useStore((s) => s.shots)
  const removeShot = useStore((s) => s.removeShot)

  if (!shots.length) {
    return (
      <div className="workspace-card-soft flex min-h-[220px] items-center justify-center rounded-2xl text-sm text-[var(--muted)]">
        未有場景，請加入拍攝計劃
      </div>
    )
  }

  const sorted = [...shots].sort(
    (a, b) => a.day - b.day || (TOD_ORDER[a.tod] ?? 9) - (TOD_ORDER[b.tod] ?? 9)
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-sm">
          <thead className="bg-[var(--surface-soft)]">
            <tr>
              {['#', 'Day', '片段名稱', '地點', '時段', '時長', '平台', '道具', ''].map((h, i) => (
                <th
                  key={i}
                  className="border-b border-[var(--line)] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]"
                  style={{ width: ['42px', '72px', '19%', '21%', '14%', '10%', '12%', '14%', '46px'][i] }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[var(--surface)]">
            {sorted.map((s, i) => {
              const tm = TOD_META[s.tod]
              return (
                <tr key={s.id} className="border-b border-[var(--line)] last:border-b-0 hover:bg-[var(--surface-hover)]">
                  <td className="px-3 py-3 text-xs font-semibold text-[var(--muted-soft)]">{String(i + 1).padStart(2, '0')}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-semibold text-[#cfd5ff]">
                      Day {s.day + 1}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-semibold text-[var(--text)]">{s.name}</div>
                  </td>
                  <td className="px-3 py-3 text-[var(--muted)]">
                    <span className="mr-1.5">{s.country.flag}</span>
                    <span className="font-medium text-[var(--muted)]">{s.country.name}</span>
                    <span className="mx-1 text-[rgba(255,255,255,0.16)]">·</span>
                    {s.loc}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold"
                      style={{ borderColor: `${tm.color}44`, color: tm.color, background: `${tm.color}12` }}
                    >
                      <span>{tm.icon}</span>
                      <span>{tm.label}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-[var(--muted)]">{durLabel[s.dur]}</td>
                  <td className="px-3 py-3">
                    <span
                      className="inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold"
                      style={{ borderColor: `${s.type.color}44`, color: s.type.color, background: `rgba(${s.type.rgb},0.08)` }}
                    >
                      {s.type.label}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-[var(--muted)]">{s.props || '—'}</td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => removeShot(s.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-soft)] transition-all hover:bg-[rgba(255,168,168,0.08)] hover:text-[var(--danger)]"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
