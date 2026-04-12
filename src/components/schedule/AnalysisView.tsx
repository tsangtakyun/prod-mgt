'use client'
import { useState } from 'react'
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
    <div className="p-6">
      {!done && !loading && (
        <div className="mb-4 text-center text-sm text-white/25">
          {shots.length ? '按下方按鈕開始 AI 分析' : '請先加入場景'}
        </div>
      )}

      {(loading || done) && (
        <div className="rounded-lg border border-white/8 bg-[#161616] overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
            {loading && (
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-300" />
            )}
            <span className="font-mono text-[11px] tracking-widest text-amber-300">
              {loading ? 'AI 分析中...' : 'AI 分析完成'}
            </span>
          </div>
          <div className="p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/85">
              {text}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={analyze}
          disabled={loading || !shots.length}
          className="rounded-md bg-amber-300 px-5 py-2.5 font-mono text-xs font-medium tracking-wider text-black transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '分析中...' : '▶ AI 分析排程'}
        </button>
      </div>
    </div>
  )
}
