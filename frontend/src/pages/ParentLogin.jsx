import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api, setSession } from "@/lib/api";
import { requestFCMToken, getDeviceInfo, isFirebaseConfigured } from "@/lib/firebase";
import { HeartPulse, Loader2, ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";

export default function ParentLogin() {
  const nav = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [aadhaar, setAadhaar] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\d{12}$/.test(aadhaar)) return toast.error("Aadhaar must be 12 digits");
    setLoading(true);
    try {
      const { data } = await api.post("/parent/login", { aadhaar, password });
      setSession({ token: data.token, role: "parent", user: data.parent });
      
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
          console.warn("Could not register for push notifications:", error);
          // Don't fail login if push notification registration fails
        }
      }
      
      toast.success(`Welcome, ${data.parent.full_name.split(" ")[0]}`);
      nav("/parent/dashboard", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* Mobile layout - unchanged */}
    <div className="min-h-screen aurora-bg md:hidden">
      <ThemeToggle floating />
      <div className="flex items-center justify-center p-6 min-h-screen">
        <form onSubmit={submit} className="w-full max-w-md card-soft p-8">
          <Link to="/select-role" data-testid="back-to-roles" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to role selection
          </Link>
          <h1 className="text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">Parent Login</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">Sign in with your Aadhaar to access your children's records.</p>

          <div className="mt-8 space-y-5">
            <div>
              <Label className="text-slate-700 dark:text-slate-300">Aadhaar number</Label>
              <Input
                data-testid="parent-login-aadhaar"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                inputMode="numeric"
                placeholder="12-digit Aadhaar"
                className="mt-2 h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="text-slate-700 dark:text-slate-300">Password</Label>
              <Input
                data-testid="parent-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-2 h-12 rounded-xl"
              />
            </div>
          </div>

          <Button
            data-testid="parent-login-submit"
            type="submit"
            disabled={loading}
            className="mt-8 w-full h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white text-base"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
          </Button>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link data-testid="parent-register-link" to="/parent/register" className="text-teal-700 dark:text-teal-300 font-medium hover:underline">Create parent account</Link>
          </div>
        </form>
      </div>
    </div>

    {/* Desktop layout */}
    <div className="hidden md:flex min-h-screen items-center justify-center transition-colors duration-300"
      style={{ background: isDark ? '#080d19' : '#f1f5f9' }}>
      <ThemeToggle floating />
      <div className="flex w-[calc(100vw-80px)] max-w-[1100px] rounded-[2rem] overflow-hidden shadow-2xl transition-colors duration-300"
        style={{ background: isDark ? '#0f1620' : '#ffffff', height: 'calc(100vh - 140px)', maxHeight: '620px' }}>
        {/* Left teal panel - same in both themes */}
        <div className="flex flex-col p-10 lg:p-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2ba89f 0%, #1a9d8a 50%, #0f8d7a 100%)', width: '46%', borderRadius: '1.5rem' }}>
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-11 h-11 rounded-2xl bg-white/10 grid place-items-center">
              <HeartPulse className="w-6 h-6 text-white" strokeWidth={1.75} />
            </div>
            <h2 className="mt-6 text-[2.25rem] font-display font-semibold tracking-tight leading-[1.15]" style={{ color: '#fff' }}>
              A lifelong vaccination record — always in your pocket.
            </h2>
            <p className="mt-4 text-sm leading-relaxed max-w-[300px]" style={{ color: '#c8f0e6' }}>
              Your child's history, from BCG at birth{'\n'}to boosters at 16 — kept safe, searchable,{'\n'}and shareable with any doctor.
            </p>
            <div className="mt-2 text-sm" style={{ color: '#a8e0d4' }}>© Vardaan+ 2026</div>
            <div className="flex-1 flex items-end justify-center mt-3">
              <img src="/login-illustration.jpg" alt="Child with teddy" className="max-w-[240px] h-auto object-contain drop-shadow-xl rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center px-10 lg:px-16">
          <form onSubmit={submit} className="w-full max-w-[380px]">
            <Link to="/select-role" data-testid="back-to-roles" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
              style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              <ArrowLeft className="w-4 h-4" /> Back to role selection
            </Link>
            <h1 className="text-3xl font-display tracking-tight font-semibold"
              style={{ color: isDark ? '#fff' : '#0f172a' }}>Parent Login</h1>
            <p className="mt-2 text-sm"
              style={{ color: isDark ? '#64748b' : '#94a3b8' }}>Sign in with your Aadhaar to access your children's records.</p>

            <div className="mt-8 space-y-5">
              <div>
                <Label style={{ color: isDark ? '#cbd5e1' : '#334155' }}>Aadhaar number</Label>
                <Input
                  data-testid="parent-login-aadhaar"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  inputMode="numeric"
                  placeholder="12-digit Aadhaar"
                  className="mt-2 h-12 rounded-xl"
                  style={{
                    background: isDark ? '#0a0f1a' : '#f8fafc',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    color: isDark ? '#fff' : '#0f172a',
                  }}
                />
              </div>
              <div>
                <Label style={{ color: isDark ? '#cbd5e1' : '#334155' }}>Password</Label>
                <Input
                  data-testid="parent-login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
              data-testid="parent-login-submit"
              type="submit"
              disabled={loading}
              className="mt-8 w-full h-12 rounded-full text-white text-base font-medium"
              style={{ background: '#19806c' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
            </Button>

            <div className="mt-6 flex items-center justify-between text-sm">
              <Link data-testid="parent-register-link" to="/parent/register" className="font-medium transition-colors" style={{ color: '#2dd4a8' }}>Create parent account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
