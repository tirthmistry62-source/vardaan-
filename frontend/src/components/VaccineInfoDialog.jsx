import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getVaccineInfo } from "@/lib/vaccineInfo";
import UIPBadge from "@/components/UIPBadge";
import { Shield, HeartPulse, Info, Sparkles, CheckCircle2, Clock, AlertTriangle, CalendarDays, Stethoscope } from "lucide-react";
import { useTranslation } from "react-i18next";

const STATUS_META = {
  completed: { cls: "status-completed", key: "completed", icon: CheckCircle2 },
  due: { cls: "status-due", key: "due", icon: Clock },
  overdue: { cls: "status-overdue", key: "overdue", icon: AlertTriangle },
  upcoming: { cls: "status-upcoming", key: "upcoming", icon: CalendarDays },
};


export default function VaccineInfoDialog({ vaccine, open, onOpenChange }) {
    const { t, i18n } = useTranslation();
  if (!vaccine) return null;
  const info = getVaccineInfo(vaccine.name, i18n.language);
  const meta = STATUS_META[vaccine.status];
  const StatusIcon = meta.icon;
 const dateLine = vaccine.record
  ? t("vaccineInfo.givenOn", {
      date: new Date(vaccine.record.date_given).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    })
  : t("vaccineInfo.dueOn", {
      date: vaccine.dueDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    });

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
                <Badge className={`${meta.cls} border-0 rounded-full`}>
  {t(`doctorChildRecord.status.${meta.key}`)}
</Badge>
                <UIPBadge />
                <span className="text-xs text-slate-600 dark:text-slate-400">{dateLine}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {info ? (
            <>
              <InfoBlock icon={Info} tint="teal" title={t("vaccineInfo.fullForm")}>
                <p className="text-slate-700 dark:text-slate-300 text-sm">{info.fullForm}</p>
              </InfoBlock>

              <InfoBlock icon={Shield} tint="sky" title={t("vaccineInfo.protectsAgainst")}>
                <p className="text-slate-700 dark:text-slate-300 text-sm">{info.protectsAgainst}</p>
              </InfoBlock>

              <InfoBlock icon={HeartPulse} tint="rose" title={t("vaccineInfo.whatItDoes")}>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{info.purpose}</p>
              </InfoBlock>

              <InfoBlock icon={Sparkles} tint="amber" title={t("vaccineInfo.whyChildNeedsIt")}>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{info.whyNeeded}</p>
              </InfoBlock>

              {info.keyFacts?.length > 0 && (
                <InfoBlock icon={CheckCircle2} tint="teal" title={t("vaccineInfo.goodToKnow")}>
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
            <p className="text-sm text-slate-500 dark:text-slate-400">
  {t("vaccineInfo.informationUnavailable")}
</p>
          )}

          {vaccine.record && (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">
                <Stethoscope className="w-3.5 h-3.5" /> {t("vaccineInfo.recordedBy")}
              </div>
              <div className="mt-2 text-slate-900 dark:text-slate-100 font-semibold">Dr. {vaccine.record.doctor_name}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{vaccine.record.clinic_name}</div>
              {vaccine.record.clinic_address && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{vaccine.record.clinic_address}</div>
              )}
              {vaccine.record.weight_kg != null && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
  {t("vaccineInfo.weightAtVisit")}
</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{vaccine.record.weight_kg} kg</span>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2 leading-relaxed">
  <span className="font-semibold text-slate-700 dark:text-slate-300">
    {t("vaccineInfo.source")}:
  </span>{" "}
  {t("vaccineInfo.medicalAdvice")}
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
