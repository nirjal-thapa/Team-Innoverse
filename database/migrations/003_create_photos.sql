-- ============================================================
-- Migration 003: Create photos table
-- Depends on: events (event_id -> events.id)
-- ============================================================

create table public.photos (
  id            uuid        primary key default uuid_generate_v4(),
  event_id      uuid        references public.events(id) on delete cascade,
  storage_url   text        not null,
  thumbnail_url text,
  file_name     varchar,
  file_size     int,
  uploaded_at   timestamptz default now()
);
