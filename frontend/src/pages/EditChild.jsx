import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Trash2, ShieldAlert } from "lucide-react";

const phraseFor = (name) =>
  `Yes, I want to delete ${name}'s account, and I approve that the vaccination details and history will be permanently deleted and cannot be recovered.`;

export default function EditChild() {
  const nav = useNavigate();
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", dob: "", gender: "", weight_kg: "" });

  const [warnOpen, setWarnOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/children/${id}`);
        setChild(data);
        setForm({
          name: data.name,
          dob: data.dob,
          gender: data.gender,
          weight_kg: data.weight_kg != null ? String(data.weight_kg) : "",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name cannot be empty");
    if (!form.dob) return toast.error("Date of birth required");
    if (!form.gender) return toast.error("Gender required");
    const w = parseFloat(form.weight_kg);
    if (!form.weight_kg || isNaN(w) || w <= 0 || w > 200) return toast.error("Enter a valid weight in kg");
    setSaving(true);
    try {
      await api.patch(`/parent/children/${id}`, {
        name: form.name.trim(),
        dob: form.dob,
        gender: form.gender,
        weight_kg: w,
      });
      toast.success("Child updated");
      nav(`/parent/child/${id}`);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    const expected = phraseFor(child.name);
    if (phrase.trim() !== expected) return toast.error("Phrase does not match");
    setDeleting(true);
    try {
      await api.post(`/parent/children/${id}/delete`, { confirm_phrase: phrase.trim() });
      toast.success(`${child.name} deleted`);
      nav("/parent/dashboard", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <AppShell showBack><Skeleton className="h-40 rounded-2xl" /></AppShell>;
  if (!child) return <AppShell showBack><div className="card-soft p-8 text-center text-slate-600">Child not found.</div></AppShell>;

  return (
    <AppShell showBack backTo={`/parent/child/${id}`}>
      <div className="max-w-xl">
        <h1 className="text-3xl font-display tracking-tight text-slate-900">Edit child</h1>
        <p className="text-slate-500 mt-2">Update {child.name}&apos;s details.</p>

        <form onSubmit={save} className="card-soft p-6 mt-6 grid gap-5">
          <div>
            <Label>Child&apos;s name</Label>
            <Input data-testid="edit-child-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 h-12 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date of birth</Label>
              <Input data-testid="edit-child-dob" type="date" max={new Date().toISOString().slice(0, 10)} value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="mt-2 h-12 rounded-xl" />
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger data-testid="edit-child-gender" className="mt-2 h-12 rounded-xl">
                  <SelectValue />
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
            <div className="mt-2 flex items-stretch rounded-xl border border-slate-300 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-600 overflow-hidden bg-white">
              <Input
                data-testid="edit-child-weight"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={form.weight_kg}
                onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                placeholder="e.g. 3.2"
                className="flex-1 h-12 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
              <span className="px-4 flex items-center bg-slate-50 text-slate-500 font-semibold border-l border-slate-200 select-none">kg</span>
            </div>
          </div>
          <Button data-testid="edit-child-save" type="submit" disabled={saving} className="h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
          </Button>
        </form>

        <div className="card-soft p-6 mt-8 border-rose-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 grid place-items-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg text-slate-900">Delete child</h2>
              <p className="text-sm text-slate-500 mt-1">
                Permanently deletes {child.name}, their vaccination history, and all related notifications. Cannot be undone.
              </p>
              <Button data-testid="delete-child-btn" onClick={() => setWarnOpen(true)} variant="destructive" className="mt-4 rounded-full gap-2">
                <Trash2 className="w-4 h-4" /> Delete {child.name}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={warnOpen} onOpenChange={setWarnOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Delete {child.name}?</DialogTitle>
            <DialogDescription>
              This will permanently erase every vaccination record, notification, and document tied to {child.name}. Neither you nor the other parent will be able to recover this data.
              <br /><br />
              <span className="font-semibold text-rose-600">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" data-testid="child-warn-cancel" onClick={() => setWarnOpen(false)} className="rounded-full">Cancel</Button>
            <Button variant="destructive" data-testid="child-warn-continue" onClick={() => { setWarnOpen(false); setConfirmOpen(true); }} className="rounded-full">
              I understand, continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={(o) => { setConfirmOpen(o); if (!o) setPhrase(""); }}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Final confirmation</DialogTitle>
            <DialogDescription>
              To confirm, type this exact phrase:
              <div className="mt-3 p-3 rounded-lg bg-slate-100 text-slate-900 font-mono text-xs leading-relaxed select-all whitespace-pre-wrap break-words">
                {phraseFor(child.name)}
              </div>
            </DialogDescription>
          </DialogHeader>
          <textarea
            data-testid="child-delete-phrase"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Type the phrase above exactly"
            rows={4}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm"
          />
          <DialogFooter className="gap-2">
            <Button variant="ghost" data-testid="child-confirm-cancel" onClick={() => setConfirmOpen(false)} className="rounded-full">Cancel</Button>
            <Button
              variant="destructive"
              data-testid="child-confirm-delete"
              onClick={doDelete}
              disabled={deleting || phrase.trim() !== phraseFor(child.name)}
              className="rounded-full"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
