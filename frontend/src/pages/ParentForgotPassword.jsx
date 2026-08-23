import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/api";

export default function ParentForgotPassword() {
  const { t } = useTranslation();
  const nav = useNavigate();
const location = useLocation();
const aadhaar = location.state?.aadhaar;
console.log("Forgot Password Aadhaar:", aadhaar);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return toast.error(t("forgotPassword.invalidEmail"));
    }

    setLoading(true);

    try {
await api.post("/auth/forgot-password", {
  role: "parent",
  aadhaar,
  email: normalizedEmail,
});

      toast.success(t("forgotPassword.otpSent"));

      nav("/parent/forgot-password/verify", {
        state: {
          email: normalizedEmail,
          role: "parent",
        },
      });
} catch (err) {
  const detail = err?.response?.data?.detail;

  const message = Array.isArray(detail)
    ? detail.map((item) => item.msg).join(", ")
    : detail || t("forgotPassword.requestFailed");

  toast.error(message);
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-6">
      <ThemeToggle floating />

      <form
        onSubmit={submit}
        className="w-full max-w-md card-soft p-8"
      >
        <Link
          to="/parent/login"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("forgotPassword.backToLogin")}
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/40 grid place-items-center text-teal-700 dark:text-teal-300">
          <Mail className="w-6 h-6" />
        </div>

        <h1 className="mt-5 text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">
          {t("forgotPassword.title")}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {t("forgotPassword.description")}
        </p>

        <div className="mt-8">
          <Label required className="text-slate-700 dark:text-slate-300">
            {t("forgotPassword.email")}
          </Label>

          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("forgotPassword.emailPlaceholder")}
            className="mt-2 h-12 rounded-xl"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-8 w-full h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t("forgotPassword.sendOtp")
          )}
        </Button>
      </form>
    </div>
  );
}
