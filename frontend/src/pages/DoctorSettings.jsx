import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { api, clearSession, getSession, setSession } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Stethoscope, Trash2, ShieldAlert, Loader2, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

const DELETE_PHRASE = "DELETE MY ACCOUNT";

export default function DoctorSettings() {
  const nav = useNavigate();
  const session = getSession();
  const { i18n, t } = useTranslation();
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ doctor_name: "", phone: "", clinic_name: "", clinic_address: "" });
  const [saving, setSaving] = useState(false);

  const [warnOpen, setWarnOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/doctor/me");
      setMe(data);
      if (data.language) {
  await i18n.changeLanguage(data.language);
}
      setForm({
        doctor_name: data.doctor_name || "",
        phone: data.phone || "",
        clinic_name: data.clinic_name || "",
        clinic_address: data.clinic_address || "",
      });
    })();
  }, [i18n]);

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    const updates = {};
    if (form.doctor_name.trim() && form.doctor_name.trim() !== me.doctor_name) updates.doctor_name = form.doctor_name.trim();
    if (form.phone !== me.phone) {
      if (!/^\d{7,15}$/.test(form.phone)) return toast.error(t("doctorSettings.invalidPhone"));
      updates.phone = form.phone;
    }
    if (form.clinic_name.trim() !== me.clinic_name) updates.clinic_name = form.clinic_name.trim();
    if (form.clinic_address.trim() !== me.clinic_address) updates.clinic_address = form.clinic_address.trim();
    if (i18n.language !== me.language) updates.language = i18n.language;
    if (Object.keys(updates).length === 0) return toast.success("Profile updated");
    setSaving(true);
    try {
      const { data } = await api.patch("/doctor/me", updates);
      setMe(data);
      setSession({ token: session.token, role: "doctor", user: data });
      toast.success(t("doctorSettings.profileUpdated"));
    } catch (err) {
      toast.error(t("doctorSettings.invalidPhone"));
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (phrase.trim() !== DELETE_PHRASE) return toast.error(t("doctorSettings.typeExactly", { phrase: DELETE_PHRASE }));
    setDeleting(true);
    try {
      await api.post("/doctor/me/delete", { confirm_phrase: phrase.trim() });
      clearSession();
      toast.success(t("doctorSettings.accountDeleted"));
      nav("/select-role", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || t("doctorSettings.deleteFailed"));
    } finally {
      setDeleting(false);
    }
  };

  if (!me) return <AppShell showBack backTo="/doctor/dashboard">{t("doctorSettings.loading")}</AppShell>;

  return (
    <AppShell showBack backTo="/doctor/dashboard">
      <div className="max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 grid place-items-center">
            <Stethoscope className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">
  {t("profileSettings")}
</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Dr. {me.doctor_name}</p>
          </div>
        </div>

        <form onSubmit={save} className="card-soft p-6 grid gap-5">
          <h2 className="font-display text-lg text-slate-900 dark:text-slate-100">
  {t("accountDetails")}
</h2>

          <div>
            <Label required>{t("doctorSettings.doctorName")}</Label>
            <div className="mt-2 flex items-stretch rounded-xl border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-teal-500 dark:ring-teal-400/20 focus-within:border-teal-600 overflow-hidden bg-white dark:bg-slate-900">
              <span className="px-4 flex items-center bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border-r border-slate-200 dark:border-slate-800 select-none">Dr.</span>
              <Input
                data-testid="dr-settings-name"
                value={form.doctor_name}
                onChange={upd("doctor_name")}
                placeholder={t("doctorSettings.doctorNamePlaceholder")}
                className="flex-1 h-12 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
  {t("doctorSettings.doctorNameDescription")}
</p>
          </div>

          <div>
            <Label required>{t("phoneNumber")}</Label>
            <Input
              data-testid="dr-settings-phone"
              inputMode="numeric"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 15) })}
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label required>{t("doctorSettings.clinicName")}</Label>
            <Input data-testid="dr-settings-clinic" value={form.clinic_name} onChange={upd("clinic_name")} className="mt-2 h-12 rounded-xl" />
          </div>

          <div>
            <Label required>{t("doctorSettings.clinicAddress")}</Label>
            <Textarea data-testid="dr-settings-address" value={form.clinic_address} onChange={upd("clinic_address")} rows={3} className="mt-2 rounded-xl" />
          </div>

          <Button data-testid="dr-settings-save" type="submit" disabled={saving} className="h-12 rounded-full bg-sky-700 hover:bg-sky-800 text-white">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t("saveChanges")}
          </Button>
        </form>

        <div className="card-soft p-6 mt-8">
  <h2 className="font-display text-lg text-slate-900 dark:text-slate-100">
    {t("session")}
  </h2>

  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
    {t("signOutDescription")}
  </p>

  <Button
    onClick={() => {
      clearSession();
      nav("/select-role", { replace: true });
    }}
    variant="outline"
    className="mt-4 rounded-full gap-2"
  >
    <LogOut className="w-4 h-4" />
{t("logout")}
    
  </Button>
</div>

        <div className="card-soft p-6 mt-8 border-rose-200 dark:border-rose-900/60">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 grid place-items-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg text-slate-900 dark:text-slate-100">{t("dangerZone")}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t("doctorSettings.dangerDescription")}
              </p>
              <Button data-testid="dr-delete-account-btn" onClick={() => setWarnOpen(true)} variant="destructive" className="mt-4 rounded-full gap-2">
                <Trash2 className="w-4 h-4" /> {t("deleteAccount")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={warnOpen} onOpenChange={setWarnOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
  {t("doctorSettings.deleteAccountQuestion")}
</DialogTitle>
            <DialogDescription>
              {t("doctorSettings.deleteAccountWarning")}
              <br /><br />
              {t("doctorSettings.vaccinationsRemain")}
              <br /><br />
              <span className="font-semibold text-rose-600 dark:text-rose-300">{t("doctorSettings.cannotUndo")}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" data-testid="dr-warn-cancel" onClick={() => setWarnOpen(false)} className="rounded-full">{t("doctorSettings.cancel")}</Button>
            <Button variant="destructive" data-testid="dr-warn-continue" onClick={() => { setWarnOpen(false); setConfirmOpen(true); }} className="rounded-full">
              {t("doctorSettings.understandContinue")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={(o) => { setConfirmOpen(o); if (!o) setPhrase(""); }}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
  {t("doctorSettings.finalConfirmation")}
</DialogTitle>
            <DialogDescription>
              {t("doctorSettings.typePhraseExactly")}
              <div className="mt-3 p-3 rounded-lg bg-slate-100 text-slate-900 dark:text-slate-100 font-mono text-sm select-all">{DELETE_PHRASE}</div>
            </DialogDescription>
          </DialogHeader>
          <Input
            data-testid="dr-delete-phrase-input"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder={t("doctorSettings.phrasePlaceholder")}
            className="h-12 rounded-xl"
          />
          <DialogFooter className="gap-2">
            <Button variant="ghost" data-testid="dr-confirm-cancel" onClick={() => setConfirmOpen(false)} className="rounded-full">{t("doctorSettings.cancel")}</Button>
            <Button
              variant="destructive"
              data-testid="dr-confirm-delete-btn"
              onClick={doDelete}
              disabled={deleting || phrase.trim() !== DELETE_PHRASE}
              className="rounded-full"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : t("doctorSettings.deletePermanently")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
