-- ============================================================
-- Migration 005: Create albums table
-- Depends on: users (owner_id -> users.id)
-- ============================================================

create table public.albums (
  id          uuid        primary key default uuid_generate_v4(),
  owner_id    uuid        references public.users(id) on delete cascade,
  name        varchar     not null,
  description text,
  is_public   boolean     default false,
  share_code  uuid        default uuid_generate_v4(),
  created_at  timestamptz default now()
);
