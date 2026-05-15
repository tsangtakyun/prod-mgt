'use client'

import { Trash2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import { TOD_META, TOD_ORDER, DURATIONS } from '@/lib/constants'

const durLabel = Object.fromEntries(DURATIONS.map((item) => [item.value, item.label]))

export default function ShotsTable() {
  const shots = useStore((s) => s.shots)
  const removeShot = useStore((s) => s.removeShot)

  if (!shots.length) {
    return (
      <div className="workspace-card-soft flex min-h-[220px] items-center justify-center rounded-2xl text-sm text-[var(--muted)]">
        未有場景，請先新增場景。
      </div>
    )
  }

  const sorted = [...shots].sort((a, b) => a.day - b.day || (TOD_ORDER[a.tod] ?? 9) - (TOD_ORDER[b.tod] ?? 9))

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-sm">
          <thead className="bg-[var(--surface-soft)]">
            <tr>
              {['#', '拍攝日', '片段名稱', '拍攝地點', '拍攝時段', '預計時長', '平台 / 類型', '所需道具 / 器材', ''].map((header, index) => (
                <th
                  key={header || index}
                  className="border-b border-[var(--line)] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]"
                  style={{ width: ['42px', '72px', '19%', '21%', '14%', '10%', '12%', '14%', '46px'][index] }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[var(--surface)]">
            {sorted.map((shot, index) => {
              const timeMeta = TOD_META[shot.tod]
              return (
                <tr key={shot.id} className="border-b border-[var(--line)] last:border-b-0 hover:bg-[rgba(255,255,255,0.03)]">
                  <td className="px-3 py-3 text-xs font-semibold text-[var(--muted-soft)]">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-semibold text-[#cfd5ff]">
                      第 {shot.day + 1} 日
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-semibold text-[var(--text)]">{shot.name}</div>
                  </td>
                  <td className="px-3 py-3 text-[var(--muted)]">
                    <span className="mr-1.5">{shot.country.flag}</span>
                    <span className="font-medium text-[var(--text)]">{shot.country.name}</span>
                    <span className="mx-1 text-[rgba(255,255,255,0.24)]">·</span>
                    {shot.loc}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold"
                      style={{ borderColor: `${timeMeta.color}44`, color: timeMeta.color, background: `${timeMeta.color}12` }}
                    >
                      <span>{timeMeta.icon}</span>
                      <span>{timeMeta.label}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-[var(--text)]">{durLabel[shot.dur]}</td>
                  <td className="px-3 py-3">
                    <span
                      className="inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold"
                      style={{ borderColor: `${shot.type.color}44`, color: shot.type.color, background: `rgba(${shot.type.rgb},0.08)` }}
                    >
                      {shot.type.label}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-[var(--text)]">{shot.props || '-'}</td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => removeShot(shot.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-soft)] transition-all hover:bg-[rgba(255,168,168,0.08)] hover:text-[var(--danger)]"
                      type="button"
                      aria-label="刪除場景"
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
