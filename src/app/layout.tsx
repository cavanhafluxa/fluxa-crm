import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/ui/Sidebar'

export const metadata: Metadata = {
  title: 'Flüxa CRM',
  description: 'Modern SaaS CRM for Flüxa',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-bg-light font-sans">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
