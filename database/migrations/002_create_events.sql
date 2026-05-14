-- ============================================================
-- Migration 002: Create events table
-- Depends on: users (studio_id -> users.id)
-- ============================================================

create table public.events (
  id           uuid        primary key default uuid_generate_v4(),
  studio_id    uuid        references public.users(id) on delete cascade,
  name         varchar     not null,
  date         date,
  location     varchar,
  share_code   uuid        default uuid_generate_v4(),
  ai_status    varchar     default 'pending',   -- 'pending' | 'processing' | 'done' | 'failed'
  total_photos int         default 0,
  created_at   timestamptz default now()
);
