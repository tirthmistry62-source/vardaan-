import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api, setSession } from "@/lib/api";
import { Loader2, ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTranslation } from "react-i18next";

export default function DoctorRegister() {
  const nav = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    doctor_name: "",
    phone: "",
    email: "",
    password: "",
    clinic_name: "",
    clinic_address: "",
  });

  const [loading, setLoading] = useState(false);

  const upd = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.value,
    });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.doctor_name.trim()) {
      return toast.error(t("doctorRegister.enterName"));
    }

    if (!/^\d{7,15}$/.test(form.phone)) {
      return toast.error(t("doctorRegister.validPhone"));
    }

    const normalizedEmail = form.email.trim().toLowerCase();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      return toast.error(
        t("doctorRegister.validationEmail")
      );
    }

    if (form.password.length < 6) {
      return toast.error(
        t("doctorRegister.passwordLength")
      );
    }

    if (
      !form.clinic_name.trim() ||
      !form.clinic_address.trim()
    ) {
      return toast.error(
        t("doctorRegister.clinicRequired")
      );
    }

    setLoading(true);

    try {
      const { data } = await api.post(
        "/doctor/register",
        {
          doctor_name: form.doctor_name.trim(),
          phone: form.phone,
          email: normalizedEmail,
          password: form.password,
          clinic_name: form.clinic_name.trim(),
          clinic_address: form.clinic_address.trim(),
        }
      );

      setSession({
        token: data.token,
        role: "doctor",
        user: data.doctor,
      });

      toast.success(
        t("doctorRegister.accountCreated")
      );

      nav("/doctor/dashboard", {
        replace: true,
      });
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          t("doctorRegister.registrationFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-6">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
      </div>

      <form
        onSubmit={submit}
        className="w-full max-w-md card-soft p-8"
      >
        <Link
          to="/doctor/login"
          data-testid="back-to-login"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("doctorRegister.backToLogin")}
        </Link>

        <h1 className="text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">
          {t("doctorRegister.title")}
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm leading-6">
          {t("doctorRegister.description")}
        </p>

        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 leading-5">
          {t("doctorRegister.validDetailsMessage")}
        </p>

        <div className="mt-8 grid gap-5">
          {/* Doctor name */}
          <div>
            <Label required>
              {t("doctorRegister.doctorName")}
            </Label>

            <div className="mt-2 flex items-stretch rounded-xl border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-teal-500 dark:ring-teal-400/20 focus-within:border-teal-600 overflow-hidden bg-white dark:bg-slate-900">
              <span className="px-4 flex items-center bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border-r border-slate-200 dark:border-slate-800 select-none">
                Dr.
              </span>

              <Input
                data-testid="dr-name"
                value={form.doctor_name}
                onChange={upd("doctor_name")}
                placeholder={t(
                  "doctorRegister.doctorNamePlaceholder"
                )}
                autoComplete="name"
                className="flex-1 h-12 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-5">
              {t("doctorRegister.doctorNameDescription")}
            </p>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>
                {t("doctorRegister.phone")}
              </Label>

              <Input
                data-testid="dr-phone"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 15),
                  })
                }
                autoComplete="tel"
                className="mt-2 h-12 rounded-xl"
              />
            </div>

            <div>
              <Label required>
                {t("doctorRegister.email")}
              </Label>

              <Input
                data-testid="dr-email"
                type="email"
                value={form.email}
                onChange={upd("email")}
                placeholder={t(
                  "doctorRegister.emailPlaceholder"
                )}
                autoComplete="email"
                className="mt-2 h-12 rounded-xl"
              />
            </div>
          </div>

          <p className="-mt-3 text-xs text-slate-500 dark:text-slate-400 leading-5">
            {t("doctorRegister.emailDescription")}
          </p>

          {/* Password */}
          <div>
            <Label required>
              {t("doctorRegister.password")}
            </Label>

            <Input
              data-testid="dr-password"
              type="password"
              value={form.password}
              onChange={upd("password")}
              placeholder={t(
                "doctorRegister.passwordPlaceholder"
              )}
              autoComplete="new-password"
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          {/* Clinic name */}
          <div>
            <Label required>
              {t("doctorRegister.clinicName")}
            </Label>

            <Input
              data-testid="dr-clinic"
              value={form.clinic_name}
              onChange={upd("clinic_name")}
              placeholder={t(
                "doctorRegister.clinicNamePlaceholder"
              )}
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          {/* Clinic address */}
          <div>
            <Label required>
              {t("doctorRegister.clinicAddress")}
            </Label>

            <Textarea
              data-testid="dr-address"
              value={form.clinic_address}
              onChange={upd("clinic_address")}
              placeholder={t(
                "doctorRegister.clinicAddressPlaceholder"
              )}
              className="mt-2 rounded-xl"
              rows={3}
            />
          </div>
        </div>

        {/* Create account */}
        <Button
          data-testid="dr-submit"
          type="submit"
          disabled={loading}
          className="mt-8 w-full h-12 rounded-full bg-sky-700 hover:bg-sky-800 text-white"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t("doctorRegister.createAccount")
          )}
        </Button>

        {/* Sign in */}
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {t("doctorRegister.alreadyRegistered")}{" "}
          <Link
            to="/doctor/login"
            className="text-sky-700 dark:text-sky-300 font-medium hover:underline"
          >
            {t("doctorRegister.signIn")}
          </Link>
        </p>
      </form>
    </div>
  );
}
