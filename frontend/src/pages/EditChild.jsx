import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Trash2, ShieldAlert } from "lucide-react";

export default function EditChild() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { id } = useParams();

  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    weight_kg: "",
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/children/${id}`);

        setChild(data);

        setForm({
          name: data.name,
          dob: data.dob,
          gender: data.gender,
          weight_kg:
            data.weight_kg != null
              ? String(data.weight_kg)
              : "",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const save = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return toast.error(
        t("editChild.validationName")
      );
    }

    if (!form.dob) {
      return toast.error(
        t("editChild.validationDob")
      );
    }

    if (!form.gender) {
      return toast.error(
        t("editChild.validationGender")
      );
    }

    const w = parseFloat(form.weight_kg);

    if (
      !form.weight_kg ||
      isNaN(w) ||
      w <= 0 ||
      w > 200
    ) {
      return toast.error(
        t("editChild.validationWeight")
      );
    }

    setSaving(true);

    try {
      await api.patch(
        `/parent/children/${id}`,
        {
          name: form.name.trim(),
          dob: form.dob,
          gender: form.gender,
          weight_kg: w,
        }
      );

      toast.success(
        t("editChild.childUpdated")
      );

      nav(`/parent/child/${id}`);
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          t("editChild.updateFailed")
      );
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    setDeleting(true);

    try {
      await api.post(
        `/parent/children/${id}/delete`
      );

      toast.success(
        t("editChild.childDeleted", {
          name: child.name,
        })
      );

      nav("/parent/dashboard", {
        replace: true,
      });
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          t("editChild.deleteFailed")
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AppShell showBack>
        <Skeleton className="h-40 rounded-2xl" />
      </AppShell>
    );
  }

  if (!child) {
    return (
      <AppShell showBack>
        <div className="card-soft p-8 text-center text-slate-600 dark:text-slate-400">
          {t("editChild.childNotFound")}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      showBack
      backTo={`/parent/child/${id}`}
    >
      <div className="max-w-xl">
        <h1 className="text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">
          {t("editChild.title")}
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          {t("editChild.description", {
            name: child.name,
          })}
        </p>

        <form
          onSubmit={save}
          className="card-soft p-6 mt-6 grid gap-5"
        >
          <div>
            <Label>
              {t("editChild.childName")}
            </Label>

            <Input
              data-testid="edit-child-name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>
                {t("editChild.dateOfBirth")}
              </Label>

              <Input
                data-testid="edit-child-dob"
                type="date"
                max={new Date()
                  .toISOString()
                  .slice(0, 10)}
                value={form.dob}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dob: e.target.value,
                  })
                }
                className="mt-2 h-12 rounded-xl"
              />
            </div>

            <div>
              <Label>
                {t("editChild.gender")}
              </Label>

              <Select
                value={form.gender}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    gender: v,
                  })
                }
              >
                <SelectTrigger
                  data-testid="edit-child-gender"
                  className="mt-2 h-12 rounded-xl"
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Male">
                    {t("gender.male")}
                  </SelectItem>

                  <SelectItem value="Female">
                    {t("gender.female")}
                  </SelectItem>

                  <SelectItem value="Other">
                    {t("gender.other")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>
              {t("editChild.currentWeight")}
            </Label>

            <div className="mt-2 flex items-stretch rounded-xl border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-teal-500 dark:ring-teal-400/20 focus-within:border-teal-600 overflow-hidden bg-white dark:bg-slate-900">
              <Input
                data-testid="edit-child-weight"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={form.weight_kg}
                onChange={(e) =>
                  setForm({
                    ...form,
                    weight_kg: e.target.value,
                  })
                }
                placeholder={t(
                  "editChild.weightPlaceholder"
                )}
                className="flex-1 h-12 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />

              <span className="px-4 flex items-center bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border-l border-slate-200 dark:border-slate-800 select-none">
                kg
              </span>
            </div>
          </div>

          <Button
            data-testid="edit-child-save"
            type="submit"
            disabled={saving}
            className="h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t("editChild.saveChanges")
            )}
          </Button>
        </form>

        <div className="card-soft p-6 mt-8 border-rose-200 dark:border-rose-900/60">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 grid place-items-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <h2 className="font-display text-lg text-slate-900 dark:text-slate-100">
                {t("editChild.deleteChild")}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t("editChild.deleteDescription", {
                  name: child.name,
                })}
              </p>

              <Button
                data-testid="delete-child-btn"
                onClick={() => setDeleteOpen(true)}
                variant="destructive"
                className="mt-4 rounded-full gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t("editChild.deleteButton", {
                  name: child.name,
                })}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {t("editChild.deleteQuestion", {
                name: child.name,
              })}
            </DialogTitle>

            <DialogDescription className="text-slate-600 dark:text-slate-400 mt-2">
              {t("editChild.deleteWarning", {
                name: child.name,
              })}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="ghost"
              data-testid="child-delete-cancel"
              onClick={() =>
                setDeleteOpen(false)
              }
              className="rounded-full"
            >
              {t("editChild.cancel")}
            </Button>

            <Button
              variant="destructive"
              data-testid="child-confirm-delete"
              onClick={doDelete}
              disabled={deleting}
              className="rounded-full gap-2"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {t("editChild.confirmDelete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}