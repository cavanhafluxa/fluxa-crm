-- Run this in Supabase SQL editor to create the reunioes table

CREATE TABLE IF NOT EXISTS public.reunioes (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id     uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  data        date NOT NULL,
  hora        time NOT NULL,
  observacoes text,
  status      text DEFAULT 'agendada' CHECK (status IN ('agendada', 'realizada', 'cancelada', 'remarcada')),
  created_at  timestamptz DEFAULT now()
);

-- Enable RLS (permissive for now, matching leads table policy)
ALTER TABLE public.reunioes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON public.reunioes FOR ALL USING (true) WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS reunioes_data_idx ON public.reunioes(data);
CREATE INDEX IF NOT EXISTS reunioes_lead_id_idx ON public.reunioes(lead_id);
