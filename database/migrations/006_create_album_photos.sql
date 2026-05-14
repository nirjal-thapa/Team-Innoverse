-- ============================================================
-- Migration 006: Create album_photos junction table
-- Depends on: albums (album_id -> albums.id)
--             photos (photo_id -> photos.id)
-- ============================================================

create table public.album_photos (
  id       uuid        primary key default uuid_generate_v4(),
  album_id uuid        references public.albums(id) on delete cascade,
  photo_id uuid        references public.photos(id) on delete cascade,
  added_at timestamptz default now()
);
