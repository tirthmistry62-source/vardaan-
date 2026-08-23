import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import {
  Pencil,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CalendarDays,
  User2,
  Stethoscope,
  Info,
  FileText,
  FileDown,
  Loader2,
} from "lucide-react";
import {
  computeVaccineStatuses,
  completionPercent,
  ageString,
} from "@/lib/vaccineStatus";
import { MILESTONES } from "@/lib/vaccineSchedule";

const STATUS_META = {
  completed: {
    icon: CheckCircle2,
    cls: "status-completed",
    label: "completed",
    nodeCls: "done",
  },
  due: {
    icon: Clock,
    cls: "status-due",
    label: "due",
    nodeCls: "due",
  },
  overdue: {
    icon: AlertTriangle,
    cls: "status-overdue",
    label: "overdue",
    nodeCls: "over",
  },
  upcoming: {
    icon: CalendarDays,
    cls: "status-upcoming",
    label: "upcoming",
    nodeCls: "",
  },
};

export default function ChildProfile() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [vaccineToAdd, setVaccineToAdd] = useState(null);
  const [showAddVaccineForm, setShowAddVaccineForm] = useState(false);
  const [closingVaccineForm, setClosingVaccineForm] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [closingSaveSuccess, setClosingSaveSuccess] = useState(false);

  const [addVaccineForm, setAddVaccineForm] = useState({
    dateTaken: "",
    doctorName: "",
    weight: "",
    document: null,
  });

  const [pdfLoading, setPdfLoading] = useState(false);

  const session = getSession();
  const isParent = session?.role === "parent";

  const localeMap = {
    en: "en-IN",
    hi: "hi-IN",
    mr: "mr-IN",
    gu: "gu-IN",
  };

  const currentLocale = localeMap[i18n.language] || "en-IN";

  const closeVaccineForm = () => {
    setClosingVaccineForm(true);

    setTimeout(() => {
      setShowAddVaccineForm(false);
      setVaccineToAdd(null);
      setClosingVaccineForm(false);
    }, 180);
  };

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

        const relation =
          child.mother_aadhaar === me.aadhaar
            ? "Mother"
            : "Father";

        parents.push({
          full_name: me.full_name,
          phone: me.phone,
          relation,
        });

        const coAadhaar =
          relation === "Mother"
            ? child.father_aadhaar
            : child.mother_aadhaar;

        if (coAadhaar) {
          try {
            const { data: co } = await api.get(
              `/parent/co-parent?aadhaar=${coAadhaar}`
            );

            const coRelation =
              relation === "Mother" ? "Father" : "Mother";

            parents.push({
              full_name: co.full_name,
              phone: co.phone,
              relation: coRelation,
            });
          } catch (_) {
            // co-parent not registered — skip silently
          }
        }
      } catch (_) {
        // parent/me failed — proceed without parent info
      }

      const doc = await generateVaccinationPDF({
        child,
        parents,
      });

      const pdfName = `${child.name.replace(
        /\s+/g,
        "_"
      )}_Vaccination_Record.pdf`;

      doc.save(pdfName);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert(t("childProfile.pdfGenerationFailed"));
    } finally {
      setPdfLoading(false);
    }
  };

  const items = useMemo(
    () =>
      child
        ? computeVaccineStatuses(
            child.dob,
            child.vaccinations
          )
        : [],
    [child]
  );

  const grouped = useMemo(() => {
    const g = {};

    items.forEach((i) => {
      (g[i.milestone] ||= []).push(i);
    });

    return g;
  }, [items]);

  const pct = child
    ? completionPercent(
        child.dob,
        child.vaccinations
      )
    : 0;

  const counts = useMemo(
    () => ({
      completed: items.filter(
        (i) => i.status === "completed"
      ).length,
      due: items.filter(
        (i) => i.status === "due"
      ).length,
      overdue: items.filter(
        (i) => i.status === "overdue"
      ).length,
      upcoming: items.filter(
        (i) => i.status === "upcoming"
      ).length,
    }),
    [items]
  );

  const translateAge = (dob) => {
    const age = ageString(dob);

    if (!age || i18n.language === "en") {
      return age;
    }

    return age
      .replace(/\byears\b/gi, () => {
        if (i18n.language === "hi") return "वर्ष";
        if (i18n.language === "mr") return "वर्षे";
        if (i18n.language === "gu") return "વર્ષ";
        return "years";
      })
      .replace(/\byear\b/gi, () => {
        if (i18n.language === "hi") return "वर्ष";
        if (i18n.language === "mr") return "वर्ष";
        if (i18n.language === "gu") return "વર્ષ";
        return "year";
      })
      .replace(/\bmonths\b/gi, () => {
        if (i18n.language === "hi") return "महीने";
        if (i18n.language === "mr") return "महिने";
        if (i18n.language === "gu") return "મહિના";
        return "months";
      })
      .replace(/\bmonth\b/gi, () => {
        if (i18n.language === "hi") return "महीना";
        if (i18n.language === "mr") return "महिना";
        if (i18n.language === "gu") return "મહિનો";
        return "month";
      })
      .replace(/\bdays\b/gi, () => {
        if (i18n.language === "hi") return "दिन";
        if (i18n.language === "mr") return "दिवस";
        if (i18n.language === "gu") return "દિવસ";
        return "days";
      })
      .replace(/\bday\b/gi, () => {
        if (i18n.language === "hi") return "दिन";
        if (i18n.language === "mr") return "दिवस";
        if (i18n.language === "gu") return "દિવસ";
        return "day";
      });
  };

  if (loading) {
    return (
      <AppShell
        showBack
        backTo="/parent/dashboard"
      >
        <Skeleton className="h-40 rounded-2xl" />

        <div className="mt-6 space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              className="h-24 rounded-2xl"
            />
          ))}
        </div>
      </AppShell>
    );
  }

  if (!child) {
    return (
      <AppShell
        showBack
        backTo="/parent/dashboard"
      >
        <div className="card-soft p-8 text-center text-slate-600 dark:text-slate-400">
          {t("childProfile.childNotFound")}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      showNotifications
      showBack
      backTo="/parent/dashboard"
    >
      <div className="flex items-center justify-end gap-3 mb-4">
        {isParent && (
          <Button
            onClick={handleExportPDF}
            disabled={pdfLoading}
            variant="outline"
            size="sm"
            className="gap-2 border-teal-600 text-teal-700 dark:text-teal-300 dark:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30"
          >
            {pdfLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("childProfile.generating")}
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                {t("childProfile.exportPdf")}
              </>
            )}
          </Button>
        )}

        <Link
          to={`/parent/child/${child.id}/edit`}
          data-testid="edit-child-link"
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 dark:text-teal-300 hover:underline"
        >
          <Pencil className="w-4 h-4" />
          {t("childProfile.editChild")}
        </Link>
      </div>

      {/* Header */}
      <div className="card-soft p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-teal-100/50 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-sky-500 grid place-items-center text-white shrink-0">
            <User2
              className="w-10 h-10"
              strokeWidth={1.5}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">
              {child.name}
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {child.gender} •{" "}
              {translateAge(child.dob)} •{" "}
              {t("childProfile.born")}{" "}
              {new Date(
                child.dob
              ).toLocaleDateString(
                currentLocale,
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
              {child.weight_kg != null
                ? ` • ${child.weight_kg} kg`
                : ""}
            </p>
          </div>

          <div className="sm:text-right">
            <div className="text-4xl font-display text-teal-700 dark:text-teal-300">
              {pct}%
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
              {t("childProfile.complete")}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Progress
            value={pct}
            className="h-2.5"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatChip
            icon={CheckCircle2}
            label={t("childProfile.status.completed")}
            value={counts.completed}
            tint="teal"
          />

          <StatChip
            icon={Clock}
            label={t("childProfile.status.due")}
            value={counts.due}
            tint="amber"
          />

          <StatChip
            icon={AlertTriangle}
            label={t("childProfile.status.overdue")}
            value={counts.overdue}
            tint="rose"
          />

          <StatChip
            icon={CalendarDays}
            label={t("childProfile.status.upcoming")}
            value={counts.upcoming}
            tint="sky"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div>
            <h2 className="text-xl font-display tracking-tight text-slate-900 dark:text-slate-100">
              {t("childProfile.vaccinationTimeline")}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t("childProfile.timelineDescription")}
            </p>
          </div>

          <UIPBadge />
        </div>

        <UIPBadge
          variant="card"
          className="mt-4"
        />

        <div className="mt-6 space-y-10">
          {MILESTONES.filter(
            (m) => grouped[m]
          ).map((ms) => (
            <div
              key={ms}
              className="relative pl-14"
            >
              <div className="timeline-rail" />

              <h3 className="text-lg font-display text-slate-800 dark:text-slate-200 relative">
                <span className="absolute -left-14 top-0 node-dot bg-white border-teal-600 text-teal-700 dark:text-teal-300 font-bold text-sm">
                  {ms.split(" ")[0]}
                </span>

                {ms}
              </h3>

              <div className="grid md:grid-cols-2 gap-3 mt-4">
                {grouped[ms].map((v) => (
                  <VaccineCard
                    key={v.code}
                    v={v}
                    isParent={isParent}
                    onOpen={() =>
                      setSelectedVaccine(v)
                    }
                    onAdd={() => {
                      setVaccineToAdd(v);
                      setShowAddVaccineForm(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <VaccineInfoDialog
        vaccine={selectedVaccine}
        open={!!selectedVaccine}
        onOpenChange={(o) => {
          if (!o) setSelectedVaccine(null);
        }}
      />

      {showSaveSuccess && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/20 backdrop-blur-[2px]">
          <div
            className={`save-success-card w-64 rounded-2xl bg-white dark:bg-slate-900 p-7 shadow-xl text-center ${
              closingSaveSuccess
                ? "closing"
                : ""
            }`}
          >
            <svg
              viewBox="0 0 64 64"
              className="w-16 h-16 mx-auto"
              fill="none"
            >
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="3"
                className="text-teal-600 save-success-circle"
              />

              <path
                d="M20 33l8 8 16-18"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-teal-600 save-success-check"
              />
            </svg>

            <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t("childProfile.recordSaved")}
            </p>
          </div>
        </div>
      )}

      {showAddVaccineForm &&
        vaccineToAdd && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div
              className={`vaccine-form-card w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl ${
                closingVaccineForm
                  ? "closing"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-display text-slate-900 dark:text-slate-100">
                    {t("childProfile.addVaccinationRecord")}
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {vaccineToAdd.name} •{" "}
                    {vaccineToAdd.dose}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeVaccineForm}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("childProfile.dateTaken")}
                    <span className="ml-1 text-rose-500 dark:text-rose-400" aria-hidden="true">*</span>
                  </label>

                  <input
                    type="date"
                    value={
                      addVaccineForm.dateTaken
                    }
                    onChange={(e) =>
                      setAddVaccineForm(
                        (prev) => ({
                          ...prev,
                          dateTaken:
                            e.target.value,
                        })
                      )
                    }
                    className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("childProfile.doctorName")}
                    <span className="ml-1 text-rose-500 dark:text-rose-400" aria-hidden="true">*</span>
                  </label>

                  <input
                    type="text"
                    value={
                      addVaccineForm.doctorName
                    }
                    onChange={(e) =>
                      setAddVaccineForm(
                        (prev) => ({
                          ...prev,
                          doctorName:
                            e.target.value,
                        })
                      )
                    }
                    placeholder={t(
                      "childProfile.doctorNamePlaceholder"
                    )}
                    className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("childProfile.weightAtThatTime")}{" "}
                    <span className="text-slate-400">
                      ({t("childProfile.optional")})
                    </span>
                  </label>

                  <input
                    type="number"
                    value={
                      addVaccineForm.weight
                    }
                    onChange={(e) =>
                      setAddVaccineForm(
                        (prev) => ({
                          ...prev,
                          weight:
                            e.target.value,
                        })
                      )
                    }
                    placeholder={t(
                      "childProfile.weightPlaceholder"
                    )}
                    className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("childProfile.vaccinationDocument")}{" "}
                    <span className="text-slate-400">
                      ({t("childProfile.optional")})
                    </span>
                  </label>

                  <input
                    type="file"
                    onChange={(e) =>
                      setAddVaccineForm(
                        (prev) => ({
                          ...prev,
                          document:
                            e.target.files?.[0] ||
                            null,
                        })
                      )
                    }
                    className="w-full text-sm text-slate-600 dark:text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-700"
                  />
                </div>

                <button
                  type="button"
                  onClick={async () => {
  if (
    !addVaccineForm.dateTaken ||
    !addVaccineForm.doctorName.trim()
  ) {
    alert(t("childProfile.dateAndDoctorRequired"));
    return;
  }

  try {
    const { data } = await api.post(
      "/parent/vaccinations",
      {
        child_id: child.id,
        vaccine_code: vaccineToAdd.code,
        vaccine_name: vaccineToAdd.name,
        dose: vaccineToAdd.dose,
        date_given: addVaccineForm.dateTaken,
        weight_kg: addVaccineForm.weight
          ? Number(addVaccineForm.weight)
          : null,
        doctor_name: addVaccineForm.doctorName.trim(),
      }
    );

    console.log("Parent vaccination created:", data);

    closeVaccineForm();

    setTimeout(() => {
      setShowSaveSuccess(true);

      setTimeout(() => {
        setClosingSaveSuccess(true);

        setTimeout(() => {
          setShowSaveSuccess(false);
          setClosingSaveSuccess(false);

          window.location.reload();
        }, 180);
      }, 1800);
    }, 180);
  } catch (err) {
    console.error(
      "Parent vaccination creation failed:",
      err
    );

    alert(
      err?.response?.data?.detail ||
        t("childProfile.saveVaccinationFailed")
    );
  }
}}
                  className="w-full rounded-lg bg-teal-600 text-white py-2.5 font-medium hover:bg-teal-700"
                >
                  {t("childProfile.addVaccination")}
                </button>
              </div>
            </div>
          </div>
        )}
    </AppShell>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  tint,
}) {
  const map = {
    teal:
      "bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300",
    amber:
      "bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    rose:
      "bg-rose-50 dark:bg-rose-900/40 text-rose-700",
    sky:
      "bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300",
  };

  return (
    <div
      className={`rounded-xl px-4 py-3 ${map[tint]} flex items-center gap-3`}
    >
      <Icon
        className="w-5 h-5"
        strokeWidth={1.75}
      />

      <div>
        <div className="text-lg font-display leading-none">
          {value}
        </div>

        <div className="text-xs opacity-80 mt-0.5">
          {label}
        </div>
      </div>
    </div>
  );
}

function VaccineCard({
  v,
  isParent,
  onOpen,
  onAdd,
}) {
  const { t, i18n } = useTranslation();

  const meta = STATUS_META[v.status];
  const Icon = meta.icon;
  const MAX_DOCUMENTS = 2;

  const localeMap = {
    en: "en-IN",
    hi: "hi-IN",
    mr: "mr-IN",
    gu: "gu-IN",
  };

  const currentLocale =
    localeMap[i18n.language] || "en-IN";

  const dateLabel = v.record
    ? t("childProfile.givenOn", {
        date: new Date(
          v.record.date_given
        ).toLocaleDateString(
          currentLocale,
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        ),
      })
    : t("childProfile.dueOn", {
        date: v.dueDate.toLocaleDateString(
          currentLocale,
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        ),
      });

  const [
    documentsCount,
    setDocumentsCount,
  ] = useState(0);

  const [
    documents,
    setDocuments,
  ] = useState([]);

  const [
    showDocuments,
    setShowDocuments,
  ] = useState(false);

  const [
    showUpload,
    setShowUpload,
  ] = useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [isUploading, setIsUploading] =
    useState(false);

  const {
    uploadDocument,
    deleteDocument,
  } = useVaccinationDocuments();

  useEffect(() => {
    if (v.record?.id) {
      (async () => {
        try {
          const { data } = await api.get(
            `/vaccinations/${v.record.id}/documents`
          );

          setDocuments(data);
          setDocumentsCount(
            data.length
          );
        } catch (e) {
          setDocumentsCount(0);
        }
      })();
    }
  }, [v.record?.id]);

  const canUploadMore =
    documentsCount < MAX_DOCUMENTS;

  const handleViewDocuments = (e) => {
    e.stopPropagation();

    if (documentsCount > 0) {
      setShowDocuments(true);
    } else if (canUploadMore) {
      setShowUpload(true);
    }
  };

  const handleUploadDocument = async (
    file
  ) => {
    try {
      if (
        documentsCount >=
        MAX_DOCUMENTS
      ) {
        alert(
          t(
            "childProfile.maxDocumentsAlert",
            {
              count: MAX_DOCUMENTS,
            }
          )
        );
        return false;
      }

      setIsUploading(true);

      const result =
        await uploadDocument(
          v.record.id,
          file,
          "photo"
        );

      if (result) {
        const { data } = await api.get(
          `/vaccinations/${v.record.id}/documents`
        );

        setDocuments(data);
        setDocumentsCount(
          data.length
        );
        setShowUpload(false);

        return true;
      }
    } catch (err) {
      console.error(
        "Upload failed:",
        err
      );
    } finally {
      setIsUploading(false);
    }

    return false;
  };

  const handleDeleteDocument = async (
    docId
  ) => {
    if (
      !confirm(
        t(
          "childProfile.deleteDocumentConfirm"
        )
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteDocument(docId);

      const { data } = await api.get(
        `/vaccinations/${v.record.id}/documents`
      );

      setDocuments(data);
      setDocumentsCount(
        data.length
      );

      if (data.length === 0) {
        setShowDocuments(false);
      }
    } catch (err) {
      console.error(
        "Delete failed:",
        err
      );

      alert(
        t(
          "childProfile.deleteDocumentFailed"
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="card-soft hover-lift tap-scale p-4 flex items-start gap-3 text-left w-full group relative">
        {isParent &&
          v.status !== "completed" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="absolute top-10 right-3 w-8 h-8 rounded-full border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 grid place-items-center transition-colors z-10"
              aria-label={t(
                "childProfile.addVaccineAria",
                {
                  name: v.name,
                }
              )}
              title={t(
                "childProfile.addVaccineAria",
                {
                  name: v.name,
                }
              )}
            >
              <span className="text-lg leading-none font-medium">
                +
              </span>
            </button>
          )}

        {v.record && (
          <button
            type="button"
            onClick={handleViewDocuments}
            disabled={
              !canUploadMore &&
              documentsCount === 0
            }
            className={`absolute bottom-2 left-2 w-8 h-8 rounded-full text-white text-xs font-bold grid place-items-center shadow-sm z-10 transition-all ${
              documentsCount > 0 ||
              canUploadMore
                ? "bg-teal-600 hover:bg-teal-700 hover:opacity-80 cursor-pointer"
                : "bg-slate-300 cursor-not-allowed opacity-50"
            }`}
            title={
              canUploadMore
                ? t(
                    "childProfile.uploadDocumentTitle",
                    {
                      count:
                        documentsCount,
                      max: MAX_DOCUMENTS,
                    }
                  )
                : documentsCount > 0
                ? t(
                    "childProfile.viewDocumentsTitle",
                    {
                      count:
                        documentsCount,
                      max: MAX_DOCUMENTS,
                    }
                  )
                : t(
                    "childProfile.maximumDocumentsReached",
                    {
                      count: MAX_DOCUMENTS,
                    }
                  )
            }
            aria-label={
              canUploadMore
                ? t(
                    "childProfile.uploadVaccineDocument"
                  )
                : documentsCount > 0
                ? t(
                    "childProfile.viewVaccinationDocuments"
                  )
                : t(
                    "childProfile.documentsLimitReached"
                  )
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
          <div
            className={`w-10 h-10 rounded-xl grid place-items-center ${meta.cls} shrink-0`}
          >
            <Icon
              className="w-5 h-5"
              strokeWidth={1.75}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                {v.name}

                <Info className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 transition-colors" />
              </div>

              <span
                className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${meta.cls} shrink-0`}
              >
                {t(
                  `childProfile.status.${meta.label}`
                )}
              </span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {v.dose} • {dateLabel}
            </div>

            {v.record && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <Stethoscope className="w-3.5 h-3.5" />

                {t("childProfile.doctorPrefix")}{" "}
                {v.record.doctor_name}

                <span className="text-slate-400 dark:text-slate-500">
                  • {v.record.clinic_name}
                </span>
              </div>
            )}
          </div>
        </button>
      </div>

      <VaccinationDocumentViewer
        isOpen={showDocuments}
        onClose={() =>
          setShowDocuments(false)
        }
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

      <VaccinationDocumentUpload
        isOpen={showUpload}
        onClose={() =>
          setShowUpload(false)
        }
        onUpload={handleUploadDocument}
        vaccineeName={v.name}
        maxDocuments={MAX_DOCUMENTS}
        currentDocuments={documentsCount}
        isUploading={isUploading}
      />
    </>
  );
}
