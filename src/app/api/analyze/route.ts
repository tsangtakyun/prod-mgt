import { TOD_META, DURATIONS } from '@/lib/constants'
import type { Shot, Trip } from '@/types'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { shots, trip }: { shots: Shot[]; trip: Trip } = await req.json()

  const countries = [...new Set(shots.map((s) => s.country.name))]
  const platforms = [...new Set(shots.map((s) => s.type.label))]
  const durMap = Object.fromEntries(DURATIONS.map((d) => [d.value, d.label]))
  const todOrder: Record<string, number> = {
    dawn: 0, day: 1, golden: 2, dusk: 3, night: 4, flex: 5,
  }

  let byDay = ''
  for (let d = 0; d < trip.days; d++) {
    const dayShots = shots
      .filter((s) => s.day === d)
      .sort((a, b) => todOrder[a.tod] - todOrder[b.tod])
    if (!dayShots.length) continue
    const dateObj = new Date(trip.dates[d])
    byDay += `\n【Day ${d + 1} · ${dateObj.toLocaleDateString('zh-HK', { month: 'long', day: 'numeric', weekday: 'short' })}】\n`
    dayShots.forEach((s, i) => {
      const tm = TOD_META[s.tod]
      byDay += `  ${i + 1}. ${s.name}｜${s.country.name} ${s.loc}｜${tm.label}（${tm.hint}）｜${durMap[s.dur]}｜${s.type.label}｜道具：${s.props || '無'}\n`
    })
  }

  const isIntl = countries.length > 1

  const prompt = `你係一個資深製片經理。以下係「${trip.name}」嘅拍攝計劃：

行程日期：共 ${trip.days} 日
涉及平台：${platforms.join('、')}
涉及國家：${countries.join('、')}${isIntl ? '（跨國拍攝）' : ''}
${byDay}

請用廣東話分析：

**1. 每日詳細時間表**
逐日列出建議時間安排，例如：
Day 1
- 06:00 日出場景：[名稱] @ [地點]（預計 X小時）
- 08:00 返酒店休息/早餐
- 10:00 日光場景：...
注意各時段嘅實際光線時間，黃金時段要緊貼日落時間。夜拍同日光唔好迫埋同一個連續時段。

**2. 路線同移動建議**
每日最省時嘅地點順序，估算移動時間。${isIntl ? '跨國段落估算航班時間（由香港出發）。' : ''}

**3. 器材清單**
整合所有道具，按平台補充建議（IG Reel → 穩定器；Photo Shooting → 燈具；Podcast → 收音設備等）。

**4. 注意事項**
- 各時段光線挑戰同解決方法
- 場地許可、人流控制
${isIntl ? '- 入境要求、設備申報、當地拍攝法規' : ''}

**5. 預算粗估**
${isIntl ? '機票、住宿、地面交通' : '交通費'} + 場地費，按場景數量粗略估算。

實用清晰，逐日列明具體時間。`

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      const reader = resp.body!.getReader()
      const dec = new TextDecoder()
      let buf = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const json = JSON.parse(data)
            if (json.type === 'content_block_delta' && json.delta?.text) {
              controller.enqueue(encoder.encode(json.delta.text))
            }
          } catch {}
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
