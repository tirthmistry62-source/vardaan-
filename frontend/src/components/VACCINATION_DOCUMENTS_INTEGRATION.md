# Integrating Document Upload into Child Profile Pages

## Overview

The vaccination document upload feature can be integrated into:
1. **ChildProfile.jsx** - Parent view with timeline layout
2. **DoctorChildRecord.jsx** - Doctor view with tabbed interface

## Current Architecture

### ChildProfile.jsx (Parent View)
- Timeline-based layout (grouped by milestone)
- Uses local `VaccineCard` component for status display
- Props: `v` (vaccine object), `onOpen` (click handler)
- Calls `VaccineInfoDialog` on click

### DoctorChildRecord.jsx (Doctor View)
- Tabbed interface (Due/History/All)
- Uses `VaccineList` component to render vaccines
- Checkboxes for selecting vaccines to record
- Shows doctor info if vaccine already recorded

## Integration Strategy

### Option 1: Replace Timeline Card (ChildProfile)
Replace the local `VaccineCard` with `VaccineCardWithDocuments`:

```jsx
import VaccineCardWithDocuments from '@/components/VaccineCardWithDocuments';

// In the render for grouped[ms]:
{grouped[ms].map((v) => (
  <VaccineCardWithDocuments
    key={v.code}
    vaccine={{
      id: v.record?.id || v.code,  // Use record ID if exists
      vaccine_name: v.name,
      dose: v.dose,
      date_given: v.record?.date_given,
      weight_kg: v.record?.weight_kg,
      doctor_name: v.record?.doctor_name,
      clinic_name: v.record?.clinic_name,
      doctor_phone: v.record?.clinic_phone,
      remarks: v.record?.remarks,
      documents: v.record?.documents || [],
      is_historical: false,
    }}
    canUpload={true}  // Parent can upload
    onDocumentAdded={() => refresh()}
  />
))}
```

**Considerations:**
- Loses the status icon display (completed/due/overdue)
- May be too detailed for timeline view
- Better for detailed vaccination record page

### Option 2: Add Document Icon to Timeline (Recommended)
Keep the timeline card, add a document icon badge:

```jsx
function VaccineCard({ v, onOpen }) {
  const meta = STATUS_META[v.status];
  const Icon = meta.icon;
  const [documentsCount, setDocumentsCount] = useState(0);
  const [showDocs, setShowDocs] = useState(false);

  // Fetch document count for this vaccine
  useEffect(() => {
    if (v.record?.id) {
      api.get(`/vaccinations/${v.record.id}/documents`)
        .then(res => setDocumentsCount(res.data.length))
        .catch(() => setDocumentsCount(0));
    }
  }, [v.record?.id]);

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="card-soft hover-lift tap-scale p-4 flex items-start gap-3 text-left w-full cursor-pointer group relative"
      >
        {/* Document badge */}
        {documentsCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDocs(true);
            }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold grid place-items-center hover:bg-teal-700 transition-colors"
            title={`${documentsCount} document${documentsCount > 1 ? 's' : ''}`}
          >
            <FileText className="w-3 h-3" />
          </button>
        )}

        {/* Rest of the card */}
        <div className={`w-10 h-10 rounded-xl grid place-items-center ${meta.cls} shrink-0`}>
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
        {/* ... rest of content */}
      </button>

      {/* Document viewer */}
      {v.record?.id && (
        <VaccinationDocumentViewer
          isOpen={showDocs}
          onClose={() => setShowDocs(false)}
          vaccineId={v.record.id}
          canDelete={false}  // Parents view only in timeline
        />
      )}
    </>
  );
}
```

### Option 3: Dedicated Document Page
Create a new page showing detailed vaccine info with documents:

```jsx
// New page: VaccineDetailPage.jsx
import VaccineCardWithDocuments from '@/components/VaccineCardWithDocuments';

export default function VaccineDetailPage() {
  const { vaccineId } = useParams();
  const [vaccine, setVaccine] = useState(null);

  useEffect(() => {
    api.get(`/vaccinations/${vaccineId}`)
      .then(res => setVaccine(res.data));
  }, [vaccineId]);

  return (
    <AppShell showBack>
      <VaccineCardWithDocuments
        vaccine={vaccine}
        canUpload={isParent}
        onDocumentAdded={refresh}
      />
    </AppShell>
  );
}
```

## Implementation Details

### VaccineCardWithDocuments Props

```typescript
interface VaccineCardWithDocumentsProps {
  vaccine: {
    id: string;              // Required for API calls
    vaccine_name: string;    // Display name
    dose: string;            // e.g., "Dose 1", "Dose 2"
    date_given?: string;     // ISO date string
    weight_kg?: number;      // Child's weight at vaccination
    doctor_name?: string;
    clinic_name?: string;
    doctor_phone?: string;
    remarks?: string;
    documents?: Array<{
      id: string;
      document_url: string;
      document_type: string;
      file_name: string;
      uploaded_at: string;
    }>;
    is_historical?: boolean;
  };
  canUpload: boolean;        // Show upload button (parent only)
  onDocumentAdded?: (vaccineId: string) => void;  // Callback after upload
}
```

### Data Flow

1. **Load Vaccinations:**
   ```
   GET /children/{id}
   → { vaccinations: [...] }
   ```

2. **Fetch Documents:**
   ```
   GET /vaccinations/{vaccine_id}/documents
   → [{ id, document_url, ... }]
   ```

3. **Upload Document:**
   ```
   POST /parent/vaccinations/{vaccine_id}/upload-document
   → { id, document_url, ... }
   ```

4. **Delete Document:**
   ```
   DELETE /vaccination-documents/{doc_id}
   → { ok: true }
   ```

## Styling Integration

The component uses Shadcn UI components and matches the existing design:
- `Card` - Container
- `Badge` - Labels
- `Button` - Actions
- Tailwind CSS for styling
- Dark mode support included

## Permissions

### Parent
- ✅ Upload documents
- ✅ View own documents
- ✅ Delete own documents
- ✅ Can do this in ChildProfile page

### Doctor
- ✅ View documents (any child)
- ❌ Cannot upload
- ❌ Cannot delete
- ✅ Can view in DoctorChildRecord page

### Access Control
- Backend enforces all permissions via access checks
- Frontend hides upload/delete buttons when `canUpload={false}`
- API returns 403 if unauthorized

## Testing Checklist

- [ ] Parent can see upload button on own child
- [ ] Parent can upload from camera (mobile)
- [ ] Parent can upload from gallery (desktop/mobile)
- [ ] Thumbnail appears after upload
- [ ] Doctor can see documents (read-only)
- [ ] Doctor cannot upload
- [ ] Doctor cannot delete
- [ ] File validation works (image only, <5MB)
- [ ] Lightbox viewer works
- [ ] Download button works
- [ ] Delete button works (parent only)
- [ ] No documents message shows correctly

## Performance Notes

- Documents lazy-loaded per vaccine
- Thumbnails use image compression
- Lightbox loads full image on demand
- Upload uses FormData for multipart
- Network errors handled gracefully

## Browser Compatibility

- Camera access: iOS 13+, Android 5+
- Gallery access: All modern browsers
- Image display: All modern browsers
- Download: All modern browsers

## Troubleshooting

### Documents don't load
- Check browser console for errors
- Verify Supabase Storage bucket is public
- Check network tab for failed requests

### Upload fails
- Verify file is image (JPEG, PNG, WebP, GIF)
- Check file size < 5MB
- Check internet connection
- Look for 401/403 errors (permission denied)

### Image won't display
- Check image URL is accessible
- Verify CORS is enabled on Supabase
- Try refreshing browser/clearing cache

## Future Enhancements

- Batch upload multiple documents
- Image cropping before upload
- Document filtering/search
- Export all documents
- Integration with digital vaccination records
- Auto-rotation for mobile photos
