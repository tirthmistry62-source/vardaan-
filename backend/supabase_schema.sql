-- Vardaan+ database schema for Supabase Postgres
-- Run this ONCE in Supabase Dashboard → SQL Editor → New query → Paste all → Run

-- Parents
create table if not exists parents (
    id uuid primary key,
    full_name text not null,
    aadhaar text not null unique,
    phone text not null unique,
    password_hash text not null,
    created_at timestamptz not null default now()
);
create index if not exists idx_parents_aadhaar on parents(aadhaar);
create index if not exists idx_parents_phone on parents(phone);

-- Doctors
create table if not exists doctors (
    id uuid primary key,
    doctor_name text not null,
    phone text not null unique,
    password_hash text not null,
    clinic_name text not null,
    clinic_address text not null,
    profile_photo_url text,
    created_at timestamptz not null default now()
);
create index if not exists idx_doctors_phone on doctors(phone);

-- Children
create table if not exists children (
    id uuid primary key,
    name text not null,
    dob date not null,
    gender text not null,
    weight_kg numeric(5,2),
    mother_aadhaar text,
    father_aadhaar text,
    child_aadhaar text,
    created_by uuid,
    created_at timestamptz not null default now()
);
create index if not exists idx_children_mother on children(mother_aadhaar);
create index if not exists idx_children_father on children(father_aadhaar);
create index if not exists idx_children_child_aadhaar on children(child_aadhaar);

-- Vaccinations
create table if not exists vaccinations (
    id uuid primary key,
    child_id uuid not null references children(id) on delete cascade,
    vaccine_code text not null,
    vaccine_name text not null,
    dose text not null,
    date_given timestamptz not null,
    weight_kg numeric(5,2),
    doctor_id uuid,
    doctor_name text,
    doctor_phone text,
    clinic_name text,
    clinic_address text,
    remarks text default '',
    is_historical boolean default false,
    created_at timestamptz not null default now()
);
create index if not exists idx_vaccinations_child on vaccinations(child_id);

-- Notifications
create table if not exists notifications (
    id uuid primary key,
    parent_id uuid not null,
    title text not null,
    body text not null,
    child_id uuid,
    vaccination_id uuid,
    read boolean default false,
    created_at timestamptz not null default now()
);
create index if not exists idx_notifications_parent on notifications(parent_id);
create index if not exists idx_notifications_created_at on notifications(created_at desc);

-- Backend uses service_role key which bypasses RLS. Disable RLS on all tables
-- for clean server-side access (no client-side access is allowed).
alter table parents disable row level security;
alter table doctors disable row level security;
alter table children disable row level security;
alter table vaccinations disable row level security;
alter table notifications disable row level security;
