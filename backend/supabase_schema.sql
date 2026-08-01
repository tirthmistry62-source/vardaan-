-- VARDAAN+ COMPLETE DATABASE SCHEMA
-- Run this ONCE in Supabase Dashboard → SQL Editor → New Query

-- Step 1: Create PARENTS table first
CREATE TABLE IF NOT EXISTS parents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    aadhaar text NOT NULL UNIQUE,
    phone text NOT NULL UNIQUE,
    access_code text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Step 2: Create DOCTORS table
CREATE TABLE IF NOT EXISTS doctors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_name text NOT NULL,
    phone text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    clinic_name text NOT NULL,

    clinic_address text NOT NULL,
    profile_photo_url text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Step 3: Create CHILDREN table
CREATE TABLE IF NOT EXISTS children (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    dob date NOT NULL,
    gender text NOT NULL,
    weight_kg numeric(5,2),
    mother_aadhaar text,
    father_aadhaar text,ome
    child_aadhaar text,
    created_by uuid,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Step 4: Create VACCINATIONS table
CREATE TABLE IF NOT EXISTS vaccinations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    vaccine_code text NOT NULL,
    vaccine_name text NOT NULL,
    dose text NOT NULL,
    date_given timestamptz NOT NULL,
    weight_kg numeric(5,2),
    doctor_id uuid,
    doctor_name text,
    doctor_phone text,
    clinic_name text,
    clinic_address text,
    remarks text DEFAULT '',
    is_historical boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Step 5: Create VACCINATION_DOCUMENTS table
CREATE TABLE IF NOT EXISTS vaccination_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vaccination_id uuid NOT NULL REFERENCES vaccinations(id) ON DELETE CASCADE,
    child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    uploaded_by_parent_id uuid REFERENCES parents(id) ON DELETE SET NULL,
    document_url text NOT NULL,
    document_type text,
    file_name text,
    file_size_bytes integer,
    mime_type text,
    uploaded_at timestamptz NOT NULL DEFAULT now()
);

-- Step 6: Create DEVICE_TOKENS table
CREATE TABLE IF NOT EXISTS device_tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id uuid NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    fcm_token text NOT NULL UNIQUE,
    device_name text,
    device_type text,
    is_active boolean DEFAULT true,
    last_used timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Step 7: Create VACCINATION_REMINDERS table
CREATE TABLE IF NOT EXISTS vaccination_reminders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    vaccine_code text NOT NULL,
    vaccine_name text NOT NULL,
    dose text NOT NULL,
    due_date date NOT NULL,
    reminder_days_before integer NOT NULL,
    notification_id uuid,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Step 8: Create NOTIFICATIONS table
CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id uuid NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    title text NOT NULL,
    body text NOT NULL,
    child_id uuid,
    vaccination_id uuid,
    read boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Step 9: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_parents_aadhaar ON parents(aadhaar);
CREATE INDEX IF NOT EXISTS idx_parents_phone ON parents(phone);
CREATE INDEX IF NOT EXISTS idx_parents_access_code ON parents(access_code);
CREATE INDEX IF NOT EXISTS idx_doctors_phone ON doctors(phone);
CREATE INDEX IF NOT EXISTS idx_children_mother ON children(mother_aadhaar);
CREATE INDEX IF NOT EXISTS idx_children_father ON children(father_aadhaar);
CREATE INDEX IF NOT EXISTS idx_children_child_aadhaar ON children(child_aadhaar);
CREATE INDEX IF NOT EXISTS idx_vaccinations_child ON vaccinations(child_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_documents_vaccination ON vaccination_documents(vaccination_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_documents_child ON vaccination_documents(child_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_documents_parent ON vaccination_documents(uploaded_by_parent_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_parent ON device_tokens(parent_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_active ON device_tokens(is_active);
CREATE INDEX IF NOT EXISTS idx_reminders_child ON vaccination_reminders(child_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON vaccination_reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_notifications_parent ON notifications(parent_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Step 10: Disable row-level security
ALTER TABLE parents DISABLE ROW LEVEL SECURITY;
ALTER TABLE doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE children DISABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE vaccination_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE device_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE vaccination_reminders DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
