'use client'

import { usePathname } from 'next/navigation'
import { AuthGuard } from './AuthGuard'
import { Sidebar } from './Sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublic = pathname === '/login'

  if (isPublic) return <>{children}</>

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </AuthGuard>
  )
}
