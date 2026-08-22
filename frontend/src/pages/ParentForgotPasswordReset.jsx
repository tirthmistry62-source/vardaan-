import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, LockKeyhole } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/api";

export default function ParentForgotPasswordReset() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const role = location.state?.role || "parent";
  const resetToken = location.state?.resetToken;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email || !resetToken) {
    return (
      <div className="min-h-screen aurora-bg flex items-center justify-center p-6">
        <div className="w-full max-w-md card-soft p-8 text-center">
          <h1 className="text-2xl font-display text-slate-900 dark:text-slate-100">
            {t("forgotPassword.sessionExpired")}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t("forgotPassword.startAgain")}
          </p>

          <Link
            to="/parent/forgot-password"
            className="inline-flex items-center gap-2 mt-6 text-teal-700 dark:text-teal-300 font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("forgotPassword.backToForgotPassword")}
          </Link>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error(
        t("forgotPassword.passwordLength")
      );
    }

    if (password !== confirmPassword) {
      return toast.error(
        t("forgotPassword.passwordMismatch")
      );
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        role,
        email,
        reset_token: resetToken,
        new_password: password,
      });

      toast.success(
        t("forgotPassword.passwordResetSuccess")
      );

      nav("/parent/login", { replace: true });
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          t("forgotPassword.passwordResetFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-6">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <form
        onSubmit={submit}
        className="w-full max-w-md card-soft p-8"
      >
        <Link
          to="/parent/forgot-password"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("forgotPassword.back")}
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/40 grid place-items-center text-teal-700 dark:text-teal-300">
          <LockKeyhole className="w-6 h-6" />
        </div>

        <h1 className="mt-5 text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">
          {t("forgotPassword.resetTitle")}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {t("forgotPassword.resetDescription")}
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <Label>
              {t("forgotPassword.newPassword")}
            </Label>

            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t(
                "forgotPassword.newPasswordPlaceholder"
              )}
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label>
              {t("forgotPassword.confirmPassword")}
            </Label>

            <Input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder={t(
                "forgotPassword.confirmPasswordPlaceholder"
              )}
              className="mt-2 h-12 rounded-xl"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-8 w-full h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t("forgotPassword.resetPassword")
          )}
        </Button>
      </form>
    </div>
  );
}