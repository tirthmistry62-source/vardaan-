import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api, setSession } from "@/lib/api";
import { Loader2, Stethoscope, ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";

export default function DoctorLogin() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/doctor/login", { phone, password });
      setSession({ token: data.token, role: "doctor", user: data.doctor });
      toast.success(
  t("doctorLogin.welcome", {
    name: data.doctor.doctor_name.split(" ")[0],
  })
);
      nav("/doctor/dashboard", { replace: true });
    } catch (err) {
      toast.error(
  err?.response?.data?.detail || t("doctorLogin.loginFailed")
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
          <form onSubmit={submit} className="w-full max-w-md card-soft p-8">
            <Link to="/select-role" data-testid="back-to-roles" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300 mb-6">
              <ArrowLeft className="w-4 h-4" /> {t("doctorLogin.backToRoleSelection")}
            </Link>
            <h1 className="text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">{t("doctorLogin.title")}</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm leading-6">{t("doctorLogin.description")}</p>
            <div className="mt-8 space-y-6">
              <div>
                <Label required className="text-slate-700 dark:text-slate-300">
  {t("doctorLogin.phoneNumber")}
</Label>
                <Input
                  data-testid="doc-login-phone"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                  placeholder={t("doctorLogin.phonePlaceholder")}
                  className="mt-2 h-12 rounded-xl"
                />
              </div>
              <div>
                <Label required className="text-slate-700 dark:text-slate-300">
  {t("doctorLogin.password")}
</Label>
                <Input
                  data-testid="doc-login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("doctorLogin.passwordPlaceholder")}
                  className="mt-2 h-12 rounded-xl"
                />
              </div>
            </div>
            <Button
              data-testid="doc-login-submit"
              type="submit"
              disabled={loading}
              className="mt-8 w-full h-12 rounded-full bg-sky-700 hover:bg-sky-800 text-white"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("doctorLogin.signIn")}
            </Button>
            <div className="mt-6 flex items-center justify-between text-sm">
              <Link data-testid="doc-register-link" to="/doctor/register" className="text-sky-700 dark:text-sky-300 font-medium hover:underline">{t("doctorLogin.createAccount")}</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex min-h-screen items-center justify-center transition-colors duration-300"
        style={{ background: isDark ? '#080d19' : '#f1f5f9' }}>
        <div className="fixed top-4 right-4 z-50 flex items-center gap-1">
  <LanguageSelector />
  <ThemeToggle />
</div>
        <div className="flex w-[calc(100vw-80px)] max-w-[1100px] rounded-[2rem] overflow-hidden shadow-2xl transition-colors duration-300"
          style={{ background: isDark ? '#0f1620' : '#ffffff', height: 'calc(100vh - 140px)', maxHeight: '620px' }}>

          {/* Left panel — same in both themes */}
          <div
            className="flex flex-col p-10 lg:p-12 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1a3a6b 0%, #162d5e 50%, #0e2147 100%)',
              width: '46%',
              borderRadius: '1.5rem',
            }}
          >
            <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-20" style={{ background: '#3b82f6', filter: 'blur(60px)' }} />
            <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full opacity-15" style={{ background: '#60a5fa', filter: 'blur(50px)' }} />
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ color: '#ffffff18' }}>
              <span className="absolute text-2xl" style={{ top: '38%', left: '12%' }}>+</span>
              <span className="absolute text-lg" style={{ top: '55%', right: '14%' }}>+</span>
              <span className="absolute text-xl" style={{ top: '22%', right: '20%' }}>+</span>
              <svg className="absolute" style={{ top: '48%', left: '60%', width: 18, height: 18, opacity: 0.25 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <svg className="absolute" style={{ top: '28%', left: '48%', width: 16, height: 16, opacity: 0.2 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-11 h-11 rounded-2xl grid place-items-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <Stethoscope className="w-6 h-6 text-white" strokeWidth={1.75} />
              </div>
              <h2 className="mt-6 text-[2.25rem] font-display font-semibold tracking-tight leading-[1.15]" style={{ color: '#fff' }}>
                {t("doctorLogin.panelTitle")}
              </h2>
              <p className="mt-4 text-sm leading-7 max-w-[300px]" style={{ color: '#93c5fd' }}>
                {t("doctorLogin.panelDescription")}
              </p>
              <div className="mt-2 text-sm" style={{ color: '#60a5fa' }}>© Vardaan+ 2026</div>
              <div className="flex-1 flex items-end justify-center mt-3">
                <img
                  src="/doctor-illustration.png"
                  alt={t("doctorLogin.doctorIllustrationAlt")}
                  className="max-w-[260px] h-auto object-contain drop-shadow-xl rounded-3xl"
                />
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="flex-1 flex items-center justify-center px-10 lg:px-16">
            <form onSubmit={submit} className="w-full max-w-[380px]">
              <Link to="/select-role" data-testid="back-to-roles" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                <ArrowLeft className="w-4 h-4" /> {t("doctorLogin.backToRoleSelection")}
              </Link>
              <h1 className="text-3xl font-display tracking-tight font-semibold"
                style={{ color: isDark ? '#fff' : '#0f172a' }}>{t("doctorLogin.title")}</h1>
              <p className="mt-2 text-sm leading-6"
                style={{ color: isDark ? '#64748b' : '#94a3b8' }}>{t("doctorLogin.desktopDescription")}</p>

              <div className="mt-8 space-y-5">
                <div>
                  <Label required style={{ color: isDark ? '#cbd5e1' : '#334155' }}>
  {t("doctorLogin.phoneNumber")}
</Label>
                  <Input
                    data-testid="doc-login-phone"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                    placeholder={t("doctorLogin.phonePlaceholder")}
                    className="mt-2 h-12 rounded-xl"
                    style={{
                      background: isDark ? '#0a0f1a' : '#f8fafc',
                      borderColor: isDark ? '#1e293b' : '#e2e8f0',
                      color: isDark ? '#fff' : '#0f172a',
                    }}
                  />
                </div>
                <div>
                  <Label required style={{ color: isDark ? '#cbd5e1' : '#334155' }}>
  {t("doctorLogin.password")}
</Label>
                  <Input
                    data-testid="doc-login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("doctorLogin.passwordPlaceholder")}
                    className="mt-2 h-12 rounded-xl"
                    style={{
                      background: isDark ? '#0a0f1a' : '#f8fafc',
                      borderColor: isDark ? '#1e293b' : '#e2e8f0',
                      color: isDark ? '#fff' : '#0f172a',
                    }}
                  />
                </div>
              </div>

              <Button
                data-testid="doc-login-submit"
                type="submit"
                disabled={loading}
                className="mt-8 w-full h-12 rounded-full text-white text-base font-medium"
                style={{ background: '#2563eb' }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("doctorLogin.signIn")}
              </Button>

              <div className="mt-6 flex items-center justify-between text-sm">
                <Link data-testid="doc-register-link" to="/doctor/register" className="font-medium transition-colors" style={{ color: '#60a5fa' }}>{t("doctorLogin.createAccount")}</Link>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}
