import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "@/components/AppShell";
import VaccineInfoDialog from "@/components/VaccineInfoDialog";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Pencil, CheckCircle2, Clock, AlertTriangle, CalendarDays, User2, Stethoscope, Info } from "lucide-react";
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
      <div className="flex items-center justify-end mb-4">
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
        <h2 className="text-xl font-display tracking-tight text-slate-900 dark:text-slate-100">Vaccination timeline</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">India Universal Immunization Programme schedule</p>

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
  const dateLabel = v.record
    ? `Given on ${new Date(v.record.date_given).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
    : `Due ${v.dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
  return (
    <button
      type="button"
      data-testid={`vaccine-${v.code}`}
      onClick={onOpen}
      className="card-soft hover-lift tap-scale p-4 flex items-start gap-3 text-left w-full cursor-pointer group"
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
  );
}
