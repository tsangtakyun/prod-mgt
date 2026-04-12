'use client'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function AnalysisView() {
  const shots = useStore((s) => s.shots)
  const trip = useStore((s) => s.trip)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function analyze() {
    if (!shots.length || !trip) return
    setLoading(true)
    setDone(false)
    setText('')

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shots, trip }),
    })

    if (!res.body) { setLoading(false); return }

    const reader = res.body.getReader()
    const dec = new TextDecoder()

    while (true) {
      const { done: d, value } = await reader.read()
      if (d) break
      setText((prev) => prev + dec.decode(value, { stream: true }))
    }

    setLoading(false)
    setDone(true)
  }

  return (
    <div className="p-5">
      <div className="mb-5 grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="workspace-card px-5 py-5">
          <div className="section-label mono-label">ai command center</div>
          <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-800">Production Insights</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            幫你快速睇清行程衝突、時間壓力、跨國移動同拍攝節奏，似 monday 嘅 summary panel 咁一頁讀晒。
          </p>

          <div className="mt-5 space-y-3">
            <div className="workspace-card-soft px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Scenes</div>
              <div className="mt-1 text-2xl font-bold text-[var(--primary)]">{shots.length}</div>
            </div>
            <button
              onClick={analyze}
              disabled={loading || !shots.length}
              className="primary-btn inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? '分析中...' : 'Run AI Analysis'}
            </button>
          </div>
        </div>

        <div className="workspace-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[var(--line)] bg-slate-50 px-5 py-4">
            <span className={`inline-flex h-2.5 w-2.5 rounded-full ${loading ? 'animate-pulse bg-[var(--warning)]' : 'bg-[var(--success)]'}`} />
            <span className="text-sm font-semibold text-slate-700">
              {loading ? 'AI 分析中…' : done ? 'AI 分析完成' : '等待分析'}
            </span>
          </div>

          <div className="min-h-[360px] px-5 py-5">
            {!done && !loading && (
              <div className="flex h-full min-h-[300px] items-center justify-center text-center text-sm text-slate-400">
                {shots.length ? '按左邊按鈕開始 AI 分析' : '請先加入場景'}
              </div>
            )}

            {(loading || done) && (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
                {text}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
