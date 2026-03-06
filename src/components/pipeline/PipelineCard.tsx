'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Phone, DollarSign, ArrowUpRight, Calendar } from 'lucide-react'
import { Lead } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

interface PipelineCardProps {
  lead: Lead
  onClick: (lead: Lead) => void
  isDragOverlay?: boolean
  isFirst?: boolean
}

export function PipelineCard({ lead, onClick, isDragOverlay, isFirst }: PipelineCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const highlighted = isFirst

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(lead)}
      className={cn(
        'rounded-3xl p-4 cursor-grab active:cursor-grabbing transition-all duration-200 select-none',
        highlighted
          ? 'bg-[#2F2F2F] text-white'
          : 'bg-white border border-[#E8E8E6] hover:border-[#28B0FE]/30 hover:shadow-card-hover',
        isDragging && 'opacity-30 scale-95',
        isDragOverlay && 'drag-overlay rotate-1'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={lead.nome} size="sm" />
          <div>
            <p className={cn('text-sm font-semibold leading-tight', highlighted ? 'text-white' : 'text-ink')}>
              {lead.nome}
            </p>
            <p className={cn('text-xs mt-0.5', highlighted ? 'text-white/60' : 'text-ink-muted')}>
              {lead.cargo} · {lead.empresa}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(lead) }}
          className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0',
            highlighted ? 'bg-white/15 hover:bg-white/25' : 'bg-[#F4F4F2] hover:bg-[#E8E8E6]'
          )}
        >
          <ArrowUpRight className={cn('w-3.5 h-3.5', highlighted ? 'text-white' : 'text-ink-muted')} />
        </button>
      </div>

      <div className={cn('h-px mb-3', highlighted ? 'bg-white/10' : 'bg-[#F0F0EE]')} />

      <div className="flex items-center gap-3 mb-3">
        <div className={cn('flex items-center gap-1.5 text-xs', highlighted ? 'text-white/70' : 'text-ink-soft')}>
          <Phone className="w-3 h-3" />
          <span className="truncate max-w-[110px]">{lead.telefone}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className={cn(
          'flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold',
          highlighted ? 'bg-[#C8F135] text-[#2F2F2F]' : 'bg-accent/10 text-accent'
        )}>
          <DollarSign className="w-3 h-3" />
          {formatCurrency(lead.valor_estimado)}
        </div>
        <div className={cn('flex items-center gap-1 text-xs', highlighted ? 'text-white/50' : 'text-ink-muted')}>
          <Calendar className="w-3 h-3" />
          {formatDate(lead.created_at)}
        </div>
      </div>
    </div>
  )
}
