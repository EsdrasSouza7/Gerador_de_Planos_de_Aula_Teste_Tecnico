-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabela de planos de aula
CREATE TABLE lesson_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Inputs do usuário (grade, subject e topic são obrigatórios)
  grade VARCHAR(50) NOT NULL, -- ano/série
  subject VARCHAR(100) NOT NULL, -- disciplina
  topic VARCHAR(255) NOT NULL, -- tópico
  duration INTEGER NOT NULL, -- em minutos
  specific_objective TEXT, -- campo opcional
  
  -- Saída da IA (JSON)
  introduction TEXT,
  bncc_objective TEXT,
  activity_steps JSONB,
  evaluation_rubric JSONB,
  
  -- Metadados
  raw_ai_response JSONB,
  user_id UUID, -- se implementar auth
  
  -- Vector embedding para busca por similaridade
  content_embedding vector(1536) -- ajuste a dimensão conforme o modelo escolhido
);

-- Índices para busca
CREATE INDEX idx_lesson_plans_subject ON lesson_plans(subject);
CREATE INDEX idx_lesson_plans_grade ON lesson_plans(grade);

-- Índice para busca por similaridade usando IVFFlat
CREATE INDEX idx_lesson_plans_embedding ON lesson_plans 
USING ivfflat (content_embedding vector_l2_ops)
WITH (lists = 100); -- ajuste o número de lists conforme volume de dados

-- Comentários sobre a estrutura:
-- 1. uuid-ossp: permite gerar UUIDs para IDs únicos
-- 2. vector: habilita pgvector para busca por similaridade
-- 3. content_embedding: vetor para busca semântica dos planos
-- 4. ivfflat: índice otimizado para busca aproximada de vizinhos mais próximos (ANN)

-- Exemplo de busca por similaridade (depois de inserir dados):
-- SELECT id, subject, topic, 
--   1 - (content_embedding <=> query_embedding) as similarity
-- FROM lesson_plans
-- ORDER BY content_embedding <=> query_embedding
-- LIMIT 5;