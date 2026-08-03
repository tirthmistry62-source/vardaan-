import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "@/components/AppShell";
import VaccineInfoDialog from "@/components/VaccineInfoDialog";
import UIPBadge from "@/components/UIPBadge";
import VaccinationDocumentViewer from "@/components/VaccinationDocumentViewer";
import VaccinationDocumentUpload from "@/components/VaccinationDocumentUpload";
import { api, getSession } from "@/lib/api";
import { useVaccinationDocuments } from "@/hooks/useVaccinationDocuments";
import { generateVaccinationPDF } from "@/lib/generateVaccinationPDF";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Pencil, CheckCircle2, Clock, AlertTriangle, CalendarDays, User2, Stethoscope, Info, FileText, FileDown, Loader2 } from "lucide-react";
import { computeVaccineStatuses, completionPercent, ageString } from "@/lib/vaccineStatus";
import { MILESTONES } from "@/lib/vaccineSchedule";

const STATUS_META = {
  completed: { icon: CheckCircle2, cls: "status-completed", label: "Completed", nodeCls: "done" },
  due:       { icon: Clock,        cls: "status-due",       label: "Due",       nodeCls: "due" },
  overdue:   { icon: AlertTriangle, cls: "status-overdue",   label: "Overdue",   nodeCls: "over" },
  upcoming:  { icon: CalendarDays, cls: "status-upcoming",   label: "Upcoming",  nodeCls: "" },
};

export default function ChildProfile() {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const session = getSession();
  const isParent = session?.role === "parent";

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/children/${id}`);
        setChild(data);
      } catch (e) {
        setChild(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleExportPDF = async () => {
    if (!child) return;
    setPdfLoading(true);
    try {
      const parents = [];
      try {
        const { data: me } = await api.get("/parent/me");
        const relation = child.mother_aadhaar === me.aadhaar ? "Mother" : "Father";
        parents.push({ full_name: me.full_name, phone: me.phone, relation });

        // Fetch co-parent using the dedicated endpoint
        const coAadhaar = relation === "Mother" ? child.father_aadhaar : child.mother_aadhaar;
        if (coAadhaar) {
          try {
            const { data: co } = await api.get(`/parent/co-parent?aadhaar=${coAadhaar}`);
            const coRelation = relation === "Mother" ? "Father" : "Mother";
            parents.push({ full_name: co.full_name, phone: co.phone, relation: coRelation });
          } catch (_) {
            // co-parent not registered — skip silently
          }
        }
      } catch (_) {
        // parent/me failed — proceed without parent info
      }

      const doc = await generateVaccinationPDF({ child, parents });

      // Save + open preview in new tab
      const pdfName = `${child.name.replace(/\s+/g, "_")}_Vaccination_Record.pdf`;
      doc.save(pdfName);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const items = useMemo(() => child ? computeVaccineStatuses(child.dob, child.vaccinations) : [], [child]);
  const grouped = useMemo(() => {
    const g = {};
    items.forEach(i => { (g[i.milestone] ||= []).push(i); });
    return g;
  }, [items]);

  const pct = child ? completionPercent(child.dob, child.vaccinations) : 0;
  const counts = useMemo(() => ({
    completed: items.filter(i => i.status === "completed").length,
    due:       items.filter(i => i.status === "due").length,
    overdue:   items.filter(i => i.status === "overdue").length,
    upcoming:  items.filter(i => i.status === "upcoming").length,
  }), [items]);

  if (loading) {
    return <AppShell showBack backTo="/parent/dashboard"><Skeleton className="h-40 rounded-2xl" /><div className="mt-6 space-y-4">{[0,1,2].map(i=><Skeleton key={i} className="h-24 rounded-2xl" />)}</div></AppShell>;
  }
  if (!child) {
    return <AppShell showBack backTo="/parent/dashboard"><div className="card-soft p-8 text-center text-slate-600 dark:text-slate-400">Child not found.</div></AppShell>;
  }

  return (
    <AppShell showNotifications showBack backTo="/parent/dashboard">
      <div className="flex items-center justify-end gap-3 mb-4">
        {isParent && (
          <Button
            onClick={handleExportPDF}
            disabled={pdfLoading}
            variant="outline"
            size="sm"
            className="gap-2 border-teal-600 text-teal-700 dark:text-teal-300 dark:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30"
          >
            {pdfLoading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              : <><FileDown className="w-4 h-4" /> Export PDF</>
            }
          </Button>
        )}
        <Link
          to={`/parent/child/${child.id}/edit`}
          data-testid="edit-child-link"
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 dark:text-teal-300 hover:underline"
        >
          <Pencil className="w-4 h-4" /> Edit child
        </Link>
      </div>

      {/* Header */}
      <div className="card-soft p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-sky-500 grid place-items-center text-white shrink-0">
            <User2 className="w-10 h-10" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">{child.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{child.gender} • {ageString(child.dob)} • Born {new Date(child.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}{child.weight_kg != null ? ` • ${child.weight_kg} kg` : ""}</p>
          </div>
          <div className="sm:text-right">
            <div className="text-4xl font-display text-teal-700 dark:text-teal-300">{pct}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 -mt-1">complete</div>
          </div>
        </div>
        <div className="mt-6">
          <Progress value={pct} className="h-2.5" />
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatChip icon={CheckCircle2} label="Completed" value={counts.completed} tint="teal" />
          <StatChip icon={Clock}        label="Due"       value={counts.due}       tint="amber" />
          <StatChip icon={AlertTriangle} label="Overdue"  value={counts.overdue}   tint="rose" />
          <StatChip icon={CalendarDays} label="Upcoming"  value={counts.upcoming}  tint="sky" />
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div>
            <h2 className="text-xl font-display tracking-tight text-slate-900 dark:text-slate-100">Vaccination timeline</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Every dose your child needs, from birth to 16 years.</p>
          </div>
          <UIPBadge />
        </div>

        <UIPBadge variant="card" className="mt-4" />

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
                {grouped[ms].map((v) => <VaccineCard key={v.code} v={v} onOpen={() => setSelectedVaccine(v)} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <VaccineInfoDialog
        vaccine={selectedVaccine}
        open={!!selectedVaccine}
        onOpenChange={(o) => { if (!o) setSelectedVaccine(null); }}
      />
    </AppShell>
  );
}

function StatChip({ icon: Icon, label, value, tint }) {
  const map = {
    teal: "bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300",
    amber: "bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    rose: "bg-rose-50 dark:bg-rose-900/40 text-rose-700",
    sky: "bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300",
  };
  return (
    <div className={`rounded-xl px-4 py-3 ${map[tint]} flex items-center gap-3`}>
      <Icon className="w-5 h-5" strokeWidth={1.75} />
      <div>
        <div className="text-lg font-display leading-none">{value}</div>
        <div className="text-xs opacity-80 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function VaccineCard({ v, onOpen }) {
  const meta = STATUS_META[v.status];
  const Icon = meta.icon;
  const MAX_DOCUMENTS = 2;
  const dateLabel = v.record
    ? `Given on ${new Date(v.record.date_given).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
    : `Due ${v.dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;

  // Document viewing/uploading state
  const [documentsCount, setDocumentsCount] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadDocument, deleteDocument } = useVaccinationDocuments();

  // Load documents for this vaccine
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
    
    // If has documents, show viewer first (user can close and upload more)
    if (documentsCount > 0) {
      setShowDocuments(true);
    } 
    // If can still upload more, show upload dialog
    else if (canUploadMore) {
      setShowUpload(true);
    }
  };

  const handleUploadDocument = async (file) => {
    try {
      // Check if limit reached
      if (documentsCount >= MAX_DOCUMENTS) {
        alert(`You can upload maximum ${MAX_DOCUMENTS} documents per vaccine`);
        return false;
      }

      setIsUploading(true);
      const result = await uploadDocument(v.record.id, file, 'photo');
      if (result) {
        // Refresh documents
        const { data } = await api.get(`/vaccinations/${v.record.id}/documents`);
        setDocuments(data);
        setDocumentsCount(data.length);
        setShowUpload(false);
        return true;
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
    return false;
  };

  const canUploadMore = documentsCount < MAX_DOCUMENTS;

  const handleDeleteDocument = async (docId) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteDocument(docId);
      
      // Refresh documents
      const { data } = await api.get(`/vaccinations/${v.record.id}/documents`);
      setDocuments(data);
      setDocumentsCount(data.length);
      
      // Auto-close viewer if no more documents
      if (data.length === 0) {
        setShowDocuments(false);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete document. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="card-soft hover-lift tap-scale p-4 flex items-start gap-3 text-left w-full group relative">
        {/* Document button - positioned bottom-left */}
        {v.record && (
          <button
            type="button"
            onClick={handleViewDocuments}
            disabled={!canUploadMore && documentsCount === 0}
            className={`absolute bottom-2 left-2 w-8 h-8 rounded-full text-white text-xs font-bold grid place-items-center shadow-sm z-10 transition-all ${
              documentsCount > 0 || canUploadMore
                ? 'bg-teal-600 hover:bg-teal-700 hover:opacity-80 cursor-pointer' 
                : 'bg-slate-300 cursor-not-allowed opacity-50'
            }`}
            title={
              canUploadMore
                ? `Upload document (${documentsCount}/${MAX_DOCUMENTS})`
                : documentsCount > 0
                ? `View documents (${documentsCount}/${MAX_DOCUMENTS})`
                : `Maximum ${MAX_DOCUMENTS} documents reached`
            }
            aria-label={
              canUploadMore
                ? `Upload vaccine document`
                : documentsCount > 0
                ? `View vaccination documents`
                : `Maximum documents limit reached`
            }
          >
            <FileText className="w-4 h-4" />
            {documentsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-teal-600 text-[10px] font-bold rounded-full w-5 h-5 grid place-items-center">
                {documentsCount}
              </span>
            )}
          </button>
        )}

        <button
          type="button"
          data-testid={`vaccine-${v.code}`}
          onClick={onOpen}
          className="flex items-start gap-3 text-left w-full cursor-pointer relative flex-1"
        >
          <div className={`w-10 h-10 rounded-xl grid place-items-center ${meta.cls} shrink-0`}>
            <Icon className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                {v.name}
                <Info className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 transition-colors" />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${meta.cls} shrink-0`}>{meta.label}</span>
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
      </div>

      {/* Document viewer modal */}
      <VaccinationDocumentViewer
        isOpen={showDocuments}
        onClose={() => setShowDocuments(false)}
        documents={documents}
        initialIndex={0}
        canDelete={true}
        onDelete={handleDeleteDocument}
        isDeleting={isDeleting}
        canUploadMore={canUploadMore}
        onUploadMore={() => {
          setShowDocuments(false);
          setShowUpload(true);
        }}
      />

      {/* Document upload modal */}
      <VaccinationDocumentUpload
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUploadDocument}
        vaccineeName={v.name}
        maxDocuments={MAX_DOCUMENTS}
        currentDocuments={documentsCount}
        isUploading={isUploading}
      />
    </>
  );
}
