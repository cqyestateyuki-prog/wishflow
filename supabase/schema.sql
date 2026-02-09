-- Enable UUID generation
create extension if not exists pgcrypto;

-- Updated-at helper
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Wishes
create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  domain text default 'other',
  stage text default 'lifelong',
  will_source text default '',
  end_scene text default '',
  line_seed text,
  pinned boolean default false,
  last_connected_at timestamptz,
  last_level text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger set_wishes_updated_at
before update on public.wishes
for each row execute function public.set_updated_at();

-- Connections
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wish_id uuid not null references public.wishes(id) on delete cascade,
  level text not null,
  mood text,
  note text,
  connected_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Fragments
create table if not exists public.fragments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  content text not null,
  linked_wish_ids uuid[] default '{}',
  created_at timestamptz default now()
);

-- Settings
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  motion text default 'on',
  contrast text default 'low',
  haze text default 'high',
  updated_at timestamptz default now()
);

create trigger set_user_settings_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

-- RLS
alter table public.wishes enable row level security;
alter table public.connections enable row level security;
alter table public.fragments enable row level security;
alter table public.user_settings enable row level security;

create policy "wishes_select_own" on public.wishes
  for select using (auth.uid() = user_id);
create policy "wishes_insert_own" on public.wishes
  for insert with check (auth.uid() = user_id);
create policy "wishes_update_own" on public.wishes
  for update using (auth.uid() = user_id);
create policy "wishes_delete_own" on public.wishes
  for delete using (auth.uid() = user_id);

create policy "connections_select_own" on public.connections
  for select using (auth.uid() = user_id);
create policy "connections_insert_own" on public.connections
  for insert with check (auth.uid() = user_id);
create policy "connections_update_own" on public.connections
  for update using (auth.uid() = user_id);
create policy "connections_delete_own" on public.connections
  for delete using (auth.uid() = user_id);

create policy "fragments_select_own" on public.fragments
  for select using (auth.uid() = user_id);
create policy "fragments_insert_own" on public.fragments
  for insert with check (auth.uid() = user_id);
create policy "fragments_update_own" on public.fragments
  for update using (auth.uid() = user_id);
create policy "fragments_delete_own" on public.fragments
  for delete using (auth.uid() = user_id);

create policy "settings_select_own" on public.user_settings
  for select using (auth.uid() = user_id);
create policy "settings_insert_own" on public.user_settings
  for insert with check (auth.uid() = user_id);
create policy "settings_update_own" on public.user_settings
  for update using (auth.uid() = user_id);
create policy "settings_delete_own" on public.user_settings
  for delete using (auth.uid() = user_id);
