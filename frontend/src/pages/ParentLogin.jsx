import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { HeartPulse, Loader2, ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";

export default function ParentLogin() {
  const { i18n, t } = useTranslation();
  const nav = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isNonEnglish = i18n.language !== "en";

  const [aadhaar, setAadhaar] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleForgotPassword = async () => {
  if (!/^\d{12}$/.test(aadhaar)) {
    return toast.error(
      t("parentLogin.aadhaarRequiredForReset")
    );
  }

  try {
    await api.post("/auth/check-parent-aadhaar", {
      aadhaar,
    });

    nav("/parent/forgot-password", {
      state: {
        aadhaar,
      },
    });
  } catch (err) {
    toast.error(
      err?.response?.data?.detail ||
        t("parentLogin.aadhaarNotFoundForReset")
    );
  }
};



  const submit = async (e) => {
    e.preventDefault();

    if (!/^\d{12}$/.test(aadhaar)) {
      return toast.error(t("parentLogin.aadhaarValidation"));
    }

    setLoading(true);

    try {
      const { data } = await api.post("/parent/login", {
        aadhaar,
        password,
      });

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

            await api.post("/parent/device-token", {
              fcm_token: fcmToken,
              device_name: deviceInfo.deviceName,
              device_type: deviceInfo.deviceType,
            });

            console.log("Device registered for push notifications");
          }
        } catch (error) {
          console.warn(
            "Could not register for push notifications:",
            error
          );
          // Don't fail login if push notification registration fails
        }
      }

      toast.success(
        t("parentLogin.welcome", {
          name: data.parent.full_name.split(" ")[0],
        })
      );

      nav("/parent/dashboard", { replace: true });
    } catch (err) {
      toast.error(
        err?.response?.data?.detail || t("parentLogin.loginFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mobile layout */}
      <div className="min-h-screen aurora-bg md:hidden">
        <div className="fixed top-4 right-4 z-50 flex items-center gap-1">
          <LanguageSelector />
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-center p-6 min-h-screen">
          <form
            onSubmit={submit}
            className="w-full max-w-md card-soft p-8"
          >
            <Link
              to="/select-role"
              data-testid="back-to-roles"
              className={`inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300 mb-6 ${
                isNonEnglish ? "tracking-[0.01em]" : ""
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {t("parentLogin.backToRoleSelection")}
            </Link>

            <h1
              className={`text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100 ${
                isNonEnglish ? "tracking-[0.01em] leading-[1.25]" : ""
              }`}
            >
              {t("parentLogin.title")}
            </h1>

            <p
              className={`mt-2 text-slate-500 dark:text-slate-400 text-sm ${
                isNonEnglish
                  ? "leading-7 tracking-[0.01em]"
                  : "leading-6"
              }`}
            >
              {t("parentLogin.description")}
            </p>

            <div
              className={`mt-8 ${
                isNonEnglish ? "space-y-7" : "space-y-6"
              }`}
            >
              <div>
                <Label
                  className={`text-slate-700 dark:text-slate-300 ${
                    isNonEnglish ? "tracking-[0.01em]" : ""
                  }`}
                >
                  {t("parentLogin.aadhaarNumber")}
                </Label>

                <Input
                  data-testid="parent-login-aadhaar"
                  value={aadhaar}
                  onChange={(e) =>
                    setAadhaar(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 12)
                    )
                  }
                  inputMode="numeric"
                  placeholder={t("parentLogin.aadhaarPlaceholder")}
                  className="mt-2 h-12 rounded-xl"
                />
              </div>

              <div>
                <Label
                  className={`text-slate-700 dark:text-slate-300 ${
                    isNonEnglish ? "tracking-[0.01em]" : ""
                  }`}
                >
                  {t("parentLogin.password")}
                </Label>

                <Input
                  data-testid="parent-login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("parentLogin.passwordPlaceholder")}
                  className="mt-2 h-12 rounded-xl"
                />

                <div className="mt-2 text-right">
                  <button
  type="button"
  data-testid="parent-forgot-password-link"
  onClick={handleForgotPassword}
  className="text-sm text-teal-700 dark:text-teal-300 font-medium hover:underline"
>
  {t("parentLogin.forgotPassword")}
</button>
                </div>
              </div>
            </div>

            <Button
              data-testid="parent-login-submit"
              type="submit"
              disabled={loading}
              className={`mt-8 w-full h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white text-base ${
                isNonEnglish ? "tracking-[0.01em]" : ""
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t("parentLogin.signIn")
              )}
            </Button>

            <div
              className={`mt-6 flex items-center justify-between text-sm ${
                isNonEnglish ? "tracking-[0.01em]" : ""
              }`}
            >
              <Link
                data-testid="parent-register-link"
                to="/parent/register"
                className="text-teal-700 dark:text-teal-300 font-medium hover:underline"
              >
                {t("parentLogin.createAccount")}
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Desktop layout */}
      <div
        className="hidden md:flex min-h-screen items-center justify-center transition-colors duration-300"
        style={{
          background: isDark ? "#080d19" : "#f1f5f9",
        }}
      >
        <div className="fixed top-4 right-4 z-50 flex items-center gap-1">
          <LanguageSelector />
          <ThemeToggle />
        </div>

        <div
          className="flex w-[calc(100vw-80px)] max-w-[1100px] rounded-[2rem] overflow-hidden shadow-2xl transition-colors duration-300"
          style={{
            background: isDark ? "#0f1620" : "#ffffff",
            height: "calc(100vh - 140px)",
            maxHeight: "620px",
          }}
        >
          {/* Left teal panel */}
          <div
            className="flex flex-col p-10 lg:p-12 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #2ba89f 0%, #1a9d8a 50%, #0f8d7a 100%)",
              width: "46%",
              borderRadius: "1.5rem",
            }}
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-11 h-11 rounded-2xl bg-white/10 grid place-items-center">
                <HeartPulse
                  className="w-6 h-6 text-white"
                  strokeWidth={1.75}
                />
              </div>

              <h2
                className={`mt-6 text-[2.25rem] font-display font-semibold tracking-tight leading-[1.15] ${
                  isNonEnglish
                    ? "tracking-[0.01em] leading-[1.25]"
                    : ""
                }`}
                style={{ color: "#fff" }}
              >
                {t("parentLogin.panelTitle")}
              </h2>

              <p
                className={`mt-4 text-sm max-w-[300px] ${
                  isNonEnglish
                    ? "leading-7 tracking-[0.01em]"
                    : "leading-7"
                }`}
                style={{ color: "#c8f0e6" }}
              >
                {t("parentLogin.panelDescription")}
              </p>

              <div
                className={`mt-2 text-sm ${
                  isNonEnglish ? "tracking-[0.01em]" : ""
                }`}
                style={{ color: "#a8e0d4" }}
              >
                © Vardaan+ 2026
              </div>

              <div className="flex-1 flex items-end justify-center mt-3">
                <img
                  src="/login-illustration.jpg"
                  alt={t("parentLogin.childIllustrationAlt")}
                  className="max-w-[240px] h-auto object-contain drop-shadow-xl rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="flex-1 flex items-center justify-center px-10 lg:px-16">
            <form
              onSubmit={submit}
              className="w-full max-w-[380px]"
            >
              <Link
                to="/select-role"
                data-testid="back-to-roles"
                className={`inline-flex items-center gap-2 text-sm mb-8 transition-colors ${
                  isNonEnglish ? "tracking-[0.01em]" : ""
                }`}
                style={{
                  color: isDark ? "#94a3b8" : "#64748b",
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                {t("parentLogin.backToRoleSelection")}
              </Link>

              <h1
                className={`text-3xl font-display tracking-tight font-semibold ${
                  isNonEnglish
                    ? "tracking-[0.01em] leading-[1.25]"
                    : ""
                }`}
                style={{
                  color: isDark ? "#fff" : "#0f172a",
                }}
              >
                {t("parentLogin.title")}
              </h1>

              <p
                className={`mt-2 text-sm ${
                  isNonEnglish
                    ? "leading-7 tracking-[0.01em]"
                    : "leading-6"
                }`}
                style={{
                  color: isDark ? "#64748b" : "#94a3b8",
                }}
              >
                {t("parentLogin.description")}
              </p>

              <div
                className={`mt-8 ${
                  isNonEnglish ? "space-y-6" : "space-y-5"
                }`}
              >
                <div>
                  <Label
                    className={
                      isNonEnglish ? "tracking-[0.01em]" : ""
                    }
                    style={{
                      color: isDark ? "#cbd5e1" : "#334155",
                    }}
                  >
                    {t("parentLogin.aadhaarNumber")}
                  </Label>

                  <Input
                    data-testid="parent-login-aadhaar"
                    value={aadhaar}
                    onChange={(e) =>
                      setAadhaar(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 12)
                      )
                    }
                    inputMode="numeric"
                    placeholder={t(
                      "parentLogin.aadhaarPlaceholder"
                    )}
                    className="mt-2 h-12 rounded-xl"
                    style={{
                      background: isDark
                        ? "#0a0f1a"
                        : "#f8fafc",
                      borderColor: isDark
                        ? "#1e293b"
                        : "#e2e8f0",
                      color: isDark
                        ? "#fff"
                        : "#0f172a",
                    }}
                  />
                </div>

                <div>
                  <Label
                    className={
                      isNonEnglish ? "tracking-[0.01em]" : ""
                    }
                    style={{
                      color: isDark ? "#cbd5e1" : "#334155",
                    }}
                  >
                    {t("parentLogin.password")}
                  </Label>

                  <Input
                    data-testid="parent-login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t(
                      "parentLogin.passwordPlaceholder"
                    )}
                    className="mt-2 h-12 rounded-xl"
                    style={{
                      background: isDark
                        ? "#0a0f1a"
                        : "#f8fafc",
                      borderColor: isDark
                        ? "#1e293b"
                        : "#e2e8f0",
                      color: isDark
                        ? "#fff"
                        : "#0f172a",
                    }}
                  />

                  <div className="mt-2 text-right">
                    <button
  type="button"
  data-testid="parent-forgot-password-link"
  onClick={handleForgotPassword}
  className="text-sm font-medium hover:underline"
  style={{ color: "#19806c" }}
>
  {t("parentLogin.forgotPassword")}
</button>
                  </div>
                </div>
              </div>

              <Button
                data-testid="parent-login-submit"
                type="submit"
                disabled={loading}
                className={`mt-8 w-full h-12 rounded-full text-white text-base font-medium ${
                  isNonEnglish ? "tracking-[0.01em]" : ""
                }`}
                style={{ background: "#19806c" }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t("parentLogin.signIn")
                )}
              </Button>

              <div
                className={`mt-6 flex items-center justify-between text-sm ${
                  isNonEnglish ? "tracking-[0.01em]" : ""
                }`}
              >
                <Link
                  data-testid="parent-register-link"
                  to="/parent/register"
                  className="font-medium transition-colors"
                  style={{ color: "#2dd4a8" }}
                >
                  {t("parentLogin.createAccount")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
