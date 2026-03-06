'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Kanban, Users, Settings, CalendarDays, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

const nav = [
  { href: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pipeline',    icon: Kanban,           label: 'Pipeline' },
  { href: '/leads',       icon: Users,            label: 'Leads' },
  { href: '/reunioes',    icon: CalendarDays,     label: 'Reuniões' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const initials = user?.user_metadata?.name
    ? user.user_metadata.name.split(' ').map((n: string) => n[0]).slice(0,2).join('').toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <aside className="w-[64px] bg-[#2F2F2F] flex flex-col items-center py-5 gap-2 shrink-0">
      {/* Logo — isotipo only */}
      <Link href="/dashboard" className="mb-5 w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center block">
        <img src="/logof.png" alt="Flüxa" className="w-full h-full object-contain" />
      </Link>

      {/* Main nav */}
      <div className="flex flex-col gap-1 w-full px-3 flex-1">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href} title={label}
              className={cn(
                'flex items-center justify-center w-full h-10 rounded-2xl transition-all duration-150 group relative',
                active ? 'bg-white text-[#2F2F2F]' : 'text-white/40 hover:text-white hover:bg-white/10'
              )}>
              <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.5 : 1.8} />
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#2F2F2F] border border-white/10 rounded-xl text-xs text-white font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                {label}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-1 w-full px-3">
        <Link href="/configuracoes" title="Configurações"
          className={cn(
            'flex items-center justify-center w-full h-10 rounded-2xl transition-all duration-150 group relative',
            pathname.startsWith('/configuracoes') ? 'bg-white text-[#2F2F2F]' : 'text-white/40 hover:text-white hover:bg-white/10'
          )}>
          <Settings className="w-[18px] h-[18px]" strokeWidth={1.8} />
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#2F2F2F] border border-white/10 rounded-xl text-xs text-white font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
            Configurações
          </div>
        </Link>
        <button title="Sair" onClick={handleLogout}
          className="flex items-center justify-center w-full h-10 rounded-2xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all group relative">
          <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#2F2F2F] border border-white/10 rounded-xl text-xs text-white font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
            Sair
          </div>
        </button>
        <div className="mt-2 flex items-center justify-center">
          <Link href="/configuracoes"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-xs text-white font-semibold cursor-pointer">
            {initials}
          </Link>
        </div>
      </div>
    </aside>
  )
}
