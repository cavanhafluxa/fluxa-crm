import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

const GRADIENTS = [
  'from-[#28B0FE] to-[#166FCA]',
  'from-[#2F2F2F] to-[#555555]',
  'from-[#C8F135] to-[#8fb800] text-[#2F2F2F]',
  'from-[#F59E0B] to-[#D97706]',
  'from-[#10B981] to-[#059669]',
]

function getGradient(name: string) {
  return GRADIENTS[name.charCodeAt(0) % GRADIENTS.length]
}

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }
  return (
    <div className={cn(
      'rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold shrink-0',
      sizes[size],
      getGradient(name),
      className
    )}>
      {getInitials(name)}
    </div>
  )
}
