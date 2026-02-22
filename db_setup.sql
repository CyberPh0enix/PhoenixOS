-- ==========================================
-- PH0ENIX OS : MASTER DATABASE CONFIGURATION
-- WARN: Running this script will WIPE all existing game data.
-- ==========================================

-- 1. CLEAN SLATE: Safely remove old configurations
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.solved_puzzles cascade;
drop table if exists public.skipped_puzzles cascade;
drop table if exists public.profiles cascade;

-- 2. CREATE PROFILES TABLE (Only Name & Email)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text not null,
  operative_id text unique not null,
  score integer default 0 not null,
  credits integer default 100 not null, -- Starting balance
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CREATE PROGRESS TABLES
create table public.solved_puzzles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  puzzle_id text not null,
  solved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, puzzle_id)
);

create table public.skipped_puzzles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  puzzle_id text not null,
  skipped_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, puzzle_id)
);

-- 4. THE SECURE AUTO-CREATION TRIGGER (Supports Email & Google OAuth)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  op_id text;
  f_name text;
begin
  -- Check if operative_id was passed (Email Signup), else generate one (Google Signup)
  op_id := new.raw_user_meta_data->>'operative_id';
  if op_id is null then
    op_id := 'CPX-' || floor(random() * 9000 + 1000)::text;
  end if;

  -- Safely grab their name (Fallback to email prefix if missing)
  f_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, email, full_name, operative_id)
  values (new.id, new.email, f_name, op_id);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. ROW LEVEL SECURITY (RLS) - Anti-Cheating Firewall
alter table public.profiles enable row level security;
alter table public.solved_puzzles enable row level security;
alter table public.skipped_puzzles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own solved." on public.solved_puzzles for insert with check (auth.uid() = user_id);
create policy "Users can read own solved." on public.solved_puzzles for select using (auth.uid() = user_id);
create policy "Users can insert own skipped." on public.skipped_puzzles for insert with check (auth.uid() = user_id);
create policy "Users can read own skipped." on public.skipped_puzzles for select using (auth.uid() = user_id);
