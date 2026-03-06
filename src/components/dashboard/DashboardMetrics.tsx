'use client'

import { Lead, PIPELINE_STAGES, STAGE_COLORS } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { Users, TrendingUp, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

interface DashboardProps {
  leads: Lead[]
}

export function DashboardMetrics({ leads }: DashboardProps) {
  const total = leads.length
  const fechados = leads.filter((l) => l.pipeline_stage === 'Fechado').length
  const taxa = total > 0 ? ((fechados / total) * 100).toFixed(1) : '0'
  const valorTotal = leads.reduce((s, l) => s + (l.valor_estimado || 0), 0)
  const ticketMedio = total > 0 ? valorTotal / total : 0
  const emNegociacao = leads
    .filter((l) => !['Fechado', 'Perdido'].includes(l.pipeline_stage))
    .reduce((s, l) => s + (l.valor_estimado || 0), 0)

  // Bar chart data
  const stageData = PIPELINE_STAGES.map((s) => ({
    name: s.length > 12 ? s.slice(0, 12) + '…' : s,
    fullName: s,
    leads: leads.filter((l) => l.pipeline_stage === s).length,
    color: STAGE_COLORS[s],
  }))

  // Pie chart data
  const pieData = PIPELINE_STAGES
    .map((s) => ({
      name: s,
      value: leads.filter((l) => l.pipeline_stage === s).length,
      color: STAGE_COLORS[s],
    }))
    .filter((d) => d.value > 0)

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="Total de Leads"
          value={total.toString()}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          trend="+12%"
          trendUp
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Taxa de Conversão"
          value={`${taxa}%`}
          iconBg="bg-green-50"
          iconColor="text-green-500"
          trend="+2.1%"
          trendUp
        />
        <MetricCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="Ticket Médio"
          value={formatCurrency(ticketMedio)}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
          trend="-5%"
          trendUp={false}
        />
        <MetricCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Valor em Negociação"
          value={formatCurrency(emNegociacao)}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          trend="+18%"
          trendUp
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Bar chart - wider */}
        <div className="col-span-3 card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-ink">Leads por Etapa</h3>
              <p className="text-xs text-ink-muted mt-0.5">Distribuição atual do pipeline</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stageData} barSize={28}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} allowDecimals={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const d = payload[0].payload
                    return (
                      <div className="bg-white border border-gray-100 rounded-xl shadow-card-hover px-3 py-2 text-xs">
                        <p className="font-semibold text-ink">{d.fullName}</p>
                        <p className="text-ink-soft">{payload[0].value} leads</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              {stageData.map((entry, i) => (
                <Bar key={i} dataKey="leads" fill={entry.color} radius={[6, 6, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="col-span-2 card-base p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-ink">Distribuição</h3>
            <p className="text-xs text-ink-muted mt-0.5">Pipeline por etapa</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-white border border-gray-100 rounded-xl shadow-card-hover px-3 py-2 text-xs">
                        <p className="font-semibold text-ink">{payload[0].name}</p>
                        <p className="text-ink-soft">{payload[0].value} leads</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-ink-soft">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent leads */}
      <div className="card-base p-5">
        <h3 className="text-sm font-semibold text-ink mb-4">Leads Recentes</h3>
        <div className="space-y-2">
          {leads.slice(0, 5).map((lead) => (
            <div key={lead.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-cobalt flex items-center justify-center text-xs text-white font-semibold">
                  {lead.nome[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{lead.nome}</p>
                  <p className="text-xs text-ink-muted">{lead.empresa}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-primary">{formatCurrency(lead.valor_estimado)}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: `${STAGE_COLORS[lead.pipeline_stage]}18`,
                    color: STAGE_COLORS[lead.pipeline_stage],
                  }}
                >
                  {lead.pipeline_stage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, iconBg, iconColor, trend, trendUp }: {
  icon: React.ReactNode
  label: string
  value: string
  iconBg: string
  iconColor: string
  trend?: string
  trendUp?: boolean
}) {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${trendUp ? 'text-green-500' : 'text-red-400'}`}>
            {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-ink tracking-tight">{value}</p>
      <p className="text-xs text-ink-muted mt-1">{label}</p>
    </div>
  )
}
