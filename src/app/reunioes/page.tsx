'use client'

import { useEffect, useState, useCallback } from 'react'
import { fetchLeads, fetchReunioes, createReuniao, updateReuniao, deleteReuniao, updateLead, Lead, Reuniao } from '@/lib/supabase'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn } from '@/lib/utils'
import { Plus, X, ChevronLeft, ChevronRight, CalendarDays, Clock, Edit2, Trash2, CheckCircle } from 'lucide-react'

type View = 'month' | 'week'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DAYS_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

const STATUS_COLORS = {
  agendada: '#28B0FE',
  realizada: '#10B981',
  cancelada: '#EF4444',
  remarcada: '#F59E0B',
}
const STATUS_LABELS = {
  agendada: 'Agendada',
  realizada: 'Realizada',
  cancelada: 'Cancelada',
  remarcada: 'Remarcada',
}

export default function ReunioesPage() {
  const [reunioes, setReunioes] = useState<Reuniao[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('month')
  const [today] = useState(new Date())
  const [cursor, setCursor] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Reuniao | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [form, setForm] = useState({
    lead_id: '', data: '', hora: '', observacoes: '', status: 'agendada' as Reuniao['status'],
  })

  const load = useCallback(async () => {
    setLoading(true)
    const [r, l] = await Promise.all([fetchReunioes(), fetchLeads()])
    setReunioes(r); setLeads(l); setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openNew() {
    setEditing(null)
    setForm({ lead_id: '', data: today.toISOString().split('T')[0], hora: '10:00', observacoes: '', status: 'agendada' })
    setShowModal(true)
  }

  function openEdit(r: Reuniao) {
    setEditing(r)
    setForm({ lead_id: r.lead_id, data: r.data, hora: r.hora, observacoes: r.observacoes || '', status: r.status })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.lead_id || !form.data || !form.hora) return
    setSaving(true)
    try {
      if (editing) {
        await updateReuniao(editing.id, form)
      } else {
        await createReuniao(form)
        // Auto-move lead to "Reunião Marcada" in pipeline
        await updateLead(form.lead_id, { pipeline_stage: 'Reunião Marcada' })
      }
      setShowModal(false); await load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Cancelar esta reunião?')) return
    await deleteReuniao(id); await load()
  }

  async function handleStatus(id: string, status: Reuniao['status']) {
    await updateReuniao(id, { status }); await load()
  }

  // ── Calendar helpers ──────────────────────────────
  function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
  function getFirstDay(y: number, m: number) { return new Date(y, m, 1).getDay() }

  const y = cursor.getFullYear(), m = cursor.getMonth()
  const daysInMonth = getDaysInMonth(y, m)
  const firstDay = getFirstDay(y, m)

  function prevMonth() { setCursor(new Date(y, m - 1)) }
  function nextMonth() { setCursor(new Date(y, m + 1)) }
  function prevWeek()  { const d = new Date(cursor); d.setDate(d.getDate() - 7); setCursor(d) }
  function nextWeek()  { const d = new Date(cursor); d.setDate(d.getDate() + 7); setCursor(d) }

  function reunioesOnDay(day: number) {
    const dateStr = `${y}-${String(m + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return reunioes.filter((r) => r.data === dateStr)
  }

  function getWeekDays() {
    const dow = cursor.getDay()
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(cursor); d.setDate(d.getDate() - dow + i); return d
    })
  }

  const weekDays = getWeekDays()

  const upcomingReunioes = reunioes
    .filter((r) => r.status === 'agendada' && r.data >= today.toISOString().split('T')[0])
    .slice(0, 5)

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="Calendário de Reuniões" subtitle={`${reunioes.length} reuniões registradas`}>
        <div className="flex items-center gap-2 bg-white border border-[#E8E8E6] rounded-2xl p-1">
          {(['month','week'] as View[]).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={cn('px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                view === v ? 'bg-[#2F2F2F] text-white' : 'text-ink-muted hover:text-ink')}>
              {v === 'month' ? 'Mensal' : 'Semanal'}
            </button>
          ))}
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Reunião
        </button>
      </PageHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-[1fr_280px] gap-5 h-full">

          {/* ── CALENDAR ── */}
          <div className="card-base p-5 flex flex-col">
            {/* Nav */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-ink font-display">
                {view === 'month'
                  ? `${MONTHS[m]} ${y}`
                  : `${weekDays[0].getDate()} – ${weekDays[6].getDate()} ${MONTHS[weekDays[0].getMonth()]} ${y}`}
              </h2>
              <div className="flex gap-1">
                <button onClick={view === 'month' ? prevMonth : prevWeek}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F4F4F2] text-ink-muted hover:text-ink transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setCursor(new Date())}
                  className="px-3 h-8 text-xs font-medium rounded-xl hover:bg-[#F4F4F2] text-ink-muted hover:text-ink transition-all">
                  Hoje
                </button>
                <button onClick={view === 'month' ? nextMonth : nextWeek}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F4F4F2] text-ink-muted hover:text-ink transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS_SHORT.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-ink-muted uppercase tracking-wide py-2">{d}</div>
              ))}
            </div>

            {view === 'month' ? (
              <div className="grid grid-cols-7 gap-1 flex-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const dayReunioes = reunioesOnDay(day)
                  const isToday = today.getDate() === day && today.getMonth() === m && today.getFullYear() === y
                  return (
                    <div key={day} onClick={() => { setForm(f => ({ ...f, data: `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` })); openNew() }}
                      className={cn(
                        'min-h-[72px] rounded-xl p-1.5 cursor-pointer transition-all border group',
                        isToday ? 'border-accent bg-accent/5' : 'border-transparent hover:border-[#E8E8E6] hover:bg-[#F9F9F7]'
                      )}>
                      <span className={cn(
                        'text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1',
                        isToday ? 'bg-accent text-white' : 'text-ink group-hover:text-accent'
                      )}>{day}</span>
                      <div className="space-y-0.5">
                        {dayReunioes.slice(0,2).map((r) => (
                          <div key={r.id} className="text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium text-white"
                            style={{ background: STATUS_COLORS[r.status] }}
                            onClick={(e) => { e.stopPropagation(); openEdit(r) }}>
                            {r.hora} {r.lead_nome || '—'}
                          </div>
                        ))}
                        {dayReunioes.length > 2 && (
                          <div className="text-[10px] text-ink-muted px-1">+{dayReunioes.length - 2}</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* Week view */
              <div className="grid grid-cols-7 gap-2 flex-1">
                {weekDays.map((day) => {
                  const dateStr = day.toISOString().split('T')[0]
                  const dayRs = reunioes.filter((r) => r.data === dateStr)
                  const isToday = day.toDateString() === today.toDateString()
                  return (
                    <div key={dateStr} className={cn('rounded-xl p-2 border min-h-[200px]',
                      isToday ? 'border-accent/30 bg-accent/5' : 'border-[#F0F0EE] bg-[#FAFAFA]')}>
                      <div className={cn('text-xs font-bold mb-2 w-6 h-6 flex items-center justify-center rounded-full',
                        isToday ? 'bg-accent text-white' : 'text-ink')}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayRs.map((r) => (
                          <div key={r.id} className="text-[10px] px-1.5 py-1 rounded-md text-white cursor-pointer"
                            style={{ background: STATUS_COLORS[r.status] }}
                            onClick={() => openEdit(r)}>
                            <div className="font-bold">{r.hora}</div>
                            <div className="truncate">{r.lead_nome}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── SIDEBAR: upcoming + all ── */}
          <div className="space-y-4">
            <div className="card-base p-4">
              <h3 className="text-sm font-semibold text-ink font-display mb-3">Próximas Reuniões</h3>
              {loading ? (
                <div className="flex items-center justify-center h-20">
                  <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : upcomingReunioes.length === 0 ? (
                <p className="text-xs text-ink-muted text-center py-4">Nenhuma reunião futura</p>
              ) : (
                <div className="space-y-2">
                  {upcomingReunioes.map((r) => (
                    <div key={r.id} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#F4F4F2] group cursor-pointer" onClick={() => openEdit(r)}>
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: STATUS_COLORS[r.status] }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-ink truncate">{r.lead_nome || leads.find(l=>l.id===r.lead_id)?.nome || '—'}</p>
                        <p className="text-[10px] text-ink-muted">{new Date(r.data+'T12:00').toLocaleDateString('pt-BR')} · {r.hora}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleStatus(r.id, 'realizada') }}
                        className="opacity-0 group-hover:opacity-100 text-emerald-500 hover:text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card-base p-4">
              <h3 className="text-sm font-semibold text-ink font-display mb-3">Todas as Reuniões</h3>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {reunioes.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#F4F4F2] group">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ink truncate">{r.lead_nome}</p>
                      <p className="text-[10px] text-ink-muted">{new Date(r.data+'T12:00').toLocaleDateString('pt-BR')} {r.hora}</p>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white flex-shrink-0"
                      style={{ background: STATUS_COLORS[r.status] }}>
                      {STATUS_LABELS[r.status]}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      <button onClick={() => openEdit(r)} className="text-ink-muted hover:text-ink">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="text-ink-muted hover:text-red-500">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {reunioes.length === 0 && !loading && (
                  <p className="text-xs text-ink-muted text-center py-4">Nenhuma reunião</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#F0F0EE]">
              <h3 className="text-base font-bold text-ink font-display">
                {editing ? 'Editar Reunião' : 'Nova Reunião'}
              </h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F4F4F2] text-ink-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">Lead *</label>
                <select value={form.lead_id} onChange={(e) => setForm(f => ({ ...f, lead_id: e.target.value }))}
                  className="input-base">
                  <option value="">Selecionar lead...</option>
                  {leads.map((l) => <option key={l.id} value={l.id}>{l.nome} — {l.empresa}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">Data *</label>
                  <input type="date" value={form.data} onChange={(e) => setForm(f => ({ ...f, data: e.target.value }))}
                    className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">Hora *</label>
                  <input type="time" value={form.hora} onChange={(e) => setForm(f => ({ ...f, hora: e.target.value }))}
                    className="input-base" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as any }))}
                  className="input-base">
                  <option value="agendada">Agendada</option>
                  <option value="realizada">Realizada</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="remarcada">Remarcada</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">Observações</label>
                <textarea value={form.observacoes} onChange={(e) => setForm(f => ({ ...f, observacoes: e.target.value }))}
                  className="input-base resize-none" rows={3} placeholder="Pauta, local, link de reunião..." />
              </div>
            </div>
            <div className="flex items-center justify-between p-6 border-t border-[#F0F0EE]">
              {editing && (
                <button onClick={() => handleDelete(editing.id)} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> Excluir
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button onClick={() => setShowModal(false)} className="btn-ghost">Cancelar</button>
                <button onClick={handleSave} disabled={saving || !form.lead_id || !form.data || !form.hora}
                  className="btn-primary flex items-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {editing ? 'Salvar' : 'Agendar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
