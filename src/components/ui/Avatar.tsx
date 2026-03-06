import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

const COLORS = [
  'from-[#28B0FE] to-[#166FCA]',
  'from-[#6366F1] to-[#4F46E5]',
  'from-[#F59E0B] to-[#D97706]',
  'from-[#10B981] to-[#059669]',
  'from-[#EC4899] to-[#DB2777]',
]

function getColor(name: string) {
  const idx = name.charCodeAt(0) % COLORS.length
  return COLORS[idx]
}

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }
  return (
    <div className={cn(
      'rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold shrink-0',
      sizes[size],
      getColor(name),
      className
    )}>
      {getInitials(name)}
    </div>
  )
}
