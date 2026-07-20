import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { api, getSession } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function AddChild() {
  const nav = useNavigate();
  const session = getSession();
  const myAadhaar = session?.user?.aadhaar || "";
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    weight_kg: "",
    parent_role: "mother", // which parent am I
    other_aadhaar: "",
    child_aadhaar: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Enter child's name");
    if (!form.dob) return toast.error("Select date of birth");
    if (!form.gender) return toast.error("Select gender");
    const w = parseFloat(form.weight_kg);
    if (!form.weight_kg || isNaN(w) || w <= 0 || w > 200) return toast.error("Enter a valid weight in kg");
    if (form.other_aadhaar && !/^\d{12}$/.test(form.other_aadhaar))
      return toast.error("Other parent's Aadhaar must be 12 digits");
    if (form.child_aadhaar && !/^\d{12}$/.test(form.child_aadhaar))
      return toast.error("Child Aadhaar must be 12 digits");

    const payload = {
      name: form.name.trim(),
      dob: form.dob,
      gender: form.gender,
      weight_kg: w,
      child_aadhaar: form.child_aadhaar || null,
      mother_aadhaar: form.parent_role === "mother" ? myAadhaar : (form.other_aadhaar || null),
      father_aadhaar: form.parent_role === "father" ? myAadhaar : (form.other_aadhaar || null),
    };
    setLoading(true);
    try {
      await api.post("/parent/children", payload);
      toast.success(`${form.name} added`);
      nav("/parent/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not add child");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell showBack backTo="/parent/dashboard">
      <button data-testid="back-btn" onClick={() => nav(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="max-w-xl">
        <h1 className="text-3xl font-display tracking-tight text-slate-900 dark:text-slate-100">Add Child</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">This child will be linked to both parents automatically using Aadhaar.</p>

        <form onSubmit={submit} className="card-soft p-8 mt-8 grid gap-5">
          <div>
            <Label>Child&apos;s name</Label>
            <Input data-testid="ch-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="mt-2 h-12 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date of birth</Label>
              <Input data-testid="ch-dob" type="date" max={new Date().toISOString().slice(0, 10)} value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="mt-2 h-12 rounded-xl" />
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger data-testid="ch-gender" className="mt-2 h-12 rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Current weight (kg)</Label>
            <div className="mt-2 flex items-stretch rounded-xl border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-teal-500 dark:ring-teal-400/20 focus-within:border-teal-600 overflow-hidden bg-white">
              <Input
                data-testid="ch-weight"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={form.weight_kg}
                onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                placeholder="e.g. 3.2"
                className="flex-1 h-12 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
              <span className="px-4 flex items-center bg-slate-50 text-slate-500 dark:text-slate-400 font-semibold border-l border-slate-200 dark:border-slate-800 select-none">kg</span>
            </div>
          </div>
          <div>
            <Label>You are the</Label>
            <Select value={form.parent_role} onValueChange={(v) => setForm({ ...form, parent_role: v })}>
              <SelectTrigger data-testid="ch-parent-role" className="mt-2 h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mother">Mother</SelectItem>
                <SelectItem value="father">Father</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Other parent&apos;s Aadhaar (optional)</Label>
            <Input data-testid="ch-other-aadhaar" inputMode="numeric" value={form.other_aadhaar}
              onChange={(e) => setForm({ ...form, other_aadhaar: e.target.value.replace(/\D/g, "").slice(0, 12) })}
              placeholder="12 digits — auto-links this child to them" className="mt-2 h-12 rounded-xl" />
          </div>
          <div>
            <Label>Child Aadhaar (optional)</Label>
            <Input data-testid="ch-child-aadhaar" inputMode="numeric" value={form.child_aadhaar}
              onChange={(e) => setForm({ ...form, child_aadhaar: e.target.value.replace(/\D/g, "").slice(0, 12) })}
              placeholder="12 digits — for lifelong lookup" className="mt-2 h-12 rounded-xl" />
          </div>
          <Button data-testid="ch-submit" type="submit" disabled={loading} className="h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add child"}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
