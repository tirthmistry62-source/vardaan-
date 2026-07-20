import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import LeafLogo from "@/components/LeafLogo";

export default function Landing() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => {
      const s = getSession();
      if (s?.role === "parent") nav("/parent/dashboard", { replace: true });
      else if (s?.role === "doctor") nav("/doctor/dashboard", { replace: true });
      else nav("/select-role", { replace: true });
    }, 2000);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div className="min-h-screen aurora-bg grid place-items-center px-6">
      <ThemeToggle floating />
      <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mx-auto w-24 h-24 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900/40 grid place-items-center shadow-[0_20px_60px_rgba(22,163,74,0.20)]">
          <LeafLogo size={56} />
        </div>
        <h1 className="mt-6 text-4xl sm:text-5xl font-display tracking-tight text-slate-900 dark:text-slate-100">Vardaan+</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-md mx-auto">A lifelong vaccination record for every child. Trusted by parents. Verified by doctors.</p>
        <div className="mt-8 inline-flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Loading securely…
        </div>
      </div>
    </div>
  );
}
