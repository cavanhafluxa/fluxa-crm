'use client'

import { useState } from 'react'
import { X, Phone, Mail, Building2, Briefcase, DollarSign, Calendar, FileText, Edit3, Check } from 'lucide-react'
import { Lead, updateLead, STAGE_COLORS } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'

interface LeadModalProps {
  lead: Lead
  onClose: () => void
  onUpdate: (lead: Lead) => void
}

export function LeadModal({ lead, onClose, onUpdate }: LeadModalProps) {
  const [editing, setEditing] = useState(false)
  const [notas, setNotas] = useState(lead.notas || '')
  const [saving, setSaving] = useState(false)

  async function saveNotas() {
    setSaving(true)
    try {
      await updateLead(lead.id, { notas })
      onUpdate({ ...lead, notas })
      setEditing(false)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const stageColor = STAGE_COLORS[lead.pipeline_stage]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#2F2F2F]/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-4xl shadow-modal w-full max-w-md animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color bar */}
        <div className="h-1 w-full" style={{ background: stageColor }} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <Avatar name={lead.nome} size="lg" />
              <div>
                <h2 className="text-lg font-bold text-ink font-display">{lead.nome}</h2>
                <p className="text-sm text-ink-muted">{lead.cargo} · {lead.empresa}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-2xl hover:bg-[#F4F4F2] flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-ink-muted" />
            </button>
          </div>

          {/* Stage badge */}
          <div className="flex items-center gap-2 mb-5">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: `${stageColor}15`, color: stageColor }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: stageColor }} />
              {lead.pipeline_stage}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#F4F4F2] text-ink-soft capitalize">
              {lead.status}
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <InfoItem icon={<Phone className="w-3.5 h-3.5" />} label="Telefone" value={lead.telefone} />
            <InfoItem icon={<Mail className="w-3.5 h-3.5" />} label="E-mail" value={lead.email} />
            <InfoItem icon={<Building2 className="w-3.5 h-3.5" />} label="Empresa" value={lead.empresa} />
            <InfoItem icon={<Briefcase className="w-3.5 h-3.5" />} label="Cargo" value={lead.cargo} />
            <InfoItem icon={<DollarSign className="w-3.5 h-3.5" />} label="Valor Estimado" value={formatCurrency(lead.valor_estimado)} highlight />
            <InfoItem icon={<Calendar className="w-3.5 h-3.5" />} label="Criado em" value={formatDate(lead.created_at)} />
          </div>

          {/* Notes */}
          <div className="bg-[#F4F4F2] rounded-3xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink font-display">
                <FileText className="w-4 h-4 text-accent" />
                Notas
              </div>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="text-xs text-accent hover:text-accent-dark font-medium flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Editar
                </button>
              ) : (
                <button onClick={saveNotas} disabled={saving} className="text-xs text-accent font-medium flex items-center gap-1 disabled:opacity-50">
                  <Check className="w-3 h-3" /> {saving ? 'Salvando...' : 'Salvar'}
                </button>
              )}
            </div>
            {editing ? (
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                className="w-full text-sm text-ink bg-white rounded-2xl p-3 border border-[#E8E8E6] focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                placeholder="Adicione notas sobre este lead..."
                autoFocus
              />
            ) : (
              <p className="text-sm text-ink-soft leading-relaxed">
                {notas || <span className="italic text-ink-muted">Sem notas.</span>}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-[#F4F4F2] rounded-2xl p-3">
      <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-1">
        <span className="text-accent">{icon}</span>
        {label}
      </div>
      <p className={`text-sm font-semibold truncate ${highlight ? 'text-accent' : 'text-ink'}`}>{value || '—'}</p>
    </div>
  )
}
