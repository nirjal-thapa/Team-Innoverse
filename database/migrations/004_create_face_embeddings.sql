-- ============================================================
-- Migration 004: Create face_embeddings table
-- Depends on: photos (photo_id -> photos.id)
-- ============================================================

create table public.face_embeddings (
  id         uuid  primary key default uuid_generate_v4(),
  photo_id   uuid  references public.photos(id) on delete cascade,
  embedding  json,                 -- AI face vector data
  face_box   json,                 -- bounding box {x, y, width, height}
  confidence float                 -- detection confidence 0.0 - 1.0
);
