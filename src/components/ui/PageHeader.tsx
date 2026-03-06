'use client'

import { Search } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  search?: string
  onSearch?: (val: string) => void
  searchPlaceholder?: string
}

export function PageHeader({ title, subtitle, children, search, onSearch, searchPlaceholder }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-[#E8E8E6] bg-[#F4F4F2] sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-semibold text-ink font-display tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {onSearch && (
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder || 'Buscar...'}
              className="input-base pl-10 w-64"
            />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
