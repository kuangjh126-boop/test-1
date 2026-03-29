// app/layout.tsx
import './globals.css'; // 导入全局样式，稍后会创建这个文件

export const metadata = {
  title: '我的健身助手',
  description: '16+8 饮食与体脂管理',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
