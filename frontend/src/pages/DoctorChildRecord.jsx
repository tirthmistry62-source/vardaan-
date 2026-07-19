import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, Syringe, CheckCircle2, Clock, AlertTriangle, CalendarDays, User2 } from "lucide-react";
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
  const [showAll, setShowAll] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/children/${id}`);
      setChild(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const items = useMemo(() => child ? computeVaccineStatuses(child.dob, child.vaccinations) : [], [child]);
  const dueItems = items.filter(i => i.status === "due" || i.status === "overdue");
  const visible = showAll ? items.filter(i => i.status !== "completed") : dueItems;
  const pct = child ? completionPercent(child.dob, child.vaccinations) : 0;

  const toggle = (code) => {
    const next = new Set(selected);
    next.has(code) ? next.delete(code) : next.add(code);
    setSelected(next);
  };

  const save = async () => {
    if (selected.size === 0) return toast.error("Select at least one vaccine");
    setSaving(true);
    try {
      const entries = items.filter(i => selected.has(i.code)).map(i => ({
        vaccine_code: i.code, vaccine_name: i.name, dose: i.dose, remarks: "",
      }));
      const { data } = await api.post("/doctor/vaccinations", { child_id: id, entries });
      setSuccess({ count: data.created.length, names: data.created.map(x => `${x.vaccine_name} (${x.dose})`) });
      setSelected(new Set());
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AppShell><Skeleton className="h-40 rounded-2xl" /></AppShell>;
  if (!child) return <AppShell><div className="card-soft p-8 text-center text-slate-600">Child not found.</div></AppShell>;

  return (
    <AppShell>
      <button data-testid="back-btn" onClick={() => nav(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to search
      </button>

      <div className="card-soft p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-sky-500 grid place-items-center text-white">
            <User2 className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-display tracking-tight text-slate-900">{child.name}</h1>
            <p className="text-slate-500 text-sm mt-1">{child.gender} • {ageString(child.dob)} • DOB {new Date(child.dob).toLocaleDateString("en-IN")}</p>
          </div>
          <div className="sm:text-right">
            <div className="text-3xl font-display text-teal-700">{pct}%</div>
            <div className="text-xs text-slate-500">complete</div>
          </div>
        </div>
        <Progress value={pct} className="h-2 mt-6" />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display text-slate-900">{showAll ? "All pending vaccines" : "Due & overdue"}</h2>
          <p className="text-sm text-slate-500 mt-1">Select the vaccines you're administering today.</p>
        </div>
        <button data-testid="toggle-show-all" onClick={() => setShowAll(v => !v)} className="text-sm text-sky-700 hover:underline font-medium">
          {showAll ? "Show only due" : "Show all pending"}
        </button>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-3">
        {visible.length === 0 && (
          <div className="col-span-full card-soft p-6 text-center text-slate-500">
            No {showAll ? "pending" : "due"} vaccines. Great work!
          </div>
        )}
        {visible.map(v => {
          const meta = STATUS_META[v.status];
          const Icon = meta.icon;
          const checked = selected.has(v.code);
          return (
            <label
              key={v.code}
              data-testid={`doc-vaccine-${v.code}`}
              className={`card-soft p-4 flex items-start gap-3 cursor-pointer ${checked ? "ring-2 ring-teal-500 border-teal-500" : ""}`}
            >
              <Checkbox data-testid={`doc-check-${v.code}`} checked={checked} onCheckedChange={() => toggle(v.code)} className="mt-1" />
              <div className={`w-10 h-10 rounded-xl grid place-items-center ${meta.cls}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900 truncate">{v.name}</div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${meta.cls}`}>{meta.label}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{v.dose} • {v.milestone} • Due {v.dueDate.toLocaleDateString("en-IN")}</div>
              </div>
            </label>
          );
        })}
      </div>

      {selected.size > 0 && (
        <div className="sticky bottom-4 mt-8 z-30">
          <div className="card-soft p-4 flex items-center justify-between shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
            <div className="text-sm">
              <div className="font-semibold text-slate-900">{selected.size} vaccine{selected.size > 1 ? "s" : ""} selected</div>
              <div className="text-xs text-slate-500">Parents will be notified instantly.</div>
            </div>
            <Button data-testid="doc-record-submit" onClick={save} disabled={saving} className="h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white px-6 gap-2">
              <Syringe className="w-4 h-4" />
              {saving ? "Recording…" : "Record"}
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!success} onOpenChange={(o) => { if (!o) setSuccess(null); }}>
        <DialogContent className="rounded-3xl max-w-sm p-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-teal-50 grid place-items-center">
            <svg className="check-svg" width="56" height="56" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="26" stroke="#0F766E" strokeWidth="3" fill="none" />
              <path d="M18 31l9 9 16-19" stroke="#0F766E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-center mt-4">Recorded</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            {success?.count} vaccine{success?.count > 1 ? "s" : ""} saved to {child.name}'s record.
          </p>
          <ul className="mt-3 text-sm text-slate-700 space-y-1">
            {success?.names?.map((n, i) => <li key={i}>• {n}</li>)}
          </ul>
          <DialogFooter className="mt-6">
            <Button data-testid="doc-success-close" onClick={() => setSuccess(null)} className="w-full h-11 rounded-full bg-teal-700 hover:bg-teal-800 text-white">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
