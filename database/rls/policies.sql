-- ============================================================
-- Row Level Security (RLS) Policies
-- Run AFTER all migration files (001 - 006)
-- ============================================================

-- Step 1: Enable RLS on all tables
alter table public.users          enable row level security;
alter table public.events         enable row level security;
alter table public.photos         enable row level security;
alter table public.face_embeddings enable row level security;
alter table public.albums         enable row level security;
alter table public.album_photos   enable row level security;


-- ============================================================
-- USERS policies
-- ============================================================

create policy "users: view own profile"
  on public.users for select
  using ((select auth.uid()) = id);

create policy "users: update own profile"
  on public.users for update
  using ((select auth.uid()) = id);


-- ============================================================
-- EVENTS policies
-- ============================================================

create policy "events: studio manages own events"
  on public.events for all
  using ((select auth.uid()) = studio_id);


-- ============================================================
-- PHOTOS policies
-- ============================================================

create policy "photos: studio manages photos in own events"
  on public.photos for all
  using (
    exists (
      select 1 from public.events
      where events.id = photos.event_id
        and events.studio_id = (select auth.uid())
    )
  );


-- ============================================================
-- FACE_EMBEDDINGS policies
-- ============================================================

create policy "face_embeddings: studio manages embeddings via photos"
  on public.face_embeddings for all
  using (
    exists (
      select 1
      from public.photos
      join public.events on events.id = photos.event_id
      where photos.id = face_embeddings.photo_id
        and events.studio_id = (select auth.uid())
    )
  );


-- ============================================================
-- ALBUMS policies
-- ============================================================

create policy "albums: owner manages own albums"
  on public.albums for all
  using ((select auth.uid()) = owner_id);

create policy "albums: anyone can view public albums"
  on public.albums for select
  using (is_public = true);


-- ============================================================
-- ALBUM_PHOTOS policies
-- ============================================================

create policy "album_photos: owner manages photos in own albums"
  on public.album_photos for all
  using (
    exists (
      select 1 from public.albums
      where albums.id = album_photos.album_id
        and albums.owner_id = (select auth.uid())
    )
  );

create policy "album_photos: anyone can view photos in public albums"
  on public.album_photos for select
  using (
    exists (
      select 1 from public.albums
      where albums.id = album_photos.album_id
        and albums.is_public = true
    )
  );
