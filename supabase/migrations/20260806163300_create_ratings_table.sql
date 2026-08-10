create table
  public.ratings (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    target_id uuid not null,
    target_type text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint ratings_pkey primary key (id),
    constraint ratings_user_id_target_id_target_type_key unique (user_id, target_id, target_type)
  );

-- Enable RLS
alter table public.ratings enable row level security;

-- Policies
create policy "Enable read access for all users"
on public.ratings
as permissive
for select
to public
using (true);

create policy "Enable insert for authenticated users"
on public.ratings
as permissive
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Enable update for users based on user_id"
on public.ratings
as permissive
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
