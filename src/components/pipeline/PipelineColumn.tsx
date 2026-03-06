'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Lead, PipelineStage, STAGE_COLORS } from '@/lib/supabase'
import { PipelineCard } from './PipelineCard'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PipelineColumnProps {
  stage: PipelineStage
  leads: Lead[]
  onLeadClick: (lead: Lead) => void
}

export function PipelineColumn({ stage, leads, onLeadClick }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const color = STAGE_COLORS[stage]
  const total = leads.reduce((s, l) => s + (l.valor_estimado || 0), 0)

  return (
    <div className="flex flex-col w-[268px] shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <h3 className="text-sm font-semibold text-ink">{stage}</h3>
          <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-ink-soft">
            {leads.length}
          </span>
        </div>
        {leads.length > 0 && (
          <span className="text-xs text-ink-muted font-medium">{formatCurrency(total)}</span>
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 kanban-scroll rounded-2xl min-h-[120px] p-2 transition-all duration-150',
          isOver ? 'bg-primary/5 ring-2 ring-primary/20' : 'bg-gray-100/50'
        )}
      >
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {leads.map((lead) => (
              <PipelineCard key={lead.id} lead={lead} onClick={onLeadClick} />
            ))}
          </div>
        </SortableContext>

        {leads.length === 0 && (
          <div className={cn(
            'flex items-center justify-center h-20 rounded-xl border-2 border-dashed transition-colors',
            isOver ? 'border-primary/40 bg-primary/5' : 'border-gray-200'
          )}>
            <p className="text-xs text-ink-muted">Arraste aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}
