# PROD / MGT — Production Management System

製片拍攝計劃管理系統，用 AI 自動分析拍攝排程、路線優化同預算估算。

## 功能

- **行程設定** — 設定拍攝行程日期範圍（出發至返回），支援多日 trip
- **場景計劃** — 為每個場景填寫：
  - 拍攝日（第幾日）
  - 拍攝時段（日出 / 日光 / 黃金時段 / 黃昏 / 夜晚 / 彈性）
  - 預計時長
  - 平台類型（IG Reel / YouTube / Photo Shooting / Podcast / TikTok / Event / BTS）
  - 拍攝國家 + 具體地點
  - 所需道具 / 器材
- **排程視圖** — 按日期同時段自動分組顯示
- **AI 分析** — 串流輸出：
  - 每日詳細時間表（考慮光線、時段）
  - 路線優化 + 移動時間估算
  - 器材清單（按平台補充建議）
  - 注意事項（場地許可、入境要求等）
  - 預算粗估

## 快速開始

```bash
# 1. Clone repo
git clone https://github.com/tsangtakyun/prod-mgt.git
cd prod-mgt

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env.local
# 填入你嘅 ANTHROPIC_API_KEY

# 4. 啟動開發伺服器
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 部署到 Vercel

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel

# 記得喺 Vercel Dashboard 加入環境變數：
# ANTHROPIC_API_KEY = your_key
```

## 技術棧

| 技術 | 用途 |
|------|------|
| Next.js 15 | 全端框架 |
| TypeScript | 類型安全 |
| Tailwind CSS | 樣式 |
| Zustand + persist | 全域狀態（localStorage 持久化）|
| Anthropic SDK | AI 串流分析 |
| date-fns | 日期處理 |

## 項目結構

```
src/
├── app/
│   ├── api/analyze/route.ts   # AI 分析 API（Edge Runtime）
│   ├── page.tsx               # 主頁面
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── TripSetupModal.tsx  # 行程設定 Modal
│   │   └── CountrySelector.tsx # 國家選擇器
│   ├── forms/
│   │   └── ShotForm.tsx        # 新增場景表單
│   └── schedule/
│       ├── ShotsTable.tsx      # 場景列表
│       ├── ScheduleView.tsx    # 排程視圖
│       └── AnalysisView.tsx    # AI 分析視圖
├── lib/
│   ├── constants.ts            # 國家、平台、時段常數
│   ├── store.ts                # Zustand store
│   └── utils.ts                # 工具函數
└── types/
    └── index.ts                # TypeScript 類型
```

## 環境變數

| 變數 | 說明 |
|------|------|
| `ANTHROPIC_API_KEY` | Anthropic API Key（必填）|

## License

MIT
