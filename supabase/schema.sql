-- Run this in Supabase → SQL Editor after creating the project.
-- Creates forum tables + auto profile on signup.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  username text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.threads (
  id serial primary key,
  title text not null,
  content text not null,
  author_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.replies (
  id serial primary key,
  content text not null,
  thread_id integer not null references public.threads (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists threads_set_updated_at on public.threads;
create trigger threads_set_updated_at
before update on public.threads
for each row execute function public.set_updated_at();

drop trigger if exists replies_set_updated_at on public.replies;
create trigger replies_set_updated_at
before update on public.replies
for each row execute function public.set_updated_at();

-- Create profile row when a user signs up (username from user_metadata)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uname text;
begin
  uname := coalesce(nullif(trim(new.raw_user_meta_data ->> 'username'), ''), split_part(new.email, '@', 1));

  insert into public.profiles (id, email, username)
  values (new.id, new.email, uname)
  on conflict (id) do update
    set email = excluded.email,
        username = excluded.username,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- App uses Prisma with the DB password (bypasses RLS).
-- Still enable RLS and allow public read for safety if you query via anon key later.
alter table public.profiles enable row level security;
alter table public.threads enable row level security;
alter table public.replies enable row level security;

drop policy if exists "Public profiles are viewable" on public.profiles;
create policy "Public profiles are viewable"
on public.profiles for select
using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

drop policy if exists "Threads are viewable by everyone" on public.threads;
create policy "Threads are viewable by everyone"
on public.threads for select
using (true);

drop policy if exists "Authenticated users can create threads" on public.threads;
create policy "Authenticated users can create threads"
on public.threads for insert
with check (auth.uid() = author_id);

drop policy if exists "Authors can update own threads" on public.threads;
create policy "Authors can update own threads"
on public.threads for update
using (auth.uid() = author_id);

drop policy if exists "Authors can delete own threads" on public.threads;
create policy "Authors can delete own threads"
on public.threads for delete
using (auth.uid() = author_id);

drop policy if exists "Replies are viewable by everyone" on public.replies;
create policy "Replies are viewable by everyone"
on public.replies for select
using (true);

drop policy if exists "Authenticated users can create replies" on public.replies;
create policy "Authenticated users can create replies"
on public.replies for insert
with check (auth.uid() = author_id);

drop policy if exists "Authors can update own replies" on public.replies;
create policy "Authors can update own replies"
on public.replies for update
using (auth.uid() = author_id);

drop policy if exists "Authors can delete own replies" on public.replies;
create policy "Authors can delete own replies"
on public.replies for delete
using (auth.uid() = author_id);
