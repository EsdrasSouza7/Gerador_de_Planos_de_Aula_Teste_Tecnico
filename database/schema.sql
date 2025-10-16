create table public.lesson_plans (
  id uuid not null default extensions.uuid_generate_v4 (),
  created_at timestamp without time zone null default now(),
  grade character varying(50) not null,
  subject character varying(100) not null,
  topic character varying(255) not null,
  duration integer not null,
  specific_objective text null,
  introduction text null,
  bncc_objective text null,
  activity_steps jsonb null,
  evaluation_rubric jsonb null,
  raw_ai_response jsonb null,
  user_id uuid null,
  content_embedding public.vector null,
  constraint lesson_plans_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_lesson_plans_subject on public.lesson_plans using btree (subject) TABLESPACE pg_default;

create index IF not exists idx_lesson_plans_grade on public.lesson_plans using btree (grade) TABLESPACE pg_default;

create index IF not exists idx_lesson_plans_embedding on public.lesson_plans using ivfflat (content_embedding)
with
  (lists = '100') TABLESPACE pg_default;