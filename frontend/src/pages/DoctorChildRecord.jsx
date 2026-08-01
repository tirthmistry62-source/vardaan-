import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "@/components/AppShell";
import VaccineInfoDialog from "@/components/VaccineInfoDialog";
import VaccinationDocumentViewer from "@/components/VaccinationDocumentViewer";
import UIPBadge from "@/components/UIPBadge";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Syringe, CheckCircle2, Clock, AlertTriangle, CalendarDays, User2, History, Info, ShieldAlert } from "lucide-react";
import { computeVaccineStatuses, completionPercent, ageString } from "@/lib/vaccineStatus";

const STATUS_META = {
  completed: { icon: CheckCircle2, cls: "status-completed", label: "Completed" },
  due:       { icon: Clock,        cls: "status-due",       label: "Due" },
  overdue:   { icon: AlertTriangle, cls: "status-overdue",   label: "Overdue" },
  upcoming:  { icon: CalendarDays, cls: "status-upcoming",   label: "Upcoming" },
};

export default function DoctorChildRecord() {
  const nav = useNavigate();
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [infoVaccine, setInfoVaccine] = useState(null);
  const [weightKg, setWeightKg] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [accessVerified, setAccessVerified] = useState(false);
  const [accessChecking, setAccessChecking] = useState(false);
  const [accessError, setAccessError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/children/${id}`);
      setChild(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const items = useMemo(() => child ? computeVaccineStatuses(child.dob, child.vaccinations) : [], [child]);
  const dueItems = items.filter(i => i.status === "due" || i.status === "overdue");
  const completedItems = items.filter(i => i.status === "completed");
  const upcomingItems = items.filter(i => i.status === "upcoming");
  const pct = child ? completionPercent(child.dob, child.vaccinations) : 0;

  const toggle = (code) => {
    const next = new Set(selected);
    next.has(code) ? next.delete(code) : next.add(code);
    setSelected(next);
  };

  const verifyAccess = async (e) => {
    e?.preventDefault();
    if (!/^\d{6}$/.test(accessCode)) return toast.error("Enter the 6-digit parent access code");
    setAccessChecking(true);
    setAccessError("");
    try {
      await api.post(`/doctor/children/${id}/verify-access-code`, { access_code: accessCode });
      setAccessVerified(true);
      toast.success("Access code verified");
    } catch (err) {
      setAccessVerified(false);
      setAccessError(err?.response?.data?.detail || "Invalid access code");
      toast.error(err?.response?.data?.detail || "Invalid access code");
    } finally {
      setAccessChecking(false);
    }
  };

  const save = async () => {
    if (!accessVerified) return toast.error("Verify the parent access code first");
    if (selected.size === 0) return toast.error("Select at least one vaccine");
    const w = parseFloat(weightKg);
    if (!weightKg || isNaN(w) || w <= 0 || w > 200) return toast.error("Enter the child's current weight in kg");
    setSaving(true);
    try {
      const entries = items.filter(i => selected.has(i.code)).map(i => ({
        vaccine_code: i.code, vaccine_name: i.name, dose: i.dose, remarks: "",
      }));
      const { data } = await api.post("/doctor/vaccinations", { child_id: id, weight_kg: w, entries, access_code: accessCode });
      setSuccess({ count: data.created.length, names: data.created.map(x => `${x.vaccine_name} (${x.dose})`) });
      setSelected(new Set());
      setWeightKg("");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AppShell><Skeleton className="h-40 rounded-2xl" /></AppShell>;
  if (!child) return <AppShell><div className="card-soft p-8 text-center text-slate-600 dark:text-slate-400">Child not found.</div></AppShell>;

  return (
    <AppShell showBack backTo="/doctor/dashboard">
      <button data-testid="back-btn" onClick={() => nav(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to search
      </button>

      <div className="card-soft p-6 sm:p-8">
        {!accessVerified ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-900/30">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-100 p-2 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-lg text-slate-900 dark:text-slate-100">Parent access required</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Enter the six-digit code shared by the linked mother or father before you can record vaccinations for {child.name}.</p>
                <form onSubmit={verifyAccess} className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Input
                    data-testid="doc-access-code"
                    inputMode="numeric"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="h-11 rounded-xl sm:max-w-[220px]"
                  />
                  <Button type="submit" disabled={accessChecking} className="h-11 rounded-full bg-teal-700 hover:bg-teal-800 text-white px-5">
                    {accessChecking ? "Verifying…" : "Verify access"}
                  </Button>
                </form>
                {accessError && <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{accessError}</p>}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-sky-500 grid place-items-center text-white">
                <User2 className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-display tracking-tight text-slate-900 dark:text-slate-100">{child.name}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{child.gender} • {ageString(child.dob)} • DOB {new Date(child.dob).toLocaleDateString("en-IN")}{child.weight_kg != null ? ` • ${child.weight_kg} kg` : ""}</p>
              </div>
              <div className="sm:text-right">
                <div className="text-3xl font-display text-teal-700 dark:text-teal-300">{pct}%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">complete</div>
              </div>
            </div>
            <Progress value={pct} className="h-2 mt-6" />
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-lg bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-3 py-2 text-center">
                <div className="font-display text-lg leading-none">{completedItems.length}</div>
                <div className="text-xs mt-1">Completed</div>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-3 py-2 text-center">
                <div className="font-display text-lg leading-none">{dueItems.length}</div>
                <div className="text-xs mt-1">Due / Overdue</div>
              </div>
              <div className="rounded-lg bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 px-3 py-2 text-center">
                <div className="font-display text-lg leading-none">{upcomingItems.length}</div>
                <div className="text-xs mt-1">Upcoming</div>
              </div>
            </div>
          </>
        )}
      </div>

      {accessVerified && (
        <>
          <div className="mt-6"><UIPBadge variant="card" /></div>

          <Tabs defaultValue="due" className="mt-8">
            <TabsList data-testid="doc-tabs" className="rounded-full h-11 bg-slate-100 dark:bg-slate-800 p-1">
              <TabsTrigger value="due" data-testid="tab-due" className="rounded-full px-4 h-9 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">Due & Overdue ({dueItems.length})</TabsTrigger>
              <TabsTrigger value="history" data-testid="tab-history" className="rounded-full px-4 h-9 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">History ({completedItems.length})</TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all" className="rounded-full px-4 h-9 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">All ({items.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="due" className="mt-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select the vaccines you&apos;re administering today. Parents will be notified instantly. Tap the info icon on any card to see vaccine details.</p>
              <VaccineList items={dueItems} selected={selected} onToggle={toggle} onInfo={setInfoVaccine} emptyText="No due or overdue vaccines. Great work!" selectable />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                <History className="w-4 h-4" /> Past vaccinations already recorded for {child.name}.
              </div>
              <VaccineList items={completedItems} selected={selected} onToggle={toggle} onInfo={setInfoVaccine} emptyText="No vaccinations recorded yet." />
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Complete UIP schedule — completed, due, overdue, and upcoming.</p>
              <VaccineList items={items} selected={selected} onToggle={toggle} onInfo={setInfoVaccine} emptyText="No schedule." selectable />
            </TabsContent>
          </Tabs>

          {selected.size > 0 && (
            <div className="sticky bottom-4 mt-8 z-30">
              <div className="card-soft p-4 shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-sm flex-1">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{selected.size} vaccine{selected.size > 1 ? "s" : ""} selected</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Parents will be notified instantly.</div>
                  </div>
                  <div className="flex-1 sm:max-w-[200px]">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      Weight now <span className="text-rose-500 dark:text-rose-400">*</span>
                    </label>
                    <div className="mt-1 flex items-stretch rounded-xl border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-teal-500 dark:ring-teal-400/20 focus-within:border-teal-600 overflow-hidden bg-white dark:bg-slate-900">
                      <Input
                        data-testid="doc-weight-input"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        placeholder="e.g. 4.5"
                        className="flex-1 h-11 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                      />
                      <span className="px-3 flex items-center bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border-l border-slate-200 dark:border-slate-800 select-none text-sm">kg</span>
                    </div>
                  </div>
                  <Button data-testid="doc-record-submit" onClick={save} disabled={saving || !weightKg} className="h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white px-6 gap-2 self-stretch sm:self-auto">
                    <Syringe className="w-4 h-4" />
                    {saving ? "Recording…" : "Record"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={!!success} onOpenChange={(o) => { if (!o) setSuccess(null); }}>
        <DialogContent className="rounded-3xl max-w-sm p-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-teal-50 dark:bg-teal-900/40 grid place-items-center">
            <svg className="check-svg" width="56" height="56" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="26" stroke="#0F766E" strokeWidth="3" fill="none" />
              <path d="M18 31l9 9 16-19" stroke="#0F766E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-center mt-4">Recorded</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {success?.count} vaccine{success?.count > 1 ? "s" : ""} saved to {child.name}&apos;s record.
          </p>
          <ul className="mt-3 text-sm text-slate-700 dark:text-slate-300 space-y-1">
            {success?.names?.map((n, i) => <li key={i}>• {n}</li>)}
          </ul>
          <DialogFooter className="mt-6">
            <Button data-testid="doc-success-close" onClick={() => setSuccess(null)} className="w-full h-11 rounded-full bg-teal-700 hover:bg-teal-800 text-white">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <VaccineInfoDialog
        vaccine={infoVaccine}
        open={!!infoVaccine}
        onOpenChange={(o) => { if (!o) setInfoVaccine(null); }}
      />
    </AppShell>
  );
}


function VaccineList({ items, selected, onToggle, onInfo, emptyText, selectable = false }) {
  const [selectedVaccineForDocuments, setSelectedVaccineForDocuments] = useState(null);
  const [documentsForViewing, setDocumentsForViewing] = useState([]);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);

  const handleViewDocuments = async (v) => {
    if (!v.record?.id) return;
    try {
      const { data } = await api.get(`/vaccinations/${v.record.id}/documents`);
      setDocumentsForViewing(data);
      setSelectedVaccineForDocuments(v);
      setShowDocumentViewer(true);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  if (items.length === 0) {
    return <div className="card-soft p-6 text-center text-slate-500 dark:text-slate-400">{emptyText}</div>;
  }
  return (
    <>
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
          
          // Document count for viewing
          const documentCount = v.record?.documents?.length || 0;

          return (
            <div
              key={v.code}
              data-testid={`doc-vaccine-${v.code}`}
              className={`card-soft p-4 flex items-start gap-3 relative ${checked ? "ring-2 ring-teal-500 border-teal-500 dark:border-teal-400" : ""}`}
            >
              {/* Document button - positioned bottom-left */}
              {v.record && documentCount > 0 && (
                <button
                  type="button"
                  onClick={() => handleViewDocuments(v)}
                  className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold grid place-items-center shadow-sm z-10 transition-all"
                  title={`${documentCount} document(s) uploaded`}
                  aria-label={`View ${documentCount} vaccination document(s)`}
                >
                  📄
                  {documentCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-teal-600 text-[10px] font-bold rounded-full w-5 h-5 grid place-items-center">
                      {documentCount}
                    </span>
                  )}
                </button>
              )}

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
                {isCompleted && v.record && (
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    Dr. {v.record.doctor_name} <span className="text-slate-400 dark:text-slate-500">• {v.record.clinic_name}</span>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Document viewer modal for doctors */}
      {showDocumentViewer && documentsForViewing.length > 0 && (
        <VaccinationDocumentViewer
          isOpen={showDocumentViewer}
          onClose={() => setShowDocumentViewer(false)}
          documents={documentsForViewing}
          initialIndex={0}
          canDelete={false}
          canUploadMore={false}
        />
      )}
    </>
  );
}
