import { cn } from '@/lib/utils'
import { PipelineStage, STAGE_COLORS } from '@/lib/supabase'

export function StageBadge({ stage, className }: { stage: PipelineStage; className?: string }) {
  const color = STAGE_COLORS[stage]
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', className)}
      style={{ background: `${color}15`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {stage}
    </span>
  )
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    'ativo': { bg: '#10B98115', text: '#10B981' },
    'inativo': { bg: '#9B9B9B15', text: '#9B9B9B' },
    'quente': { bg: '#EF444415', text: '#EF4444' },
    'frio': { bg: '#28B0FE15', text: '#28B0FE' },
  }
  const style = map[status?.toLowerCase()] || { bg: '#9B9B9B15', text: '#9B9B9B' }
  return (
    <span
      className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize', className)}
      style={{ background: style.bg, color: style.text }}
    >
      {status}
    </span>
  )
}
