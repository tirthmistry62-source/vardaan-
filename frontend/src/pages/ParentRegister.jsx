import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api, setSession } from "@/lib/api";
import {
  requestFCMToken,
  getDeviceInfo,
  isFirebaseConfigured,
} from "@/lib/firebase";
import { Loader2, ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function ParentRegister() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    aadhaar: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);

  const upd = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.value,
    });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.full_name.trim()) {
      return toast.error(
        t("parentRegister.validationName")
      );
    }

    if (!/^\d{12}$/.test(form.aadhaar)) {
      return toast.error(
        t("parentRegister.validationAadhaar")
      );
    }

    if (!/^\d{7,15}$/.test(form.phone)) {
      return toast.error(
        t("parentRegister.validationPhone")
      );
    }

    const normalizedEmail = form.email.trim().toLowerCase();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      return toast.error(
        t("parentRegister.validationEmail")
      );
    }

    if (form.password.length < 6) {
      return toast.error(
        t("parentRegister.validationPassword")
      );
    }

    if (form.password !== form.confirm) {
      return toast.error(
        t("parentRegister.validationConfirm")
      );
    }

    setLoading(true);

    try {
      const { data } = await api.post(
        "/parent/register",
        {
          full_name: form.full_name.trim(),
          aadhaar: form.aadhaar,
          phone: form.phone,
          email: normalizedEmail,
          password: form.password,
        }
      );

      setSession({
        token: data.token,
        role: "parent",
        user: data.parent,
      });

      // Register for push notifications
      if (isFirebaseConfigured()) {
        try {
          const fcmToken = await requestFCMToken();

          if (fcmToken) {
            const deviceInfo = getDeviceInfo();

            await api.post(
              "/parent/device-token",
              {
                fcm_token: fcmToken,
                device_name: deviceInfo.deviceName,
                device_type: deviceInfo.deviceType,
              }
            );

            console.log(
              "Device registered for push notifications"
            );
          }
        } catch (error) {
          console.warn(
            "Could not register for push notifications:",
            error
          );
          // Don't fail registration if push notification registration fails
        }
      }

      toast.success(
        t("parentRegister.accountCreated", {
          code: data.parent.access_code,
        })
      );

      nav("/parent/dashboard", {
        replace: true,
      });
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          t("parentRegister.registrationFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-md card-soft p-8"
      >
        <Link
          to="/parent/login"
          data-testid="back-to-login"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("parentRegister.backToLogin")}
        </Link>

        <h1 className="text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">
          {t("parentRegister.title")}
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm leading-6">
          {t("parentRegister.description")}
        </p>

        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 leading-5">
          {t("parentRegister.validDetailsMessage")}
        </p>

        <div className="mt-8 grid gap-5">
          <div>
            <Label>
              {t("parentRegister.fullName")}
            </Label>

            <Input
              data-testid="reg-name"
              value={form.full_name}
              onChange={upd("full_name")}
              placeholder={t(
                "parentRegister.fullNamePlaceholder"
              )}
              autoComplete="name"
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label>
              {t("parentRegister.aadhaar")}
            </Label>

            <Input
              data-testid="reg-aadhaar"
              inputMode="numeric"
              value={form.aadhaar}
              onChange={(e) =>
                setForm({
                  ...form,
                  aadhaar: e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 12),
                })
              }
              placeholder={t(
                "parentRegister.aadhaarPlaceholder"
              )}
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label>
              {t("parentRegister.phone")}
            </Label>

            <Input
              data-testid="reg-phone"
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
              placeholder={t(
                "parentRegister.phonePlaceholder"
              )}
              autoComplete="tel"
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label>
              {t("parentRegister.email")}
            </Label>

            <Input
              data-testid="reg-email"
              type="email"
              value={form.email}
              onChange={upd("email")}
              placeholder={t(
                "parentRegister.emailPlaceholder"
              )}
              autoComplete="email"
              className="mt-2 h-12 rounded-xl"
            />

            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-5">
              {t("parentRegister.emailDescription")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>
                {t("parentRegister.password")}
              </Label>

              <Input
                data-testid="reg-password"
                type="password"
                value={form.password}
                onChange={upd("password")}
                placeholder={t(
                  "parentRegister.passwordPlaceholder"
                )}
                autoComplete="new-password"
                className="mt-2 h-12 rounded-xl"
              />
            </div>

            <div>
              <Label>
                {t("parentRegister.confirmPassword")}
              </Label>

              <Input
                data-testid="reg-confirm"
                type="password"
                value={form.confirm}
                onChange={upd("confirm")}
                placeholder={t(
                  "parentRegister.confirmPlaceholder"
                )}
                autoComplete="new-password"
                className="mt-2 h-12 rounded-xl"
              />
            </div>
          </div>
        </div>

        <Button
          data-testid="reg-submit"
          type="submit"
          disabled={loading}
          className="mt-8 w-full h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t("parentRegister.createAccount")
          )}
        </Button>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {t("parentRegister.alreadyHaveAccount")}{" "}
          <Link
            to="/parent/login"
            className="text-teal-700 dark:text-teal-300 font-medium hover:underline"
          >
            {t("parentRegister.signIn")}
          </Link>
        </p>
      </form>
    </div>
  );
}