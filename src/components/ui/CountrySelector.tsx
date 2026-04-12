'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
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
        className="flex h-[46px] w-full items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 text-sm transition-colors hover:border-[var(--line-strong)]"
      >
        <span className="text-base leading-none">{value?.flag ?? '🌍'}</span>
        <span className="flex-1 text-left text-sm text-slate-600">{value?.name ?? '選擇國家'}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-64 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          <div className="border-b border-[var(--line)] p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜尋國家..."
                className="input pl-9"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => { onChange(c); setOpen(false); setSearch('') }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
              >
                <span className="text-base">{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
