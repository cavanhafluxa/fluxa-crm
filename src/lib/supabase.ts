import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

export const PIPELINE_STAGES: PipelineStage[] = [
  'Novo Lead',
  'Qualificado',
  'Reunião Marcada',
  'Orçamento Enviado',
  'Follow Up',
  'Fechado',
  'Perdido',
]

export const STAGE_COLORS: Record<PipelineStage, string> = {
  'Novo Lead': '#28B0FE',
  'Qualificado': '#166FCA',
  'Reunião Marcada': '#6366F1',
  'Orçamento Enviado': '#F59E0B',
  'Follow Up': '#EC4899',
  'Fechado': '#10B981',
  'Perdido': '#6B7280',
}

export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Lead[]
}

export async function updateLeadStage(id: string, stage: PipelineStage): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .update({ pipeline_stage: stage, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
