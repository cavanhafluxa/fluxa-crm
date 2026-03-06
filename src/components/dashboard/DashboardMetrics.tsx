'use client'

import { Lead, PIPELINE_STAGES, STAGE_COLORS } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { Users, TrendingUp, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight, FileDown } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

interface DashboardProps { leads: Lead[] }

export function DashboardMetrics({ leads }: DashboardProps) {
  const total = leads.length
  const fechados = leads.filter((l) => l.pipeline_stage === 'Fechado').length
  const taxa = total > 0 ? ((fechados / total) * 100).toFixed(1) : '0'
  const valorTotal = leads.reduce((s, l) => s + (l.valor_estimado || 0), 0)
  const ticketMedio = total > 0 ? valorTotal / total : 0
  const emNegociacao = leads
    .filter((l) => !['Fechado', 'Perdido'].includes(l.pipeline_stage))
    .reduce((s, l) => s + (l.valor_estimado || 0), 0)

  const stageData = PIPELINE_STAGES.map((s) => ({
    name: s.length > 10 ? s.slice(0, 10) + '…' : s,
    fullName: s,
    leads: leads.filter((l) => l.pipeline_stage === s).length,
    color: STAGE_COLORS[s],
  }))

  const pieData = PIPELINE_STAGES
    .map((s) => ({ name: s, value: leads.filter((l) => l.pipeline_stage === s).length, color: STAGE_COLORS[s] }))
    .filter((d) => d.value > 0)

  function exportReport() {
    const fechadosV = leads.filter((l) => l.pipeline_stage === 'Fechado').reduce((s, l) => s + (l.valor_estimado || 0), 0)
    const content = `
FLÜXA CRM — RELATÓRIO
Gerado em: ${new Date().toLocaleDateString('pt-BR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESUMO EXECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total de Leads:       ${total}
Taxa de Conversão:    ${taxa}%
Ticket Médio:         ${formatCurrency(ticketMedio)}
Valor em Negociação:  ${formatCurrency(emNegociacao)}
Vendas Fechadas:      ${formatCurrency(fechadosV)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEADS POR ETAPA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${PIPELINE_STAGES.map((s) => {
  const count = leads.filter((l) => l.pipeline_stage === s).length
  const valor = leads.filter((l) => l.pipeline_stage === s).reduce((acc, l) => acc + (l.valor_estimado || 0), 0)
  return `${s.padEnd(22)} ${String(count).padStart(3)} leads  ${formatCurrency(valor)}`
}).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEADS RECENTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${leads.slice(0, 20).map((l) =>
  `${l.nome.padEnd(25)} ${l.pipeline_stage.padEnd(20)} ${formatCurrency(l.valor_estimado)}`
).join('\n')}
`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'fluxa-report.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 space-y-6 animate-fade-up">
      {/* Title + Report button */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-ink font-display tracking-tight">Flüxa Dashboard</h2>
          <p className="text-ink-muted mt-1 text-sm">Visão geral do seu pipeline e performance</p>
        </div>
        <button onClick={exportReport}
          className="flex items-center gap-2 btn-primary text-sm">
          <FileDown className="w-4 h-4" /> Gerar Report
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Total de Leads" value={total.toString()}
          icon={<Users className="w-4 h-4" />} trend="+12%" trendUp dark />
        <MetricCard label="Taxa de Conversão" value={`${taxa}%`}
          icon={<TrendingUp className="w-4 h-4" />} trend="+2.1%" trendUp />
        <MetricCard label="Ticket Médio" value={formatCurrency(ticketMedio)}
          icon={<BarChart3 className="w-4 h-4" />} trend="-5%" trendUp={false} />
        <MetricCard label="Em Negociação" value={formatCurrency(emNegociacao)}
          icon={<DollarSign className="w-4 h-4" />} trend="+18%" trendUp accent />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 card-base p-6">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-ink font-display">Leads por Etapa</h3>
            <p className="text-xs text-ink-muted mt-0.5">Distribuição atual do pipeline</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stageData} barSize={32} barCategoryGap="30%">
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fontSize: 10, fill: '#9B9B9B', fontFamily: 'Outfit' }} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fontSize: 10, fill: '#9B9B9B' }} allowDecimals={false} />
              <Tooltip cursor={{ fill: '#F4F4F2' }}
                content={({ active, payload }) => active && payload?.length ? (
                  <div className="bg-white border border-[#E8E8E6] rounded-2xl shadow-card-hover px-3 py-2 text-xs">
                    <p className="font-semibold text-ink">{payload[0].payload.fullName}</p>
                    <p className="text-ink-muted">{payload[0].value} leads</p>
                  </div>
                ) : null} />
              {stageData.map((entry, i) => (
                <Bar key={i} dataKey="leads" fill={entry.color} radius={[8, 8, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 card-base p-6">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-ink font-display">Distribuição Pipeline</h3>
            <p className="text-xs text-ink-muted mt-0.5">Por etapa</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="42%" innerRadius={52} outerRadius={78} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
              </Pie>
              <Tooltip content={({ active, payload }) => active && payload?.length ? (
                <div className="bg-white border border-[#E8E8E6] rounded-2xl shadow-card-hover px-3 py-2 text-xs">
                  <p className="font-semibold text-ink">{payload[0].name}</p>
                  <p className="text-ink-muted">{payload[0].value} leads</p>
                </div>
              ) : null} />
              <Legend iconType="circle" iconSize={7}
                formatter={(v) => <span className="text-xs text-ink-muted">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon, trend, trendUp, dark, accent }: {
  label: string; value: string; icon: React.ReactNode
  trend?: string; trendUp?: boolean; dark?: boolean; accent?: boolean
}) {
  return (
    <div className={`rounded-3xl p-5 border transition-all duration-200 ${
      dark ? 'bg-[#2F2F2F] border-[#2F2F2F] text-white'
      : accent ? 'bg-accent border-accent text-white'
      : 'bg-white border-[#E8E8E6] hover:border-accent/30'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
          dark ? 'bg-white/15' : accent ? 'bg-white/20' : 'bg-[#F4F4F2]'
        } ${dark || accent ? 'text-white' : 'text-ink-muted'}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${
            trendUp
              ? dark || accent ? 'text-[#C8F135]' : 'text-emerald-500'
              : dark || accent ? 'text-red-300' : 'text-red-400'
          }`}>
            {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
          </div>
        )}
      </div>
      <p className={`text-2xl font-bold tracking-tight font-display ${dark || accent ? 'text-white' : 'text-ink'}`}>{value}</p>
      <p className={`text-xs mt-1 ${dark || accent ? 'text-white/60' : 'text-ink-muted'}`}>{label}</p>
    </div>
  )
}
