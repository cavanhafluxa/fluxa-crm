'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { fetchLeads, Lead, PipelineStage, PIPELINE_STAGES, updateLeadStage } from '@/lib/supabase'
import { PipelineColumn } from '@/components/pipeline/PipelineColumn'
import { PipelineCard } from '@/components/pipeline/PipelineCard'
import { LeadModal } from '@/components/leads/LeadModal'
import { PageHeader } from '@/components/ui/PageHeader'
import { Filter, RefreshCw } from 'lucide-react'

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [search, setSearch] = useState('')

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  async function load() {
    setLoading(true)
    try {
      const data = await fetchLeads()
      setLeads(data)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = leads.filter((l) =>
    !search ||
    l.nome.toLowerCase().includes(search.toLowerCase()) ||
    l.empresa.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = PIPELINE_STAGES.reduce<Record<PipelineStage, Lead[]>>((acc, stage) => {
    acc[stage] = filtered.filter((l) => l.pipeline_stage === stage)
    return acc
  }, {} as Record<PipelineStage, Lead[]>)

  function handleDragStart(event: DragStartEvent) {
    const lead = leads.find((l) => l.id === event.active.id)
    if (lead) setActiveLead(lead)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return
    const leadId = active.id as string
    const overId = over.id as string
    const newStage = PIPELINE_STAGES.find((s) => s === overId)
    if (newStage) {
      setLeads((prev) =>
        prev.map((l) => l.id === leadId ? { ...l, pipeline_stage: newStage } : l)
      )
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveLead(null)
    if (!over) return
    const leadId = active.id as string
    const overId = over.id as string
    const newStage = PIPELINE_STAGES.find((s) => s === overId)
      || leads.find((l) => l.id === overId)?.pipeline_stage
    if (newStage) {
      const original = leads.find((l) => l.id === leadId)
      if (original?.pipeline_stage !== newStage) {
        setLeads((prev) =>
          prev.map((l) => l.id === leadId ? { ...l, pipeline_stage: newStage } : l)
        )
        try {
          await updateLeadStage(leadId, newStage)
        } catch (e) {
          // Revert on error
          setLeads((prev) =>
            prev.map((l) => l.id === leadId ? { ...l, pipeline_stage: original!.pipeline_stage } : l)
          )
        }
      }
    }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-ink-muted">Carregando pipeline...</p>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col">
      <PageHeader
        title="Pipeline de Vendas"
        subtitle={`${leads.length} leads ativos`}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Buscar lead..."
      >
        <button onClick={load} className="btn-ghost flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
        </button>
      </PageHeader>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 p-6 h-full items-start min-w-max">
            {PIPELINE_STAGES.map((stage) => (
              <PipelineColumn
                key={stage}
                stage={stage}
                leads={grouped[stage]}
                onLeadClick={setSelectedLead}
              />
            ))}
          </div>

          <DragOverlay>
            {activeLead && (
              <PipelineCard lead={activeLead} onClick={() => {}} isDragOverlay />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={(updated) => {
            setLeads((prev) => prev.map((l) => l.id === updated.id ? updated : l))
            setSelectedLead(updated)
          }}
        />
      )}
    </div>
  )
}
