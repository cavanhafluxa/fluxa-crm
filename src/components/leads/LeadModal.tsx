'use client'

import { useState } from 'react'
import { X, Phone, Mail, Building2, Briefcase, DollarSign, Calendar, FileText, Edit3, Check } from 'lucide-react'
import { Lead, updateLead, PIPELINE_STAGES, STAGE_COLORS } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { StageBadge, StatusBadge } from '@/components/ui/Badge'

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-modal w-full max-w-lg animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient accent */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-cobalt to-primary" />

        <div className="p-6">
          {/* Top row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar name={lead.nome} size="lg" />
              <div>
                <h2 className="text-lg font-semibold text-ink">{lead.nome}</h2>
                <p className="text-sm text-ink-soft">{lead.cargo} · {lead.empresa}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-ink-soft" />
            </button>
          </div>

          {/* Stage + Status */}
          <div className="flex items-center gap-2 mb-5">
            <StageBadge stage={lead.pipeline_stage} />
            <StatusBadge status={lead.status} />
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <InfoItem icon={<Phone className="w-4 h-4" />} label="Telefone" value={lead.telefone} />
            <InfoItem icon={<Mail className="w-4 h-4" />} label="E-mail" value={lead.email} />
            <InfoItem icon={<Building2 className="w-4 h-4" />} label="Empresa" value={lead.empresa} />
            <InfoItem icon={<Briefcase className="w-4 h-4" />} label="Cargo" value={lead.cargo} />
            <InfoItem
              icon={<DollarSign className="w-4 h-4" />}
              label="Valor Estimado"
              value={formatCurrency(lead.valor_estimado)}
              highlight
            />
            <InfoItem
              icon={<Calendar className="w-4 h-4" />}
              label="Criado em"
              value={formatDate(lead.created_at)}
            />
          </div>

          {/* Notes */}
          <div className="border border-gray-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-ink">
                <FileText className="w-4 h-4 text-primary" />
                Notas
              </div>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="text-xs text-primary hover:text-cobalt font-medium flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Editar
                </button>
              ) : (
                <button onClick={saveNotas} disabled={saving} className="text-xs text-primary hover:text-cobalt font-medium flex items-center gap-1 disabled:opacity-50">
                  <Check className="w-3 h-3" /> {saving ? 'Salvando...' : 'Salvar'}
                </button>
              )}
            </div>
            {editing ? (
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                className="w-full text-sm text-ink bg-gray-50 rounded-xl p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                placeholder="Adicione notas sobre este lead..."
                autoFocus
              />
            ) : (
              <p className="text-sm text-ink-soft leading-relaxed">
                {notas || <span className="italic text-ink-muted">Nenhuma nota adicionada.</span>}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value, highlight }: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-1">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className={`text-sm font-medium truncate ${highlight ? 'text-primary' : 'text-ink'}`}>
        {value || '—'}
      </p>
    </div>
  )
}
