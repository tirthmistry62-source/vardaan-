import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { api, getSession } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, User2, Baby, ArrowRight, Loader2 } from "lucide-react";
import { ageString, maskAadhaar } from "@/lib/vaccineStatus";
import { useTranslation } from "react-i18next";

export default function DoctorDashboard() {
  const nav = useNavigate();
  const session = getSession();
  const { t } = useTranslation();
  const [aadhaar, setAadhaar] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const search = async (e) => {
    e.preventDefault();
    if (!/^\d{12}$/.test(aadhaar)) return toast.error(t("doctorDashboard.invalidAadhaar"));
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.get(`/doctor/search?aadhaar=${aadhaar}`);
      setResult(data);
    } catch (err) {
      toast.error(err?.response?.data?.detail || t("doctorDashboard.noRecordFound"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell settingsPath="/doctor/settings">
      <div className="mb-6">
        <p className="text-slate-500 dark:text-slate-400 text-sm">{t("doctorDashboard.signedInAs")}</p>
        <h1 className="text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100 mt-1">
  Dr. {session?.user?.doctor_name}
</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{session?.user?.clinic_name}</p>
      </div>

      <form onSubmit={search} className="card-soft p-6 sm:p-8">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
  {t("doctorDashboard.searchByAadhaar")}
</label>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              data-testid="doc-search-input"
              inputMode="numeric"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
              placeholder={t("doctorDashboard.aadhaarPlaceholder")}
              className="h-14 rounded-2xl pl-12 text-base"
            />
          </div>
          <Button data-testid="doc-search-submit" type="submit" disabled={loading} className="h-14 rounded-2xl px-8 bg-sky-700 hover:bg-sky-800 text-white gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4" /> {t("doctorDashboard.search")}</>}
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          {t("doctorDashboard.autoDetectInfo")}
        </p>
      </form>

      {result && (
        <div className="mt-8">
          {result.match_type === "parent" ? (
            <>
              <div className="card-soft p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 grid place-items-center">
                  <User2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-display text-lg text-slate-900 dark:text-slate-100">{result.parent.full_name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">  {t("doctorDashboard.parent")} • {maskAadhaar(result.parent.aadhaar)}
</div>
                </div>
              </div>
              <h2 className="mt-8 text-lg font-display tracking-tight text-slate-800 dark:text-slate-200">
  {t("doctorDashboard.linkedChildren")}
</h2>
              {result.children.length === 0 ? (
                <div className="card-soft p-8 mt-4 text-center text-slate-500 dark:text-slate-400">{t("doctorDashboard.noChildren")}</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {result.children.map(c => {
                    const parentRole = c.mother_aadhaar === aadhaar ? "mother" : c.father_aadhaar === aadhaar ? "father" : null;
                    const parentName = result.parent?.full_name || "linked parent";
                    return <ChildResultCard
  key={c.id}
  c={c}
  t={t}
  onOpen={() => nav(`/doctor/child/${c.id}`, { state: { parentRole, parentName } })}
/>;
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-lg font-display tracking-tight text-slate-800 dark:text-slate-200">
  {t("doctorDashboard.child")}
</h2>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {result.children.map(c => (
  <ChildResultCard
    key={c.id}
    c={c}
    t={t}
    onOpen={() => nav(`/doctor/child/${c.id}`, { state: { parentRole: null, parentName: null } })}
  />
))}
              </div>
            </>
          )}
        </div>
      )}
    </AppShell>
  );
}

function ChildResultCard({ c, onOpen, t }) {
  return (
    <button data-testid={`doc-child-result-${c.id}`} onClick={onOpen} className="card-soft hover-lift p-5 text-left w-full flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-100 to-sky-100 text-teal-700 dark:text-teal-300 grid place-items-center">
        <Baby className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-lg text-slate-900 dark:text-slate-100 truncate">{c.name}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{t(`gender.${c.gender.toLowerCase()}`)} • {ageString(c.dob)}</div>
      </div>  
      <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
    </button>
  );
}
