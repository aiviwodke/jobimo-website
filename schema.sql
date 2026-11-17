-- JOBIMO Supabase schema (PostgreSQL)
-- Fokus: ausschließlich Minijobs und Studentenjobs.
-- Für eine NEUE Datenbank im Supabase SQL Editor ausführen.
-- Public visitors can read approved, active job listings. No public writes are allowed.

create extension if not exists pgcrypto;

create table if not exists public.employers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website_url text,
  public_contact_url text,
  contact_email text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.related_categories (
  category_id uuid not null references public.categories(id) on delete cascade,
  related_category_id uuid not null references public.categories(id) on delete cascade,
  strength smallint not null default 1 check (strength between 1 and 5),
  primary key (category_id, related_category_id),
  check (category_id <> related_category_id)
);

create table if not exists public.job_sources (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_type text not null check (source_type in ('employer_submission','licensed_feed','official_api','manual')),
  source_url text,
  permission_notes text,
  checked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references public.employers(id) on delete set null,
  source_id uuid references public.job_sources(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  description text,
  employment_type text not null default 'minijob'
    check (employment_type in ('minijob','werkstudent')),
  industry text,
  activity_tags text[] not null default '{}',
  city text not null,
  postal_code text,
  state text not null default 'Mecklenburg-Vorpommern',
  district text,
  hourly_wage_min numeric(8,2),
  hourly_wage_max numeric(8,2),
  wage_currency char(3) not null default 'EUR',
  working_time text,
  experience_required boolean,
  application_url text not null,
  original_listing_url text,
  source_listing_id text,
  status text not null default 'pending'
    check (status in ('pending','active','expired','rejected','removed')),
  published_at timestamptz,
  expires_at timestamptz,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_id, source_listing_id)
);

create index if not exists jobs_public_search_idx
  on public.jobs (status, employment_type, city, published_at desc);
create index if not exists jobs_category_idx on public.jobs (category_id, status);
create index if not exists jobs_industry_idx on public.jobs (industry, status);
create index if not exists jobs_activity_tags_idx on public.jobs using gin (activity_tags);

alter table public.employers enable row level security;
alter table public.categories enable row level security;
alter table public.related_categories enable row level security;
alter table public.job_sources enable row level security;
alter table public.jobs enable row level security;

-- Public read access only to approved active listings.
create policy "Public can read active published jobs"
  on public.jobs for select
  to anon, authenticated
  using (
    status = 'active'
    and (published_at is null or published_at <= now())
    and (expires_at is null or expires_at > now())
  );

create policy "Public can read categories"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Public can read related categories"
  on public.related_categories for select
  to anon, authenticated
  using (true);

-- No public policies are created for employers or job_sources.
-- Do not expose the Supabase service-role key in browser code.
-- Employer submissions should later go through a validated server/edge function
-- or an authenticated, permission-checked workflow.
