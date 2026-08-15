import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppShell from "@/components/AppShell";
import { api, getSession } from "@/lib/api";
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
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function AddChild() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const session = getSession();
  const myAadhaar = session?.user?.aadhaar || "";

  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    weight_kg: "",
    parent_role: "mother",
    other_aadhaar: "",
    child_aadhaar: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return toast.error(t("addChild.validationName"));
    }

    if (!form.dob) {
      return toast.error(t("addChild.validationDob"));
    }

    if (!form.gender) {
      return toast.error(t("addChild.validationGender"));
    }

    const w = parseFloat(form.weight_kg);

    if (
      !form.weight_kg ||
      isNaN(w) ||
      w <= 0 ||
      w > 200
    ) {
      return toast.error(t("addChild.validationWeight"));
    }

    if (
      form.other_aadhaar &&
      !/^\d{12}$/.test(form.other_aadhaar)
    ) {
      return toast.error(
        t("addChild.validationOtherParentAadhaar")
      );
    }

    if (
      form.child_aadhaar &&
      !/^\d{12}$/.test(form.child_aadhaar)
    ) {
      return toast.error(
        t("addChild.validationChildAadhaar")
      );
    }

    const payload = {
      name: form.name.trim(),
      dob: form.dob,
      gender: form.gender,
      weight_kg: w,
      child_aadhaar: form.child_aadhaar || null,
      mother_aadhaar:
        form.parent_role === "mother"
          ? myAadhaar
          : form.other_aadhaar || null,
      father_aadhaar:
        form.parent_role === "father"
          ? myAadhaar
          : form.other_aadhaar || null,
    };

    setLoading(true);

    try {
      await api.post("/parent/children", payload);

      toast.success(
        t("addChild.childAdded", {
          name: form.name,
        })
      );

      nav("/parent/dashboard");
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          t("addChild.couldNotAdd")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      showBack
      backTo="/parent/dashboard"
    >
      <button
        data-testid="back-btn"
        onClick={() => nav(-1)}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300 text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("back")}
      </button>

      <div className="max-w-xl">
        <h1 className="text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">
          {t("addChild.title")}
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          {t("addChild.description")}
        </p>

        <form
          onSubmit={submit}
          className="card-soft p-8 mt-8 grid gap-5"
        >
          <div>
            <Label>{t("addChild.childName")}</Label>

            <Input
              data-testid="ch-name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder={t(
                "addChild.childNamePlaceholder"
              )}
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("addChild.dateOfBirth")}</Label>

              <Input
                data-testid="ch-dob"
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
              <Label>{t("addChild.gender")}</Label>

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
                  data-testid="ch-gender"
                  className="mt-2 h-12 rounded-xl"
                >
                  <SelectValue
                    placeholder={t(
                      "addChild.select"
                    )}
                  />
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
              {t("addChild.currentWeight")}
            </Label>

            <div className="mt-2 flex items-stretch rounded-xl border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-teal-500 dark:ring-teal-400/20 focus-within:border-teal-600 overflow-hidden bg-white dark:bg-slate-900">
              <Input
                data-testid="ch-weight"
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
                  "addChild.weightPlaceholder"
                )}
                className="flex-1 h-12 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />

              <span className="px-4 flex items-center bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border-l border-slate-200 dark:border-slate-800 select-none">
                kg
              </span>
            </div>
          </div>

          <div>
            <Label>{t("addChild.youAreThe")}</Label>

            <Select
              value={form.parent_role}
              onValueChange={(v) =>
                setForm({
                  ...form,
                  parent_role: v,
                })
              }
            >
              <SelectTrigger
                data-testid="ch-parent-role"
                className="mt-2 h-12 rounded-xl"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="mother">
                  {t("addChild.mother")}
                </SelectItem>

                <SelectItem value="father">
                  {t("addChild.father")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              {t("addChild.otherParentAadhaar")}
            </Label>

            <Input
              data-testid="ch-other-aadhaar"
              inputMode="numeric"
              value={form.other_aadhaar}
              onChange={(e) =>
                setForm({
                  ...form,
                  other_aadhaar: e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 12),
                })
              }
              placeholder={t(
                "addChild.otherParentAadhaarPlaceholder"
              )}
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label>
              {t("addChild.childAadhaar")}
            </Label>

            <Input
              data-testid="ch-child-aadhaar"
              inputMode="numeric"
              value={form.child_aadhaar}
              onChange={(e) =>
                setForm({
                  ...form,
                  child_aadhaar: e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 12),
                })
              }
              placeholder={t(
                "addChild.childAadhaarPlaceholder"
              )}
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <Button
            data-testid="ch-submit"
            type="submit"
            disabled={loading}
            className="h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t("addChild.submit")
            )}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}