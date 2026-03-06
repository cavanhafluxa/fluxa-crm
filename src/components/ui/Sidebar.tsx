'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Kanban, Users, Settings, Zap, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { href: '/leads', icon: Users, label: 'Leads' },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-[64px] bg-[#2F2F2F] flex flex-col items-center py-5 gap-2 shrink-0">
      {/* Logo */}
      <div className="mb-5">
        <div className="w-9 h-9 rounded-2xl bg-accent flex items-center justify-center">
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
                'flex items-center justify-center w-full h-10 rounded-2xl transition-all duration-150 group relative',
                active
                  ? 'bg-white text-[#2F2F2F]'
                  : 'text-white/40 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.5 : 1.8} />
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#2F2F2F] border border-white/10 rounded-xl text-xs text-white font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                {label}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="flex flex-col gap-1 w-full px-3">
        <button title="Notificações" className="flex items-center justify-center w-full h-10 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
          <Bell className="w-[18px] h-[18px]" strokeWidth={1.8} />
        </button>
        <button title="Configurações" className="flex items-center justify-center w-full h-10 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
          <Settings className="w-[18px] h-[18px]" strokeWidth={1.8} />
        </button>
        <div className="mt-2 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-xs text-white font-semibold cursor-pointer">
            A
          </div>
        </div>
      </div>
    </aside>
  )
}
