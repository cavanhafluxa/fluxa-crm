'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Kanban, Users, Settings, Zap, Bell, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { href: '/leads', icon: Users, label: 'Leads' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[72px] bg-bg-dark flex flex-col items-center py-5 gap-2 shrink-0 border-r border-white/5">
      {/* Logo */}
      <div className="mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-blue">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full px-3 flex-1">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                'relative flex items-center justify-center w-full h-10 rounded-xl transition-all duration-150 group',
                active
                  ? 'bg-primary text-white shadow-blue'
                  : 'text-white/40 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-[18px] h-[18px]" />
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-bg-dark border border-white/10 rounded-lg text-xs text-white font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
                {label}
                <ChevronRight className="inline-block w-3 h-3 ml-1 opacity-50" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col gap-1 w-full px-3">
        <button title="Notificações" className="flex items-center justify-center w-full h-10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
          <Bell className="w-[18px] h-[18px]" />
        </button>
        <button title="Configurações" className="flex items-center justify-center w-full h-10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
          <Settings className="w-[18px] h-[18px]" />
        </button>
        {/* Avatar */}
        <div className="mt-2 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cobalt flex items-center justify-center text-xs text-white font-semibold cursor-pointer ring-2 ring-white/10 hover:ring-primary/50 transition-all">
            A
          </div>
        </div>
      </div>
    </aside>
  )
}
