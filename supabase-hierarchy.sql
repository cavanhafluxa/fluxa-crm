-- ============================================
-- FLÜXA CRM — Sistema de Hierarquia de Cargos
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. Criar tabela de perfis com cargo/role
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome text,
  cargo text DEFAULT 'Vendedor',
  role text DEFAULT 'vendedor' CHECK (role IN ('vendedor', 'supervisor', 'gerente', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- 2. Auto-criar perfil ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, cargo, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    COALESCE(new.raw_user_meta_data->>'cargo', 'Vendedor'),
    'vendedor'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Habilitar RLS nas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de profiles — todos podem ver, só o próprio usuário edita
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 5. Políticas de leads
-- Todos os usuários autenticados podem VER leads
CREATE POLICY "leads_select" ON public.leads FOR SELECT TO authenticated USING (true);

-- Todos os autenticados podem CRIAR leads
CREATE POLICY "leads_insert" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);

-- Todos podem EDITAR leads (mover no pipeline, editar notas, etc.)
CREATE POLICY "leads_update" ON public.leads FOR UPDATE TO authenticated USING (true);

-- Apenas GERENTE e ADMIN podem DELETAR leads
CREATE POLICY "leads_delete_gerente" ON public.leads FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('gerente', 'admin')
    )
  );

-- 6. Política para reuniões — todos autenticados têm acesso total
ALTER TABLE public.reunioes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reunioes_all" ON public.reunioes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- Para promover um usuário a Gerente, execute:
-- UPDATE public.profiles SET role = 'gerente' WHERE id = 'UUID_DO_USUARIO';
--
-- Roles disponíveis:
--   vendedor   → pode ver, criar, editar leads
--   supervisor → idem (pode ser expandido)
--   gerente    → pode tudo + deletar leads
--   admin      → acesso total
-- ============================================
