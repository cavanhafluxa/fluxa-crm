-- Corrigir pipeline_stage para o formato correto
UPDATE leads SET pipeline_stage = 'Novo Lead' WHERE pipeline_stage = 'novo_lead';
UPDATE leads SET pipeline_stage = 'Qualificado' WHERE pipeline_stage = 'qualificado';
UPDATE leads SET pipeline_stage = 'Reunião Marcada' WHERE pipeline_stage = 'reuniao_marcada' OR pipeline_stage = 'reunião_marcada';
UPDATE leads SET pipeline_stage = 'Orçamento Enviado' WHERE pipeline_stage = 'orcamento_enviado' OR pipeline_stage = 'orçamento_enviado';
UPDATE leads SET pipeline_stage = 'Follow Up' WHERE pipeline_stage = 'follow_up';
UPDATE leads SET pipeline_stage = 'Fechado' WHERE pipeline_stage = 'fechado';
UPDATE leads SET pipeline_stage = 'Perdido' WHERE pipeline_stage = 'perdido';

-- Corrigir valor_estimado NULL para 0
UPDATE leads SET valor_estimado = 0 WHERE valor_estimado IS NULL;

-- Corrigir updated_at NULL
UPDATE leads SET updated_at = created_at WHERE updated_at IS NULL;

-- Verificar resultado
SELECT id, nome, pipeline_stage, valor_estimado, status FROM leads;
