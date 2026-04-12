'use client'
import { useStore } from '@/lib/store'
import { TOD_META, TOD_ORDER, DURATIONS } from '@/lib/constants'

const durLabel = Object.fromEntries(DURATIONS.map((d) => [d.value, d.label]))

export default function ShotsTable() {
  const shots = useStore((s) => s.shots)
  const removeShot = useStore((s) => s.removeShot)

  if (!shots.length) {
    return (
      <div className="py-10 text-center text-sm text-white/25">
        未有場景，請加入拍攝計劃
      </div>
    )
  }

  const sorted = [...shots].sort(
    (a, b) => a.day - b.day || (TOD_ORDER[a.tod] ?? 9) - (TOD_ORDER[b.tod] ?? 9)
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            {['#', '日', '片段名稱', '地點', '時段', '時長', '平台', '道具', ''].map((h, i) => (
              <th
                key={i}
                className="border-b border-white/7 px-3 py-2 text-left font-mono text-[10px] tracking-widest text-white/30"
                style={{ width: ['28px','40px','18%','20%','13%','8%','12%','14%','28px'][i] }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => {
            const tm = TOD_META[s.tod]
            return (
              <tr key={s.id} className="group hover:bg-white/2">
                <td className="px-3 py-2.5 font-mono text-[10px] text-white/25">{String(i + 1).padStart(2, '0')}</td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-amber-300">D{s.day + 1}</td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap px-3 py-2.5 font-medium">{s.name}</td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap px-3 py-2.5">
                  <span className="mr-1">{s.country.flag}</span>
                  <span className="text-[10px] text-white/35">{s.country.name}·</span>
                  {s.loc}
                </td>
                <td className="px-3 py-2.5">
                  <span className="mr-1">{tm.icon}</span>
                  <span className="text-[11px]" style={{ color: tm.color }}>{tm.label}</span>
                </td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-white/45">{durLabel[s.dur]}</td>
                <td className="px-3 py-2.5">
                  <span
                    className="rounded-full border px-2 py-0.5 font-mono text-[10px]"
                    style={{ borderColor: s.type.color, color: s.type.color, background: `rgba(${s.type.rgb},0.1)` }}
                  >
                    {s.type.label}
                  </span>
                </td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap px-3 py-2.5 text-[11px] text-white/35">{s.props || '—'}</td>
                <td className="px-3 py-2.5">
                  <button
                    onClick={() => removeShot(s.id)}
                    className="rounded px-1.5 text-[13px] text-white/18 transition-all hover:bg-red-500/10 hover:text-red-400"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
