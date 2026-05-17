## Database Architecture:
![Logo](./ER%20image/ER_diagram.png)


---

## Schema Overview

| Table | Description |
|---|---|
| `users` | Studio owners and client accounts |
| `events` | Photo shoot events per studio |
| `photos` | Individual photos linked to events |
| `face_embeddings` | AI face detection data per photo |
| `albums` | Curated photo collections |
| `album_photos` | Junction table — links albums to photos |

---

## Folder Structure

```
database/
├── migrations/
│   ├── 001_create_users.sql          ← Run first
│   ├── 002_create_events.sql
│   ├── 003_create_photos.sql
│   ├── 004_create_face_embeddings.sql
│   ├── 005_create_albums.sql
│   └── 006_create_album_photos.sql   ← Run last
├── rls/
│   └── policies.sql                  ← Run after all migrations
└── seed/
    └── seed_data.sql                 ← Dev/testing only, NOT for production
```

---

## Setup Instructions

1. Go to your [Supabase](https://supabase.com) project
2. Open the **SQL Editor** (left sidebar)
3. Run migration files **in numbered order** (001 → 006)
4. Run `rls/policies.sql` to enable security
5. Optionally run `seed/seed_data.sql` for test data

---

## Key Design Decisions

- All primary keys are **UUID** (not integer) for security and scalability
- `on delete cascade` is used so deleting a parent record cleans up children automatically
- `face_embeddings.embedding` is stored as `json` — can be upgraded to `vector` type if using pgvector for AI similarity search
- `albums.share_code` and `events.share_code` use UUID as a secure shareable token
- RLS is enabled on all tables — users can only access their own data

---
