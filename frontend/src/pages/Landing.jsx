import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "@/lib/api";

export default function Landing() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => {
      const s = getSession();
      if (s?.role === "parent") nav("/parent/dashboard", { replace: true });
      else if (s?.role === "doctor") nav("/doctor/dashboard", { replace: true });
      else nav("/select-role", { replace: true });
    }, 900);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div className="min-h-screen aurora-bg grid place-items-center px-6">
      <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-teal-700 text-white grid place-items-center shadow-[0_20px_60px_rgba(15,118,110,0.25)]">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 2 4 4-6 6-4-4z"/><path d="m11 5 8 8"/><path d="M2 22l7-7"/><path d="m11 12-4 4 4 4"/>
          </svg>
        </div>
        <h1 className="mt-6 text-4xl sm:text-5xl font-display tracking-tight text-slate-900">Vardaan+</h1>
        <p className="mt-3 text-slate-600 max-w-md mx-auto">A lifelong vaccination record for every child. Trusted by parents. Verified by doctors.</p>
        <div className="mt-8 inline-flex items-center gap-2 text-slate-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          Loading securely…
        </div>
      </div>
    </div>
  );
}
