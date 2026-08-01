-- VACCINATION DOCUMENTS TABLE ONLY
-- Use this if you already have parents, children, vaccinations tables

-- Create table for vaccine documents/photos
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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_vaccination_documents_vaccination ON vaccination_documents(vaccination_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_documents_child ON vaccination_documents(child_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_documents_parent ON vaccination_documents(uploaded_by_parent_id);

-- Disable RLS
ALTER TABLE vaccination_documents DISABLE ROW LEVEL SECURITY;
