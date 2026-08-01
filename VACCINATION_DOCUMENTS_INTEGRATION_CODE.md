# Integration Code - Add Document Upload to Child Profiles

Complete code snippets for integrating vaccination document upload into your pages.

## Prerequisites

- Database schema created in Supabase (see VACCINATION_DOCUMENTS_QUICK_START.md Step 2)
- Storage bucket created in Supabase (see VACCINATION_DOCUMENTS_QUICK_START.md Step 1)
- Backend running with upload/get/delete endpoints

## Option A: Timeline-Based Child Profile (Recommended)

Add document icon badge to existing timeline without replacing components.

**File:** `frontend/src/pages/ChildProfile.jsx`

Replace the `VaccineCard` function at the bottom with:

```jsx
import { FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import VaccinationDocumentViewer from '@/components/VaccinationDocumentViewer';

function VaccineCard({ v, onOpen }) {
  const meta = STATUS_META[v.status];
  const Icon = meta.icon;
  const dateLabel = v.record
    ? `Given on ${new Date(v.record.date_given).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
    : `Due ${v.dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;

  // Document viewing
  const [documentsCount, setDocumentsCount] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [showDocuments, setShowDocuments] = useState(false);
  const [docLoading, setDocLoading] = useState(false);

  useEffect(() => {
    if (v.record?.id) {
      (async () => {
        try {
          const { data } = await api.get(`/vaccinations/${v.record.id}/documents`);
          setDocuments(data);
          setDocumentsCount(data.length);
        } catch (e) {
          setDocumentsCount(0);
        }
      })();
    }
  }, [v.record?.id]);

  const handleViewDocuments = (e) => {
    e.stopPropagation();
    setShowDocuments(true);
  };

  return (
    <>
      <button
        type="button"
        data-testid={`vaccine-${v.code}`}
        onClick={onOpen}
        className="card-soft hover-lift tap-scale p-4 flex items-start gap-3 text-left w-full cursor-pointer group relative"
      >
        {/* Document badge */}
        {documentsCount > 0 && (
          <button
            onClick={handleViewDocuments}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold grid place-items-center hover:bg-teal-700 transition-colors shadow-sm"
            title={`${documentsCount} document${documentsCount > 1 ? 's' : ''}`}
            aria-label={`View ${documentsCount} vaccination document(s)`}
          >
            <FileText className="w-3 h-3" />
          </button>
        )}

        <div className={`w-10 h-10 rounded-xl grid place-items-center ${meta.cls} shrink-0`}>
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
              {v.name}
              <Info className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 transition-colors" />
            </div>
            <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${meta.cls}`}>{meta.label}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{v.dose} • {dateLabel}</div>
          {v.record && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <Stethoscope className="w-3.5 h-3.5" />
              Dr. {v.record.doctor_name} <span className="text-slate-400 dark:text-slate-500">• {v.record.clinic_name}</span>
            </div>
          )}
        </div>
      </button>

      {/* Document viewer modal */}
      <VaccinationDocumentViewer
        isOpen={showDocuments}
        onClose={() => setShowDocuments(false)}
        documents={documents}
        initialIndex={0}
        canDelete={false}  // Read-only in timeline view
      />
    </>
  );
}
```

**What this does:**
- Shows a document badge (top-right) if documents exist
- Click badge to view documents in lightbox
- Preserves original timeline card appearance
- No breaking changes to existing code

---

## Option B: Detailed Vaccine Card (Full Featured)

Replace vaccine rendering with full document management component.

**File:** `frontend/src/pages/ChildProfile.jsx`

At the top, add imports:

```jsx
import VaccineCardWithDocuments from '@/components/VaccineCardWithDocuments';
import { getSession } from '@/lib/api';
```

Then replace the timeline rendering:

```jsx
// In ChildProfile component
const session = getSession();
const isParent = session?.role === 'parent';

// In the render section, replace the VaccineCard rendering with:
<div className="mt-6 space-y-10">
  {MILESTONES.filter(m => grouped[m]).map((ms) => (
    <div key={ms} className="relative pl-14">
      <div className="timeline-rail" />
      <h3 className="text-lg font-display text-slate-800 dark:text-slate-200 relative">
        <span className="absolute -left-14 top-0 node-dot bg-white border-teal-600 text-teal-700 dark:text-teal-300 font-bold text-sm">
          {ms.split(" ")[0]}
        </span>
        {ms}
      </h3>
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        {grouped[ms].map((v) => {
          // Convert timeline vaccine format to card format
          const vaccineData = {
            id: v.record?.id || `${child.id}-${v.code}`,
            vaccine_name: v.name,
            dose: v.dose,
            date_given: v.record?.date_given,
            weight_kg: v.record?.weight_kg,
            doctor_name: v.record?.doctor_name,
            clinic_name: v.record?.clinic_name,
            doctor_phone: v.record?.clinic_phone,
            remarks: v.record?.remarks,
            documents: v.record?.documents || [],
          };

          return (
            <VaccineCardWithDocuments
              key={v.code}
              vaccine={vaccineData}
              canUpload={isParent && !!v.record}  // Upload only for recorded vaccines
              onDocumentAdded={() => {
                // Refresh child data to update documents
                load(); 
              }}
            />
          );
        })}
      </div>
    </div>
  ))}
</div>
```

Add a `load()` function if not already present:

```jsx
const load = async () => {
  try {
    const { data } = await api.get(`/children/${id}`);
    setChild(data);
  } catch (e) {
    console.error('Failed to load child:', e);
  }
};
```

**What this does:**
- Replaces timeline cards with detailed vaccine cards
- Shows full vaccine details and doctor info
- Upload button for parents (recorded vaccines only)
- Lightbox viewer for documents
- Download and delete capabilities (parents only)

---

## Option C: Doctor's Child Record Page

Add read-only document viewing to doctor's interface.

**File:** `frontend/src/pages/DoctorChildRecord.jsx`

At the top, add imports:

```jsx
import VaccineCardWithDocuments from '@/components/VaccineCardWithDocuments';
```

Find the `VaccineList` function and replace it with:

```jsx
function VaccineList({ items, selected, onToggle, onInfo, emptyText, selectable = false }) {
  if (items.length === 0) {
    return <div className="card-soft p-6 text-center text-slate-500 dark:text-slate-400">{emptyText}</div>;
  }
  
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {items.map(v => {
        const meta = STATUS_META[v.status];
        const Icon = meta.icon;
        const isCompleted = v.status === "completed";
        const checked = selected.has(v.code);
        const showCheckbox = selectable && !isCompleted;
        const dateLabel = isCompleted && v.record
          ? `Given ${new Date(v.record.date_given).toLocaleDateString("en-IN")}`
          : `Due ${v.dueDate.toLocaleDateString("en-IN")}`;

        // For completed vaccines, show with documents
        if (isCompleted && v.record) {
          const vaccineData = {
            id: v.record.id,
            vaccine_name: v.name,
            dose: v.dose,
            date_given: v.record.date_given,
            weight_kg: v.record.weight_kg,
            doctor_name: v.record.doctor_name,
            clinic_name: v.record.clinic_name,
            remarks: v.record.remarks,
            documents: v.record.documents || [],
          };

          return (
            <VaccineCardWithDocuments
              key={v.code}
              vaccine={vaccineData}
              canUpload={false}  // Doctor can't upload
            />
          );
        }

        // For non-completed vaccines, use original checkbox card
        return (
          <div
            key={v.code}
            data-testid={`doc-vaccine-${v.code}`}
            className={`card-soft p-4 flex items-start gap-3 ${checked ? "ring-2 ring-teal-500 border-teal-500 dark:border-teal-400" : ""}`}
          >
            {showCheckbox && (
              <Checkbox
                data-testid={`doc-check-${v.code}`}
                checked={checked}
                onCheckedChange={() => onToggle(v.code)}
                className="mt-1"
              />
            )}
            <div className={`w-10 h-10 rounded-xl grid place-items-center ${meta.cls} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <button
              type="button"
              onClick={() => onInfo(v)}
              data-testid={`doc-info-${v.code}`}
              className="flex-1 min-w-0 text-left cursor-pointer group"
              aria-label={`View info about ${v.name}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                  {v.name}
                  <Info className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 transition-colors" />
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${meta.cls}`}>{meta.label}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{v.dose} • {v.milestone} • {dateLabel}</div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
```

**What this does:**
- Shows full vaccine cards for completed vaccines (with documents)
- Shows checkbox cards for vaccines to be recorded
- Doctors can view documents (read-only)
- Cannot upload or delete documents
- Maintains existing workflow

---

## Testing Checklist

After integration, test the following:

### Parent View (ChildProfile)
- [ ] Document badge shows when documents exist
- [ ] Clicking badge opens lightbox
- [ ] Can navigate between documents
- [ ] Download button works
- [ ] Upload button appears (if using Option B)
- [ ] Upload from camera works (mobile)
- [ ] Upload from gallery works (desktop/mobile)
- [ ] File validation works (<5MB, image only)
- [ ] Documents persist after page reload
- [ ] Delete button works (if using Option B)

### Doctor View (DoctorChildRecord)
- [ ] Can see document badge on completed vaccines
- [ ] Can view documents in lightbox
- [ ] Cannot upload (no button)
- [ ] Cannot delete (no button)
- [ ] Download button works
- [ ] Can still record new vaccines (checkboxes work)
- [ ] History tab shows documents

### Error Cases
- [ ] Large file (>5MB) shows error
- [ ] Non-image file shows error
- [ ] Network error handled gracefully
- [ ] 403 permission denied shows error
- [ ] Empty documents state shows correct message

---

## Deployment Steps

1. **Run database migration:**
   ```sql
   -- In Supabase Dashboard → SQL Editor
   -- Paste content from backend/supabase_schema.sql
   ```

2. **Create storage bucket:**
   - Supabase Dashboard → Storage
   - New bucket: `vaccination-documents` (public)

3. **Deploy backend:**
   ```bash
   cd backend
   # Ensure server.py has upload/get/delete endpoints
   uvicorn server:app --reload --port 8001
   ```

4. **Deploy frontend:**
   ```bash
   cd frontend
   npm run build
   # Deploy to your hosting
   ```

5. **Test in production:**
   - Login as parent
   - Upload a document
   - Login as doctor
   - View document
   - Verify download works

---

## Troubleshooting

### Documents not loading
```jsx
// Add this to debug
useEffect(() => {
  if (v.record?.id) {
    api.get(`/vaccinations/${v.record.id}/documents`)
      .then(res => console.log('Documents:', res.data))
      .catch(err => console.error('Load failed:', err));
  }
}, [v.record?.id]);
```

### Upload button not showing
- Check `canUpload={true}` is passed
- Check `v.record` exists (vaccine must be recorded)
- Check user role is 'parent'

### Images not displaying
- Check Supabase Storage bucket is public
- Check document_url is valid
- Check CORS settings

---

## Performance Optimization

If experiencing slow loads with many documents:

```jsx
// Lazy load documents only when expanded
const [expanded, setExpanded] = useState(false);
const [documents, setDocuments] = useState([]);

useEffect(() => {
  if (expanded && v.record?.id && documents.length === 0) {
    api.get(`/vaccinations/${v.record.id}/documents`)
      .then(res => setDocuments(res.data));
  }
}, [expanded, v.record?.id]);
```

---

## Migration from Old Code

If replacing existing vaccine cards:

1. Remove old `VaccineCard` component
2. Import `VaccineCardWithDocuments`
3. Update props to match new format
4. Test each feature before deploying
5. Keep old component as backup until verified

---

## Support

For issues:
1. Check VACCINATION_DOCUMENTS_SETUP.md for troubleshooting
2. Review browser console for errors
3. Check network tab for failed requests
4. Verify Supabase configuration
5. Check user permissions (role-based access)
