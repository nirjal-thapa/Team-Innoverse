-- ============================================================
-- Seed Data — for development/testing only
-- Run AFTER all migrations and RLS policies
-- DO NOT run this in production
-- ============================================================

-- Sample users
insert into public.users (id, name, email, hashed_password, role, plan_tier)
values
  ('00000000-0000-0000-0000-000000000001', 'Ram Studio',    'ram@studio.com',   'hashed_pw_1', 'studio', 'pro'),
  ('00000000-0000-0000-0000-000000000002', 'Sita Shrestha', 'sita@example.com', 'hashed_pw_2', 'user',   'free'),
  ('00000000-0000-0000-0000-000000000003', 'Hari Bahadur',  'hari@example.com', 'hashed_pw_3', 'user',   'free');

-- Sample events
insert into public.events (id, studio_id, name, date, location, ai_status)
values
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Wedding - Sita & Ram',    '2024-11-15', 'Kathmandu', 'done'),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Graduation - TU 2024',    '2024-12-01', 'Pokhara',   'pending'),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Corporate Headshots',     '2024-12-20', 'Lalitpur',  'processing');

-- Sample photos
insert into public.photos (id, event_id, storage_url, thumbnail_url, file_name, file_size)
values
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', 'https://storage.supabase.co/photo1.jpg', 'https://storage.supabase.co/thumb1.jpg', 'photo1.jpg', 2048000),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', 'https://storage.supabase.co/photo2.jpg', 'https://storage.supabase.co/thumb2.jpg', 'photo2.jpg', 1800000),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000002', 'https://storage.supabase.co/photo3.jpg', 'https://storage.supabase.co/thumb3.jpg', 'photo3.jpg', 3200000);

-- Sample albums
insert into public.albums (id, owner_id, name, description, is_public)
values
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000002', 'My Wedding Memories', 'Photos from our wedding day', true),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000002', 'Private Collection',  'Personal photos',             false);

-- Sample album_photos (linking photos to albums)
insert into public.album_photos (album_id, photo_id)
values
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0002-000000000001'),
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0002-000000000002');
