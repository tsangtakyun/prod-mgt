import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PROD / MGT — Production Management System',
  description: '製片拍攝計劃管理系統',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK">
      <body className="antialiased">{children}</body>
    </html>
  )
}
