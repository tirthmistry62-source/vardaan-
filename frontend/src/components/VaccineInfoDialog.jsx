import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getVaccineInfo } from "@/lib/vaccineInfo";
import { Shield, HeartPulse, Info, Sparkles, CheckCircle2, Clock, AlertTriangle, CalendarDays, Stethoscope } from "lucide-react";

const STATUS_META = {
  completed: { cls: "status-completed", label: "Completed", icon: CheckCircle2 },
  due:       { cls: "status-due",       label: "Due",       icon: Clock },
  overdue:   { cls: "status-overdue",   label: "Overdue",   icon: AlertTriangle },
  upcoming:  { cls: "status-upcoming",  label: "Upcoming",  icon: CalendarDays },
};

export default function VaccineInfoDialog({ vaccine, open, onOpenChange }) {
  if (!vaccine) return null;
  const info = getVaccineInfo(vaccine.name);
  const meta = STATUS_META[vaccine.status];
  const StatusIcon = meta.icon;
  const dateLine = vaccine.record
    ? `Given on ${new Date(vaccine.record.date_given).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`
    : `Due on ${vaccine.dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="vaccine-info-dialog"
        className="rounded-3xl max-w-lg p-0 overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 pb-5 bg-gradient-to-br from-teal-50 to-sky-50 dark:from-teal-900/40 dark:to-sky-900/40 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-2xl grid place-items-center ${meta.cls} shrink-0`}>
              <StatusIcon className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <DialogHeader className="text-left space-y-1">
                <DialogTitle className="font-display text-2xl text-slate-900 dark:text-slate-100 leading-tight">
                  {vaccine.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-600 dark:text-slate-400">
                  {vaccine.dose} • {vaccine.milestone}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className={`${meta.cls} border-0 rounded-full`}>{meta.label}</Badge>
                <span className="text-xs text-slate-600 dark:text-slate-400">{dateLine}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {info ? (
            <>
              <InfoBlock icon={Info} tint="teal" title="Full form">
                <p className="text-slate-700 dark:text-slate-300 text-sm">{info.fullForm}</p>
              </InfoBlock>

              <InfoBlock icon={Shield} tint="sky" title="Protects against">
                <p className="text-slate-700 dark:text-slate-300 text-sm">{info.protectsAgainst}</p>
              </InfoBlock>

              <InfoBlock icon={HeartPulse} tint="rose" title="What it does">
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{info.purpose}</p>
              </InfoBlock>

              <InfoBlock icon={Sparkles} tint="amber" title="Why your child needs it">
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{info.whyNeeded}</p>
              </InfoBlock>

              {info.keyFacts?.length > 0 && (
                <InfoBlock icon={CheckCircle2} tint="teal" title="Good to know">
                  <ul className="text-slate-700 dark:text-slate-300 text-sm space-y-1.5">
                    {info.keyFacts.map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-teal-600 shrink-0">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </InfoBlock>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Detailed information for this vaccine is not available yet.</p>
          )}

          {vaccine.record && (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">
                <Stethoscope className="w-3.5 h-3.5" /> Recorded by
              </div>
              <div className="mt-2 text-slate-900 dark:text-slate-100 font-semibold">Dr. {vaccine.record.doctor_name}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{vaccine.record.clinic_name}</div>
              {vaccine.record.clinic_address && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{vaccine.record.clinic_address}</div>
              )}
              {vaccine.record.weight_kg != null && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Weight at visit</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{vaccine.record.weight_kg} kg</span>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-slate-400 dark:text-slate-500 text-center pt-2">
            Information based on India&apos;s Universal Immunization Programme guidelines. Always consult your paediatrician for medical advice.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoBlock({ icon: Icon, tint, title, children }) {
  const tints = {
    teal: "bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300",
    sky: "bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300",
    rose: "bg-rose-50 dark:bg-rose-900/40 text-rose-700",
    amber: "bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  };
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-7 h-7 rounded-lg grid place-items-center ${tints[tint]}`}>
          <Icon className="w-4 h-4" strokeWidth={1.75} />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      </div>
      <div className="pl-9">{children}</div>
    </div>
  );
}
