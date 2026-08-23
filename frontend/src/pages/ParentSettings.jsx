import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { api, clearSession, getSession, setSession } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { maskAadhaar } from "@/lib/vaccineStatus";
import {
  User2,
  Trash2,
  ShieldAlert,
  Loader2,
  LogOut,
  Languages,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const DELETE_PHRASE = "DELETE MY ACCOUNT";

export default function ParentSettings() {
  const nav = useNavigate();
  const { t, i18n } = useTranslation();
  const session = getSession();
  const [me, setMe] = useState(null);
  const [full_name, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete flow: step 1 warning, step 2 phrase confirmation
  const [warnOpen, setWarnOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/parent/me");
      setMe(data);
      setFullName(data.full_name);
      setPhone(data.phone);
    })();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const updates = {};
    if (full_name.trim() && full_name.trim() !== me.full_name) updates.full_name = full_name.trim();
    if (phone !== me.phone) {
      if (!/^\d{7,15}$/.test(phone)) return toast.error("Invalid phone number");
      updates.phone = phone;
    }
    if (Object.keys(updates).length === 0) return toast.info("Nothing to update");
    setSaving(true);
    try {
      const { data } = await api.patch("/parent/me", updates);
      setMe(data);
      // Refresh session user
      setSession({ token: session.token, role: "parent", user: data });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (phrase.trim() !== DELETE_PHRASE) return toast.error(`Type exactly: ${DELETE_PHRASE}`);
    setDeleting(true);
    try {
      await api.post("/parent/me/delete", { confirm_phrase: phrase.trim() });
      clearSession();
      toast.success("Account deleted");
      nav("/select-role", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (!me) return <AppShell showBack backTo="/parent/dashboard">Loading…</AppShell>;

  return (
    <AppShell showBack backTo="/parent/dashboard">

      

      <div className="max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 grid place-items-center">
            <User2 className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">{t("profileSettings")}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Aadhaar: {maskAadhaar(me.aadhaar)}</p>
            {me.access_code && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("accessCode")}: <span className="font-semibold text-slate-700 dark:text-slate-200">{me.access_code}</span></p>}
          </div>
        </div>

        <form onSubmit={save} className="card-soft p-6 grid gap-5">
          <h2 className="font-display text-lg text-slate-900 dark:text-slate-100">{t("accountDetails")}</h2>
          <div>
            <Label required>{t("fullName")}</Label>
            <Input data-testid="settings-name" value={full_name} onChange={(e) => setFullName(e.target.value)} className="mt-2 h-12 rounded-xl" />
          </div>
          <div>
            <Label required>{t("phoneNumber")}</Label>
            <Input data-testid="settings-phone" inputMode="numeric" value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
              className="mt-2 h-12 rounded-xl" />
          </div>
          <div>
            <Label>{t("aadhaarUsername")}</Label>
            <Input value={me.aadhaar} disabled className="mt-2 h-12 rounded-xl bg-slate-50 dark:bg-slate-800" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{t("aadhaarDescription")}</p>
          </div>
          <Button data-testid="settings-save" type="submit" disabled={saving} className="h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t("saveChanges")}
          </Button>
        </form>

        <div className="card-soft p-6 mt-8">
  <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 grid place-items-center">
    <Languages className="w-5 h-5" />
  </div>

  <div>
    <h2 className="font-display text-lg text-slate-900 dark:text-slate-100">
      {t("language")}
    </h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
      {t("parentDashboard.languageDescription")}
    </p>
  </div>
</div>

  <select
  value={i18n.language}
  onChange={async (e) => {
    const language = e.target.value;
    await i18n.changeLanguage(language);

    try {
      await api.patch("/parent/me", { language });
    } catch (err) {
      console.error("Failed to save language preference:", err);
    }
  }}
  className="mt-5 w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-slate-900 dark:text-slate-100 text-sm font-medium outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
>
    <option value="en">{t("english")}</option>
    <option value="hi">{t("hindi")}</option>
    <option value="mr">{t("marathi")}</option>
    <option value="gu">{t("gujarati")}</option>
  </select>
</div>

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
    Logout
  </Button>
</div>

<div className="card-soft p-5 mt-8 !border !border-red-500 rounded-3xl">
    <div className="flex items-start gap-3">
    <div className="w-11 h-11 rounded-xl bg-rose-900/50 text-rose-300 grid place-items-center shrink-0">
      <ShieldAlert className="w-5 h-5" />
    </div>

    <div className="flex-1 min-w-0">
      <h2 className="font-display text-xl font-semibold text-slate-100">
        {t("dangerZone")}
      </h2>

      <p className="text-sm leading-6 text-slate-300 mt-1.5 max-w-md">
        {t("deleteAccountDescription")}
      </p>

      <Button
        data-testid="delete-account-btn"
        onClick={() => setWarnOpen(true)}
        variant="destructive"
        className="mt-5 rounded-full gap-2 px-6 h-12 text-base font-semibold"
      >
        <Trash2 className="w-5 h-5" />
        {t("deleteAccount")}
      </Button>
    </div>
  </div>
</div>
</div>

      {/* Warning dialog */}
      <Dialog open={warnOpen} onOpenChange={setWarnOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Delete your account?</DialogTitle>
            <DialogDescription>
              This will permanently remove your Vardaan+ account and any child whose only linked parent is you. Vaccination records for those children will also be permanently deleted.
              <br /><br />
              Children linked to another parent will remain accessible from that parent&apos;s account.
              <br /><br />
              <span className="font-semibold text-rose-600 dark:text-rose-300">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" data-testid="warn-cancel" onClick={() => setWarnOpen(false)} className="rounded-full">Cancel</Button>
            <Button variant="destructive" data-testid="warn-continue" onClick={() => { setWarnOpen(false); setConfirmOpen(true); }} className="rounded-full">
              I understand, continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Phrase confirmation */}
      <Dialog open={confirmOpen} onOpenChange={(o) => { setConfirmOpen(o); if (!o) setPhrase(""); }}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Final confirmation</DialogTitle>
            <DialogDescription>
              To confirm, type this phrase exactly:
              <div className="mt-3 p-3 rounded-lg bg-slate-100 text-slate-900 dark:text-slate-100 font-mono text-sm select-all">{DELETE_PHRASE}</div>
            </DialogDescription>
          </DialogHeader>
          <Input
            data-testid="delete-phrase-input"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Type the phrase above"
            className="h-12 rounded-xl"
          />
          <DialogFooter className="gap-2">
            <Button variant="ghost" data-testid="confirm-cancel" onClick={() => setConfirmOpen(false)} className="rounded-full">Cancel</Button>
            <Button
              variant="destructive"
              data-testid="confirm-delete-btn"
              onClick={doDelete}
              disabled={deleting || phrase.trim() !== DELETE_PHRASE}
              className="rounded-full"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
