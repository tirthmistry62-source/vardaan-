import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api, setSession } from "@/lib/api";
import { HeartPulse, Loader2, ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function ParentLogin() {
  const nav = useNavigate();
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
      toast.success(`Welcome, ${data.parent.full_name.split(" ")[0]}`);
      nav("/parent/dashboard", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg grid md:grid-cols-2">
      <ThemeToggle floating />
      <div className="hidden md:flex flex-col justify-between p-10 bg-teal-700 text-white relative overflow-hidden">
        <div>
          <div className="w-11 h-11 rounded-2xl bg-white/15 grid place-items-center">
            <HeartPulse className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <h2 className="mt-8 text-4xl font-display tracking-tight max-w-sm">A lifelong vaccination record — always in your pocket.</h2>
          <p className="mt-4 text-teal-100 max-w-sm">Your child's history, from BCG at birth to boosters at 16 — kept safe, searchable, and shareable with any doctor.</p>
        </div>
        <div className="text-teal-100 text-sm">© Vardaan+ 2026</div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-500/30 blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-6">
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
            <Link to="/select-role" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300">Switch role</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
