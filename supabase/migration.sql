-- Flüxa CRM - Supabase Migration
-- Run this in the Supabase SQL Editor

-- Create leads table
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  telefone text,
  email text,
  empresa text,
  cargo text,
  pipeline_stage text not null default 'Novo Lead',
  status text not null default 'ativo',
  valor_estimado numeric(12, 2) default 0,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.leads enable row level security;

-- Policy: allow all (adjust for production with auth)
create policy "allow_all_leads" on public.leads
  for all using (true) with check (true);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger on_leads_updated
  before update on public.leads
  for each row execute procedure public.handle_updated_at();

-- Optional: Seed with sample data
insert into public.leads (nome, telefone, email, empresa, cargo, pipeline_stage, status, valor_estimado) values
  ('Ana Costa', '(11) 99999-0001', 'ana@techcorp.com', 'TechCorp', 'CEO', 'Novo Lead', 'quente', 25000),
  ('Bruno Silva', '(11) 99999-0002', 'bruno@startup.io', 'Startup IO', 'CTO', 'Qualificado', 'ativo', 15000),
  ('Carla Mendes', '(21) 98888-0003', 'carla@empresa.com', 'Empresa SA', 'Diretora', 'Reunião Marcada', 'quente', 42000),
  ('Daniel Rocha', '(31) 97777-0004', 'daniel@negocio.com', 'Negócio Ltda', 'Gerente', 'Orçamento Enviado', 'ativo', 8000),
  ('Elena Martins', '(41) 96666-0005', 'elena@scale.com', 'Scale Up', 'CMO', 'Follow Up', 'frio', 31000),
  ('Felipe Souza', '(51) 95555-0006', 'felipe@corp.com', 'Corp Inc', 'VP Sales', 'Fechado', 'ativo', 55000),
  ('Gabriela Lima', '(61) 94444-0007', 'gabriela@ventures.com', 'Ventures Co', 'Sócia', 'Perdido', 'inativo', 12000),
  ('Hugo Alves', '(71) 93333-0008', 'hugo@inovacao.com', 'Inovação Tech', 'Founder', 'Novo Lead', 'quente', 38000);
