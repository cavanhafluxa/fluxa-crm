import { cn } from '@/lib/utils'
import { PipelineStage, STAGE_COLORS } from '@/lib/supabase'

interface BadgeProps {
  stage: PipelineStage
  className?: string
}

export function StageBadge({ stage, className }: BadgeProps) {
  const color = STAGE_COLORS[stage]
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', className)}
      style={{ background: `${color}18`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {stage}
    </span>
  )
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const map: Record<string, { bg: string; text: string }> = {
    'ativo': { bg: '#10B98118', text: '#10B981' },
    'inativo': { bg: '#6B728018', text: '#6B7280' },
    'quente': { bg: '#EF444418', text: '#EF4444' },
    'frio': { bg: '#3B82F618', text: '#3B82F6' },
  }
  const style = map[status?.toLowerCase()] || { bg: '#6B728018', text: '#6B7280' }
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize', className)}
      style={{ background: style.bg, color: style.text }}
    >
      {status}
    </span>
  )
}
