'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Lead, PipelineStage, STAGE_COLORS } from '@/lib/supabase'
import { PipelineCard } from './PipelineCard'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

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
    <div className="flex flex-col w-[280px] shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <h3 className="text-sm font-semibold text-ink font-display">{stage}</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white border border-[#E8E8E6] text-ink-muted">
            {leads.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {leads.length > 0 && (
            <span className="text-xs text-ink-muted font-medium">{formatCurrency(total)}</span>
          )}
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 rounded-3xl min-h-[100px] p-2.5 transition-all duration-200 overflow-y-auto max-h-[calc(100vh-160px)]',
          isOver
            ? 'bg-accent/8 ring-2 ring-accent/25'
            : 'bg-[#EFEFED]'
        )}
      >
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2.5">
            {leads.map((lead, i) => (
              <PipelineCard
                key={lead.id}
                lead={lead}
                onClick={onLeadClick}
                isFirst={i === 0 && leads.length > 1}
              />
            ))}
          </div>
        </SortableContext>

        {leads.length === 0 && (
          <div className={cn(
            'flex items-center justify-center h-20 rounded-2xl border-2 border-dashed transition-colors',
            isOver ? 'border-accent/40 bg-accent/5' : 'border-[#D8D8D6]'
          )}>
            <p className="text-xs text-ink-muted">Arraste aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}
