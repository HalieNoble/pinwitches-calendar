-- ============================================================
-- Run this ONCE in Supabase → SQL Editor → New query → Run.
-- Safe to re-run: it drops and recreates the pieces it owns.
-- ============================================================

-- 1. EVENTS TABLE ------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  event_date date not null,
  event_time text,
  location text not null,
  description text,
  link text,
  tags text[] not null default '{}',
  image_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  moderator_note text,
  created_at timestamptz not null default now()
);

create index if not exists events_status_date_idx on public.events (status, event_date);

alter table public.events enable row level security;

-- Anyone (including logged-out visitors) can read approved events.
drop policy if exists "public can read approved events" on public.events;
create policy "public can read approved events"
  on public.events for select
  using (status = 'approved');

-- Logged-in users can read their own submissions, whatever the status.
drop policy if exists "users can read own events" on public.events;
create policy "users can read own events"
  on public.events for select
  using (auth.uid() = user_id);

-- The admin (matched by email) can read everything.
-- NOTE: the email is hardcoded directly into the policy below because
-- Supabase's hosted SQL editor does not allow `alter database ... set`
-- (that requires superuser, which the hosted plan doesn't grant).
-- If you ever change your admin email, edit BOTH policies below and
-- re-run this file.
drop policy if exists "admin can read all events" on public.events;
create policy "admin can read all events"
  on public.events for select
  using (auth.jwt() ->> 'email' = 'halienoble512@gmail.com');

-- Logged-in users can submit new events, always starting as pending.
drop policy if exists "users can insert own events" on public.events;
create policy "users can insert own events"
  on public.events for insert
  with check (auth.uid() = user_id and status = 'pending');

-- Users can delete their own submission while it's still pending.
drop policy if exists "users can delete own pending events" on public.events;
create policy "users can delete own pending events"
  on public.events for delete
  using (auth.uid() = user_id and status = 'pending');

-- The admin can update any event (approve / reject / add a note).
drop policy if exists "admin can update all events" on public.events;
create policy "admin can update all events"
  on public.events for update
  using (auth.jwt() ->> 'email' = 'halienoble512@gmail.com');

-- 2. STORAGE BUCKET FOR EVENT IMAGES ------------------------------
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

drop policy if exists "public can view event images" on storage.objects;
create policy "public can view event images"
  on storage.objects for select
  using (bucket_id = 'event-images');

drop policy if exists "authenticated users can upload event images" on storage.objects;
create policy "authenticated users can upload event images"
  on storage.objects for insert
  with check (bucket_id = 'event-images' and auth.role() = 'authenticated');
