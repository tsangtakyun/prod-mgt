'use client'
import { useState, useRef, useEffect } from 'react'
import { COUNTRIES } from '@/lib/constants'
import type { Country } from '@/types'

interface Props {
  value: Country | null
  onChange: (c: Country) => void
}

export default function CountrySelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const filtered = search
    ? COUNTRIES.filter((c) => c.name.includes(search) || c.code.toLowerCase().includes(search.toLowerCase()))
    : COUNTRIES

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-full items-center gap-2 rounded-md border border-white/8 bg-[#1c1c1c] px-3 text-sm transition-colors hover:border-white/20"
      >
        <span className="text-base leading-none">{value?.flag ?? '🌍'}</span>
        <span className="flex-1 text-left text-xs text-white/50">{value?.name ?? '選擇國家'}</span>
        <span className="text-[9px] text-white/25">▼</span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-56 overflow-hidden rounded-lg border border-white/12 bg-[#1e1e1e] shadow-2xl">
          <div className="border-b border-white/8 p-2">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋國家..."
              className="w-full rounded bg-[#161616] px-2 py-1 text-xs text-white outline-none placeholder-white/25"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => { onChange(c); setOpen(false); setSearch('') }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white/65 transition-colors hover:bg-white/6"
              >
                <span className="text-sm">{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
