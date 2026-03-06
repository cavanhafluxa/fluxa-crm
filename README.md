# Flüxa CRM

Modern SaaS CRM built with Next.js 14, Tailwind CSS, Supabase and dnd-kit.

## Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** — design tokens with Flüxa brand palette
- **Supabase** — PostgreSQL backend + realtime
- **dnd-kit** — smooth drag-and-drop kanban pipeline
- **Recharts** — dashboard charts
- **DM Sans** — clean SaaS typography

## Features

- 📊 **Dashboard** — metrics cards, bar chart by stage, pie distribution, recent leads
- 🗂 **Pipeline Kanban** — drag & drop cards between 7 stages, auto-saves to Supabase
- 👥 **Leads Table** — search, filter by stage/status, sortable columns
- 🪟 **Lead Modal** — full detail view with editable notes
- 📱 **Responsive** — works on mobile and tablet

## Setup

### 1. Clone and install

```bash
cd fluxa-crm
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Supabase table

Make sure you have a `leads` table in your Supabase project:

```sql
create table leads (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  telefone text,
  email text,
  empresa text,
  cargo text,
  pipeline_stage text default 'Novo Lead',
  status text default 'ativo',
  valor_estimado numeric default 0,
  notas text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS (optional - configure policies as needed)
alter table leads enable row level security;

-- Allow all operations for demo (adjust for production)
create policy "allow_all" on leads for all using (true) with check (true);
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## Pipeline Stages

| Stage | Description |
|-------|-------------|
| Novo Lead | Fresh leads from landing pages |
| Qualificado | Screened and qualified |
| Reunião Marcada | Meeting scheduled |
| Orçamento Enviado | Proposal sent |
| Follow Up | Awaiting response |
| Fechado | Won deals |
| Perdido | Lost deals |

## Color Palette

| Token | Color |
|-------|-------|
| Primary Blue | `#28B0FE` |
| Cobalt Blue | `#166FCA` |
| Background Light | `#F1F1F1` |
| Background Dark | `#0F0F10` |
