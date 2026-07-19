import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api, setSession } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function DoctorRegister() {
  const nav = useNavigate();
  const [form, setForm] = useState({ doctor_name: "", phone: "", password: "", clinic_name: "", clinic_address: "" });
  const [loading, setLoading] = useState(false);

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.doctor_name.trim()) return toast.error("Enter your name");
    if (!/^\d{7,15}$/.test(form.phone)) return toast.error("Enter a valid phone");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!form.clinic_name.trim() || !form.clinic_address.trim()) return toast.error("Clinic info required");
    setLoading(true);
    try {
      const { data } = await api.post("/doctor/register", form);
      setSession({ token: data.token, role: "doctor", user: data.doctor });
      toast.success("Account created");
      nav("/doctor/dashboard", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md card-soft p-8">
        <h1 className="text-3xl font-display tracking-tight text-slate-900">Create Doctor Account</h1>
        <p className="mt-2 text-slate-500 text-sm">Self-registration. No approval needed.</p>
        <div className="mt-8 grid gap-5">
          <div><Label>Doctor name</Label>
            <Input data-testid="dr-name" value={form.doctor_name} onChange={upd("doctor_name")} placeholder="e.g. Anjali Verma" className="mt-2 h-12 rounded-xl" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Phone</Label>
              <Input data-testid="dr-phone" inputMode="numeric" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 15) })} className="mt-2 h-12 rounded-xl" /></div>
            <div><Label>Password</Label>
              <Input data-testid="dr-password" type="password" value={form.password} onChange={upd("password")} className="mt-2 h-12 rounded-xl" /></div>
          </div>
          <div><Label>Clinic / hospital name</Label>
            <Input data-testid="dr-clinic" value={form.clinic_name} onChange={upd("clinic_name")} placeholder="e.g. Sunrise Children's Clinic" className="mt-2 h-12 rounded-xl" /></div>
          <div><Label>Clinic address</Label>
            <Textarea data-testid="dr-address" value={form.clinic_address} onChange={upd("clinic_address")} placeholder="Street, city, state" className="mt-2 rounded-xl" rows={3} /></div>
        </div>
        <Button data-testid="dr-submit" type="submit" disabled={loading} className="mt-8 w-full h-12 rounded-full bg-sky-700 hover:bg-sky-800 text-white">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
        </Button>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <Link to="/doctor/login" className="text-sky-700 font-medium hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
