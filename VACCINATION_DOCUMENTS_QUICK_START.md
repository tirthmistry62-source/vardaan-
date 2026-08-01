# Vaccination Document Upload - Quick Start

## What's New

Parents can now upload photos of vaccination certificates/receipts for each vaccine. A small document icon appears on each vaccine card.

## Quick Integration (5 Steps)

### 1. Create Storage Bucket

Supabase Dashboard:
- Go to **Storage** → **New Bucket**
- Name: `vaccination-documents`
- Public: **Yes**
- Click **Create**

### 2. Update Database Schema

Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS vaccination_documents (
    id uuid PRIMARY KEY,
    vaccination_id uuid NOT NULL REFERENCES vaccinations(id) ON DELETE CASCADE,
    child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    uploaded_by_parent_id uuid NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    document_url text NOT NULL,
    document_type text,
    file_name text,
    file_size_bytes integer,
    mime_type text,
    uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vaccination_documents_vaccination ON vaccination_documents(vaccination_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_documents_child ON vaccination_documents(child_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_documents_parent ON vaccination_documents(uploaded_by_parent_id);

ALTER TABLE vaccination_documents DISABLE ROW LEVEL SECURITY;
```

### 3. Use VaccineCardWithDocuments Component

In your child profile page:

```jsx
import VaccineCardWithDocuments from '@/components/VaccineCardWithDocuments';

// In your vaccine list:
{child.vaccinations?.map((vaccine) => (
  <VaccineCardWithDocuments
    key={vaccine.id}
    vaccine={vaccine}
    canUpload={isCurrentUserParent}
    onDocumentAdded={handleRefresh}
  />
))}
```

### 4. Restart Backend

```bash
cd backend
# Stop (Ctrl+C if running)
uvicorn server:app --reload --port 8001
```

### 5. Test It

1. Open app and login as parent
2. Go to child profile
3. Scroll to vaccine cards
4. Click **"Add"** button on a vaccine
5. Choose **Camera** or **Gallery**
6. Upload an image
7. Click thumbnail to view in lightbox

## What You Get

### Parent Side
- ✅ Upload vaccine photos on mobile (camera) or desktop (gallery)
- ✅ View all photos in a gallery lightbox
- ✅ Browse multiple photos with navigation arrows
- ✅ Download photos to device
- ✅ Delete own photos
- ✅ File validation (image only, max 5MB)

### Doctor Side
- ✅ View all vaccine documents for a child
- ✅ Download photos if needed
- ✅ Cannot upload or delete (parent only)

## Files Added/Modified

**Backend:**
- `server.py` - Added upload/get/delete endpoints
- `supabase_schema.sql` - Added vaccination_documents table

**Frontend Components:**
- `VaccineCard.jsx` - Main vaccine display with documents
- `VaccinationDocumentUpload.jsx` - Upload modal with camera/gallery
- `VaccinationDocumentViewer.jsx` - Lightbox viewer
- `useVaccinationDocuments.js` - Hook for document operations

**Documentation:**
- `VACCINATION_DOCUMENTS_SETUP.md` - Complete guide
- `VACCINATION_DOCUMENTS_QUICK_START.md` - This file

## API Endpoints

```
POST   /parent/vaccinations/{id}/upload-document  (parent upload)
GET    /vaccinations/{id}/documents               (parent/doctor view)
DELETE /vaccination-documents/{id}                (parent delete)
```

## Features

| Feature | Parent | Doctor |
|---------|--------|--------|
| Upload documents | ✅ | ❌ |
| View documents | ✅ | ✅ |
| Delete documents | ✅ | ❌ |
| Camera access | ✅ | ❌ |
| Gallery access | ✅ | ❌ |

## UI Overview

### Vaccine Card (Parent View)
```
┌─────────────────────────────────┐
│ BCG                       [+Add]│  ← Upload button
│ Dose 1                          │
│ Jan 15, 2026                    │
│ 3.5 kg                          │
├─────────────────────────────────┤
│ Doctor: Dr. Smith               │
│ Clinic: City Hospital           │
├─────────────────────────────────┤
│ Documents (2)                   │
│ ┌──────────┬──────────┐         │
│ │ [Photo1] │ [Photo2] │         │  ← Thumbnails (click to view)
│ └──────────┴──────────┘         │
└─────────────────────────────────┘
```

### Upload Modal
```
Choose upload method:
┌────────────────────┐
│   [No Image]       │
│   Selected        │
├────────────────────┤
│ [Gallery] [Camera] │
├────────────────────┤
│ [Upload Document]  │
└────────────────────┘
```

### Lightbox Viewer
```
┌──────────────────────────────┐
│ Vaccination Document         │
├──────────────────────────────┤
│                              │
│      [Full Size Image]       │  ← Click to zoom
│                              │
├──────────────────────────────┤
│ File: vaccine.jpg            │
│ Type: photo                  │
│ Uploaded: Jan 15, 2026       │
├──────────────────────────────┤
│ [Prev] 1/2 [Next] [Download] │
│ [Delete] [Close]             │
└──────────────────────────────┘
```

## Common Tasks

### As Parent: Upload Document

1. Open child profile
2. Find vaccine card
3. Click **"Add"** in Documents section
4. Tap **"Camera"** to take photo or **"Gallery"** to choose
5. Select image
6. Click **"Upload Document"**
7. Wait for success toast

### As Parent: View Document

1. Tap document thumbnail in vaccine card
2. Full image opens in lightbox
3. Swipe or use arrows to browse
4. Tap **"Download"** to save
5. Tap **"Delete"** to remove
6. Tap **"Close"** (X button) to exit

### As Doctor: View Vaccination Documents

1. Search child by Aadhaar
2. View child's vaccination record
3. Documents appear in each vaccine card
4. Click thumbnail to view full-size
5. Use arrows to browse
6. Click **"Download"** if needed

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Upload fails | Check file is image < 5MB |
| Can't see photos | Verify Storage bucket is public |
| No camera option | Check browser/app permissions |
| Doctor can't view | Ensure doctor has access to child |
| Photos won't load | Clear cache, refresh page |

## Next Steps

1. Run database schema in Supabase
2. Create storage bucket
3. Use VaccineCard component in your pages
4. Test upload with mobile device
5. Share with users!

## File Size Reference

- Average photo: 1-3 MB
- Storage included (free): 1 GB per project
- Enough for: ~300-500 children with 2 photos each

## Limits

- File size: 5 MB max
- Formats: JPEG, PNG, WebP, GIF
- Photos per vaccine: Unlimited
- Upload speed: Depends on connection

## Need Help?

See `VACCINATION_DOCUMENTS_SETUP.md` for:
- Detailed API documentation
- Component API reference
- Advanced troubleshooting
- Performance optimization
- Security considerations
