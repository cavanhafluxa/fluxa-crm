'use client'

import { Lead, PIPELINE_STAGES, STAGE_COLORS } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { Users, TrendingUp, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
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

  return (
    <div className="p-8 space-y-6 animate-fade-up">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold text-ink font-display tracking-tight">Análise de Vendas</h2>
        <p className="text-ink-muted mt-1 text-sm">Visão geral do seu pipeline e performance</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="Total de Leads"
          value={total.toString()}
          icon={<Users className="w-4 h-4" />}
          trend="+12%" trendUp
          dark
        />
        <MetricCard
          label="Taxa de Conversão"
          value={`${taxa}%`}
          icon={<TrendingUp className="w-4 h-4" />}
          trend="+2.1%" trendUp
        />
        <MetricCard
          label="Ticket Médio"
          value={formatCurrency(ticketMedio)}
          icon={<BarChart3 className="w-4 h-4" />}
          trend="-5%" trendUp={false}
        />
        <MetricCard
          label="Em Negociação"
          value={formatCurrency(emNegociacao)}
          icon={<DollarSign className="w-4 h-4" />}
          trend="+18%" trendUp
          accent
        />
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
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9B9B9B', fontFamily: 'Outfit' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9B9B9B' }} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: '#F4F4F2' }}
                content={({ active, payload }) => active && payload?.length ? (
                  <div className="bg-white border border-[#E8E8E6] rounded-2xl shadow-card-hover px-3 py-2 text-xs">
                    <p className="font-semibold text-ink">{payload[0].payload.fullName}</p>
                    <p className="text-ink-muted">{payload[0].value} leads</p>
                  </div>
                ) : null}
              />
              {stageData.map((entry, i) => (
                <Bar key={i} dataKey="leads" fill={entry.color} radius={[8, 8, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 card-base p-6">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-ink font-display">Distribuição</h3>
            <p className="text-xs text-ink-muted mt-0.5">Pipeline por etapa</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="42%" innerRadius={52} outerRadius={78} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => active && payload?.length ? (
                  <div className="bg-white border border-[#E8E8E6] rounded-2xl shadow-card-hover px-3 py-2 text-xs">
                    <p className="font-semibold text-ink">{payload[0].name}</p>
                    <p className="text-ink-muted">{payload[0].value} leads</p>
                  </div>
                ) : null}
              />
              <Legend iconType="circle" iconSize={7} formatter={(v) => <span className="text-xs text-ink-muted">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent leads */}
      <div className="card-base p-6">
        <h3 className="text-base font-semibold text-ink font-display mb-4">Leads Recentes</h3>
        <div className="space-y-1">
          {leads.slice(0, 6).map((lead, i) => (
            <div key={lead.id} className={`flex items-center justify-between py-3 px-3 rounded-2xl transition-colors hover:bg-[#F4F4F2] ${i < leads.slice(0,6).length - 1 ? '' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2F2F2F] flex items-center justify-center text-xs text-white font-semibold">
                  {lead.nome[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{lead.nome}</p>
                  <p className="text-xs text-ink-muted">{lead.empresa}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-accent">{formatCurrency(lead.valor_estimado)}</span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: `${STAGE_COLORS[lead.pipeline_stage]}15`, color: STAGE_COLORS[lead.pipeline_stage] }}
                >
                  {lead.pipeline_stage}
                </span>
              </div>
            </div>
          ))}
          {leads.length === 0 && (
            <p className="text-sm text-ink-muted text-center py-8">Nenhum lead ainda</p>
          )}
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
