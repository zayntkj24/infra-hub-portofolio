
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "users can view their own roles" on public.user_roles
for select to authenticated
using (auth.uid() = user_id);

create policy "admins manage roles" on public.user_roles
for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Docs
create table public.docs (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  subcategory text not null,
  slug text not null,
  title text not null,
  description text,
  body_md text not null default '',
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category, slug)
);

create index docs_category_idx on public.docs (category, subcategory);

alter table public.docs enable row level security;

create policy "docs are public readable" on public.docs
for select to anon, authenticated using (true);

create policy "admins insert docs" on public.docs
for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "admins update docs" on public.docs
for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "admins delete docs" on public.docs
for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

create trigger docs_touch_updated_at
before update on public.docs
for each row execute function public.touch_updated_at();

-- Storage bucket
insert into storage.buckets (id, name, public) values ('doc-images', 'doc-images', true);

create policy "public read doc-images" on storage.objects
for select to anon, authenticated
using (bucket_id = 'doc-images');

create policy "admins upload doc-images" on storage.objects
for insert to authenticated
with check (bucket_id = 'doc-images' and public.has_role(auth.uid(), 'admin'));

create policy "admins delete doc-images" on storage.objects
for delete to authenticated
using (bucket_id = 'doc-images' and public.has_role(auth.uid(), 'admin'));
