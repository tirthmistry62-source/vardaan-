# Vaccination Document Upload Feature

Parents can now upload photos/certificates of vaccinations for record keeping and sharing with doctors.

## Features

✅ **Parent Features:**
- Upload vaccination proof documents (photos, certificates, receipts)
- View uploaded documents in a lightbox gallery
- Download documents to device
- Delete own documents
- Camera and gallery access on mobile
- File validation (image only, max 5MB)

✅ **Doctor Features:**
- View all vaccination documents for a child
- Download documents as needed
- Cannot delete (parent only)

✅ **Technical:**
- Secure upload with Supabase Storage
- Automatic file size validation
- Metadata tracking (upload date, file info)
- Responsive image gallery
- Touch-friendly UI for mobile

## Database Schema

### vaccination_documents Table

```sql
CREATE TABLE vaccination_documents (
    id uuid PRIMARY KEY,
    vaccination_id uuid NOT NULL REFERENCES vaccinations(id) ON DELETE CASCADE,
    child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    uploaded_by_parent_id uuid NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    document_url text NOT NULL,
    document_type text,  -- 'certificate', 'receipt', 'photo', 'other'
    file_name text,
    file_size_bytes integer,
    mime_type text,
    uploaded_at timestamptz NOT NULL DEFAULT now()
);
```

## Backend API Endpoints

### Upload Document

**POST** `/parent/vaccinations/{vaccination_id}/upload-document`

Upload a document for a vaccination.

```bash
curl -X POST http://localhost:8001/api/parent/vaccinations/{vac_id}/upload-document \
  -H "Authorization: Bearer <token>" \
  -F "file=@vaccination.jpg" \
  -F "document_type=photo"
```

**Parameters:**
- `vaccination_id` (path) - ID of the vaccination
- `file` (multipart) - Image file (required)
- `document_type` (query) - Type of document: 'certificate', 'receipt', 'photo', 'other' (optional, default: 'photo')

**Response:**
```json
{
  "id": "doc-uuid",
  "document_url": "https://...",
  "message": "Document uploaded successfully"
}
```

**Errors:**
- 400: File must be an image or file size > 5MB
- 403: Not your child
- 404: Vaccination not found

### Get Documents

**GET** `/vaccinations/{vaccination_id}/documents`

Get all documents for a vaccination.

```bash
curl http://localhost:8001/api/vaccinations/{vac_id}/documents \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
[
  {
    "id": "doc-uuid",
    "document_url": "https://...",
    "document_type": "photo",
    "file_name": "vaccine.jpg",
    "file_size_bytes": 2048000,
    "mime_type": "image/jpeg",
    "uploaded_at": "2026-01-15T10:30:00Z"
  }
]
```

**Access Control:**
- Parents can view only their own children's documents
- Doctors can view any vaccination document

### Delete Document

**DELETE** `/vaccination-documents/{doc_id}`

Delete a document (parent only).

```bash
curl -X DELETE http://localhost:8001/api/vaccination-documents/{doc_id} \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{"ok": true}
```

**Errors:**
- 403: Only the uploading parent can delete
- 404: Document not found

## Frontend Components

### VaccineCard

Main component that displays a vaccine with document upload/viewing.

```jsx
import VaccineCard from '@/components/VaccineCard';

<VaccineCard
  vaccine={vaccineObject}
  canUpload={true}  // Show upload button (parent only)
  onDocumentAdded={(vaccineId) => {
    // Handle document added
    refreshVaccineData();
  }}
/>
```

**Props:**
- `vaccine` - Vaccine object with `documents` array
- `canUpload` - Boolean, show upload button if true
- `onDocumentAdded` - Callback when document is uploaded

### VaccinationDocumentUpload

Modal for uploading documents with camera/gallery support.

```jsx
import VaccinationDocumentUpload from '@/components/VaccinationDocumentUpload';

<VaccinationDocumentUpload
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onUpload={async (file, docType) => {
    // Handle upload
    await uploadFunction(file, docType);
  }}
  vaccineeName="BCG"
  isUploading={false}
/>
```

### VaccinationDocumentViewer

Lightbox viewer for browsing documents.

```jsx
import VaccinationDocumentViewer from '@/components/VaccinationDocumentViewer';

<VaccinationDocumentViewer
  isOpen={showViewer}
  onClose={() => setShowViewer(false)}
  documents={documentsArray}
  initialIndex={0}
  onDelete={(docId) => deleteFunction(docId)}
  canDelete={true}  // Show delete button
  isDeleting={false}
/>
```

### useVaccinationDocuments Hook

Hook for managing document operations.

```jsx
import { useVaccinationDocuments } from '@/hooks/useVaccinationDocuments';

const {
  uploadDocument,
  fetchDocuments,
  deleteDocument,
  getDocuments,
  uploading,
  loading,
} = useVaccinationDocuments();

// Upload
const result = await uploadDocument(vaccineId, file, 'photo');

// Fetch
const docs = await fetchDocuments(vaccineId);

// Delete
await deleteDocument(docId, vaccineId);

// Get cached
const cached = getDocuments(vaccineId);
```

## Integration Steps

### Step 1: Update Database Schema

Run in Supabase SQL Editor:

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

### Step 2: Set Up Supabase Storage Bucket

In Supabase Dashboard:

1. Go to **Storage** → **New Bucket**
2. Name: `vaccination-documents`
3. Public: **Yes** (to allow viewing)
4. Click **Create**

### Step 3: Update Child Profile Page

In your ChildProfile.jsx or similar:

```jsx
import VaccineCard from '@/components/VaccineCard';

// In your vaccine list rendering:
{child.vaccinations?.map((vaccine) => (
  <VaccineCard
    key={vaccine.id}
    vaccine={vaccine}
    canUpload={isParent}  // true if current user is parent
    onDocumentAdded={handleDocumentAdded}
  />
))}
```

### Step 4: Update Doctor Child Record Page

In your DoctorChildRecord.jsx or similar:

```jsx
import VaccineCard from '@/components/VaccineCard';

// In your vaccine list rendering:
{child.vaccinations?.map((vaccine) => (
  <VaccineCard
    key={vaccine.id}
    vaccine={vaccine}
    canUpload={false}  // Doctor can view but not upload
    onDocumentAdded={null}
  />
))}
```

## User Guide

### For Parents

**To upload a vaccine document:**

1. Open child's profile
2. Find the vaccine card
3. Click **"Add"** button in the Documents section
4. Choose:
   - **Gallery** - Select from device photos
   - **Camera** - Take a photo with camera
5. Click **"Upload Document"**
6. Wait for upload to complete

**To view documents:**

1. Click on a document thumbnail in the Documents section
2. Swipe left/right to browse through documents
3. Use **"Download"** button to save to device
4. Click **"Delete"** to remove (parent only)

**Best practices:**
- Upload clear, well-lit photos of certificates
- Ensure all text is readable
- Include vaccination date visible in photo
- Upload within 1 week of vaccination for accuracy

### For Doctors

**To view vaccination documents:**

1. Search for child by Aadhaar
2. Open child's vaccination record
3. Click on vaccine cards to expand
4. View document thumbnails in Documents section
5. Click to view full-size in lightbox
6. Use **"Download"** to save if needed

**Note:** Doctors cannot upload or delete documents. Only parents can manage documents.

## File Upload Requirements

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

### Size Limits
- Maximum: 5 MB per document
- Recommended: 2-3 MB for faster upload

### Recommended Specifications
- Resolution: 1080x1920px or higher
- Format: JPEG or PNG
- Quality: High (80%+ quality)

## Storage Considerations

### Supabase Storage Pricing
- First 1 GB per project: Free
- Additional storage: $0.05 per GB
- Each 5MB vaccination photo counts toward storage

### Example Calculations
- 100 children with 20 vaccines each
- Average 2 photos per vaccine
- 100 × 20 × 2 = 4,000 photos
- At 2 MB per photo = 8 GB storage
- Cost: ~$0.40/month

### Cleanup Strategy
- Archive old documents yearly
- Delete test/duplicate photos
- Monitor storage usage in Supabase Dashboard

## Troubleshooting

### Upload Fails

**Problem:** "Failed to upload document"

**Solutions:**
1. Check file is an image (JPEG, PNG, WebP, GIF)
2. Verify file size < 5 MB
3. Check internet connection
4. Ensure Supabase Storage bucket exists and is public
5. Check browser console for error details

### Can't View Photos

**Problem:** Document thumbnails are blank

**Solutions:**
1. Check Supabase Storage bucket is public
2. Verify document_url in database is correct
3. Check browser network tab for failed image loads
4. Try refreshing the page
5. Clear browser cache

### Storage Issues

**Problem:** Upload fails with storage error

**Solutions:**
1. Check Supabase Storage quota (free tier: 1 GB)
2. Delete old/duplicate documents
3. Upgrade Supabase plan if needed
4. Contact support if bucket is corrupted

### Access Issues

**Problem:** Can't upload/view documents

**Solutions:**
1. Verify you're logged in as parent
2. Check relationship to child (must be mother/father)
3. Verify doctor can view (no permission needed)
4. Check browser permissions (camera/gallery access on mobile)

## Security Notes

- Only parents can upload documents for their children
- Only parents can delete their own documents
- Doctors have read-only access
- Supabase RLS ensures data isolation
- File validation prevents malicious uploads
- HTTPS enforced for all transfers

## Performance Tips

- Pre-compress images before upload (use device camera, not screenshot)
- On slow connections, upload smaller files first
- Close other apps to free up bandwidth
- Upload during off-peak hours for faster speed

## Future Enhancements

Possible improvements:
- Batch upload multiple documents
- OCR to extract vaccine details
- Document organization/tagging
- Automatic upload on vaccination
- Document sharing via link
- Cloud backup to multiple providers

## Support

For issues:
1. Check Supabase Storage logs
2. Review browser console errors
3. Test with different file formats
4. Clear browser cache and retry
5. Contact support with device/browser info
