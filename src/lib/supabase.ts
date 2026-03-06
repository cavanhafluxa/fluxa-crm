import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tyjgifzbfjxbigoppkeh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5amdpZnpiZmp4Ymlnb3Bwa2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDE4MDUsImV4cCI6MjA4ODM3NzgwNX0.20Gwxm8DnTiidaekqTd_Ym7VcNzOIRRFE062PCYvttM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Types ──────────────────────────────────────────────
export type Lead = {
  id: string
  nome: string
  telefone: string
  email: string
  empresa: string
  cargo: string
  pipeline_stage: PipelineStage
  status: string
  valor_estimado: number
  created_at: string
  updated_at: string
  notas?: string
}

export type PipelineStage =
  | 'Novo Lead'
  | 'Qualificado'
  | 'Reunião Marcada'
  | 'Orçamento Enviado'
  | 'Follow Up'
  | 'Fechado'
  | 'Perdido'

export type Reuniao = {
  id: string
  lead_id: string
  lead_nome?: string
  data: string        // ISO date
  hora: string        // HH:MM
  observacoes?: string
  status: 'agendada' | 'realizada' | 'cancelada' | 'remarcada'
  created_at: string
}

// ── Constants ──────────────────────────────────────────
export const PIPELINE_STAGES: PipelineStage[] = [
  'Novo Lead', 'Qualificado', 'Reunião Marcada', 'Orçamento Enviado',
  'Follow Up', 'Fechado', 'Perdido',
]

export const STAGE_COLORS: Record<PipelineStage, string> = {
  'Novo Lead':        '#28B0FE',
  'Qualificado':      '#166FCA',
  'Reunião Marcada':  '#6366F1',
  'Orçamento Enviado':'#F59E0B',
  'Follow Up':        '#EC4899',
  'Fechado':          '#10B981',
  'Perdido':          '#6B7280',
}

// ── Lead helpers ───────────────────────────────────────
export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Lead[]
}

export async function updateLeadStage(id: string, stage: PipelineStage): Promise<void> {
  const { error } = await supabase.from('leads')
    .update({ pipeline_stage: stage, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<void> {
  const { error } = await supabase.from('leads')
    .update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

// ── Meeting helpers ────────────────────────────────────
export async function fetchReunioes(): Promise<Reuniao[]> {
  const { data, error } = await supabase
    .from('reunioes').select('*, leads(nome)').order('data').order('hora')
  if (error) {
    // table may not exist yet — return empty gracefully
    console.warn('reunioes table:', error.message)
    return []
  }
  return (data || []).map((r: any) => ({ ...r, lead_nome: r.leads?.nome }))
}

export async function createReuniao(payload: Omit<Reuniao, 'id' | 'created_at' | 'lead_nome'>): Promise<void> {
  const { error } = await supabase.from('reunioes').insert(payload)
  if (error) throw error
}

export async function updateReuniao(id: string, updates: Partial<Reuniao>): Promise<void> {
  const { error } = await supabase.from('reunioes').update(updates).eq('id', id)
  if (error) throw error
}

export async function deleteReuniao(id: string): Promise<void> {
  const { error } = await supabase.from('reunioes').delete().eq('id', id)
  if (error) throw error
}

// ── Auth helpers ───────────────────────────────────────
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}
