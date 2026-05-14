-- ============================================================
-- Migration 001: Create users table
-- Run this FIRST — no foreign key dependencies
-- ============================================================

-- Enable UUID extension (safe to run even if already enabled)
create extension if not exists "uuid-ossp";

create table public.users (
  id              uuid        primary key default uuid_generate_v4(),
  name            varchar     not null,
  email           varchar     not null unique,
  hashed_password varchar     not null,
  role            varchar     not null default 'user',   -- 'user' | 'studio' | 'admin'
  plan_tier       varchar     not null default 'free',   -- 'free' | 'pro' | 'enterprise'
  is_active       boolean     not null default true,
  created_at      timestamptz default now()
);
