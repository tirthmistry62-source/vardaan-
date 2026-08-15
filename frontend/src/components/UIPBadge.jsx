import { BadgeCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * UIPBadge — a small pill that clearly credits the vaccination schedule
 * to India's Universal Immunization Programme (UIP).
 * Two variants: compact (default) and card (larger, with subtitle).
 */
export default function UIPBadge({
  variant = "compact",
  className = "",
}) {
  const { t } = useTranslation();

  if (variant === "card") {
    return (
      <div
        data-testid="uip-source-card"
        className={`rounded-2xl border border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900/30 dark:to-sky-900/30 p-4 flex items-start gap-3 ${className}`}
      >
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 grid place-items-center text-teal-700 dark:text-teal-300 shrink-0 shadow-sm">
          <BadgeCheck
            className="w-5 h-5"
            strokeWidth={1.75}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              {t("childProfile.uipSource")}
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-600 dark:bg-teal-500 text-white">
              {t("childProfile.official")}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {t("childProfile.timelineDisclaimer")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <span
      data-testid="uip-source-pill"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-semibold ${className}`}
    >
      <BadgeCheck
        className="w-3.5 h-3.5"
        strokeWidth={2}
      />
      {t("childProfile.uipSchedule")}
    </span>
  );
}