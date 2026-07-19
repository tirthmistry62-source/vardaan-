import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api, setSession } from "@/lib/api";
import { Loader2, Stethoscope } from "lucide-react";

export default function DoctorLogin() {
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/doctor/login", { phone, password });
      setSession({ token: data.token, role: "doctor", user: data.doctor });
      toast.success(`Welcome, Dr. ${data.doctor.doctor_name.split(" ")[0]}`);
      nav("/doctor/dashboard", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between p-10 bg-sky-700 text-white relative overflow-hidden">
        <div>
          <div className="w-11 h-11 rounded-2xl bg-white/15 grid place-items-center">
            <Stethoscope className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <h2 className="mt-8 text-4xl font-display tracking-tight max-w-sm">Record vaccinations in seconds, not minutes.</h2>
          <p className="mt-4 text-sky-100 max-w-sm">Search by Aadhaar. See what's due. Tap to record. Every parent gets an instant notification.</p>
        </div>
        <div className="text-sky-100 text-sm">© VaxLedger 2026</div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-sky-400/30 blur-3xl" />
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-md card-soft p-8">
          <h1 className="text-3xl font-display tracking-tight text-slate-900">Doctor Login</h1>
          <p className="mt-2 text-slate-500 text-sm">Sign in to access patient records.</p>
          <div className="mt-8 space-y-5">
            <div>
              <Label>Phone number</Label>
              <Input data-testid="doc-login-phone" inputMode="numeric" value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                placeholder="Registered phone" className="mt-2 h-12 rounded-xl" />
            </div>
            <div>
              <Label>Password</Label>
              <Input data-testid="doc-login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="mt-2 h-12 rounded-xl" />
            </div>
          </div>
          <Button data-testid="doc-login-submit" type="submit" disabled={loading} className="mt-8 w-full h-12 rounded-full bg-sky-700 hover:bg-sky-800 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
          </Button>
          <div className="mt-6 flex items-center justify-between text-sm">
            <Link data-testid="doc-register-link" to="/doctor/register" className="text-sky-700 font-medium hover:underline">Create doctor account</Link>
            <Link to="/select-role" className="text-slate-500 hover:text-slate-700">Switch role</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
