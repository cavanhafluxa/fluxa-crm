'use client'

import { useEffect, useState } from 'react'
import { fetchLeads, Lead } from '@/lib/supabase'
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics'
import { PageHeader } from '@/components/ui/PageHeader'
import { RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  async function load(showRefresh = false) {
    if (showRefresh) setRefreshing(true)
    try {
      const data = await fetchLeads()
      setLeads(data)
      setError(null)
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Dashboard"
        subtitle={`${leads.length} leads no total`}
      >
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="btn-ghost flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </PageHeader>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-ink-muted">Carregando dados...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
              <span className="text-red-400 text-xl">!</span>
            </div>
            <p className="text-sm font-medium text-ink mb-1">Erro de conexão</p>
            <p className="text-xs text-ink-muted mb-4">{error}</p>
            <p className="text-xs text-ink-muted bg-gray-50 rounded-xl p-3 font-mono text-left">
              Verifique as variáveis de ambiente:<br />
              NEXT_PUBLIC_SUPABASE_URL<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </p>
          </div>
        </div>
      ) : (
        <DashboardMetrics leads={leads} />
      )}
    </div>
  )
}
