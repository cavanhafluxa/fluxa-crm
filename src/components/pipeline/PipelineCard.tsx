'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Phone, Building2, DollarSign, Calendar, GripVertical } from 'lucide-react'
import { Lead } from '@/lib/supabase'
import { formatCurrency, formatShortDate, getInitials } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

interface PipelineCardProps {
  lead: Lead
  onClick: (lead: Lead) => void
  isDragOverlay?: boolean
}

export function PipelineCard({ lead, onClick, isDragOverlay }: PipelineCardProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-card card-transition cursor-pointer group',
        isDragging && 'opacity-40 scale-95',
        isDragOverlay && 'drag-overlay shadow-modal rotate-1'
      )}
    >
      {/* Drag handle */}
      <div className="flex items-start gap-2 p-3 pb-0">
        <div
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all cursor-grab active:cursor-grabbing touch-none"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3.5 h-3.5 text-ink-muted" />
        </div>
        <div className="flex-1 min-w-0" onClick={() => onClick(lead)}>
          <div className="flex items-center gap-2 mb-2">
            <Avatar name={lead.nome} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">{lead.nome}</p>
              <p className="text-xs text-ink-muted truncate">{lead.cargo}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 ml-7" onClick={() => onClick(lead)}>
        {/* Empresa */}
        <div className="flex items-center gap-1.5 text-xs text-ink-soft mb-2">
          <Building2 className="w-3 h-3 text-ink-muted shrink-0" />
          <span className="truncate">{lead.empresa}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-1.5 text-xs text-ink-soft mb-3">
          <Phone className="w-3 h-3 text-ink-muted shrink-0" />
          <span>{lead.telefone}</span>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-primary/10 text-primary rounded-lg px-2 py-1">
            <DollarSign className="w-3 h-3" />
            <span className="text-xs font-semibold">{formatCurrency(lead.valor_estimado)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-ink-muted">
            <Calendar className="w-3 h-3" />
            {formatShortDate(lead.created_at)}
          </div>
        </div>
      </div>
    </div>
  )
}
