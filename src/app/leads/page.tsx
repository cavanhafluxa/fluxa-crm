'use client'

import { useEffect, useState } from 'react'
import { fetchLeads, Lead, PIPELINE_STAGES, STAGE_COLORS } from '@/lib/supabase'
import { PageHeader } from '@/components/ui/PageHeader'
import { LeadModal } from '@/components/leads/LeadModal'
import { Avatar } from '@/components/ui/Avatar'
import { StageBadge, StatusBadge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ChevronDown, ArrowUpDown } from 'lucide-react'

type SortField = 'created_at' | 'nome' | 'valor_estimado'
type SortDir = 'asc' | 'desc'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selected, setSelected] = useState<Lead | null>(null)

  async function load() {
    setLoading(true)
    try { const data = await fetchLeads(); setLeads(data) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = leads
    .filter((l) => {
      if (search && !l.nome.toLowerCase().includes(search.toLowerCase()) &&
        !l.empresa.toLowerCase().includes(search.toLowerCase()) &&
        !l.email?.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter && l.status?.toLowerCase() !== statusFilter) return false
      if (stageFilter && l.pipeline_stage !== stageFilter) return false
      return true
    })
    .sort((a, b) => {
      let av: any = a[sortField], bv: any = b[sortField]
      if (sortField === 'created_at') { av = new Date(av).getTime(); bv = new Date(bv).getTime() }
      if (sortField === 'nome') { av = av?.toLowerCase(); bv = bv?.toLowerCase() }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="Leads" subtitle={`${filtered.length} de ${leads.length} leads`}
        search={search} onSearch={setSearch} searchPlaceholder="Buscar nome, empresa ou email...">
        <div className="relative">
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}
            className="input-base pr-8 appearance-none cursor-pointer w-44 text-xs">
            <option value="">Todas as etapas</option>
            {PIPELINE_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted pointer-events-none" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="input-base pr-8 appearance-none cursor-pointer w-36 text-xs">
            <option value="">Todos status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="quente">Quente</option>
            <option value="frio">Frio</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted pointer-events-none" />
        </div>
      </PageHeader>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E8E8E6] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F0F0EE]">
                  <th className="text-left px-5 py-4">
                    <button onClick={() => toggleSort('nome')} className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink uppercase tracking-wide font-display">
                      Lead <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wide font-display">Contato</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wide font-display">Etapa</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wide font-display">Status</th>
                  <th className="text-left px-4 py-4">
                    <button onClick={() => toggleSort('valor_estimado')} className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink uppercase tracking-wide font-display">
                      Valor <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-4">
                    <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink uppercase tracking-wide font-display">
                      Data <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr key={lead.id} onClick={() => setSelected(lead)}
                    className="border-b border-[#F8F8F6] hover:bg-[#F8F8F6] cursor-pointer transition-colors group last:border-0">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={lead.nome} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">{lead.nome}</p>
                          <p className="text-xs text-ink-muted">{lead.cargo} · {lead.empresa}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-ink-soft">{lead.email}</p>
                      <p className="text-xs text-ink-muted">{lead.telefone}</p>
                    </td>
                    <td className="px-4 py-3.5"><StageBadge stage={lead.pipeline_stage} /></td>
                    <td className="px-4 py-3.5"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-accent">{formatCurrency(lead.valor_estimado)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-ink-muted">{formatDate(lead.created_at)}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-16 text-sm text-ink-muted">Nenhum lead encontrado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <LeadModal lead={selected} onClose={() => setSelected(null)}
          onUpdate={(updated) => { setLeads((prev) => prev.map((l) => l.id === updated.id ? updated : l)); setSelected(updated) }} />
      )}
    </div>
  )
}
