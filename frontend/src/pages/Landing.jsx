import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "@/lib/api";
import LeafLogo from "@/components/LeafLogo";

export default function Landing() {
  const nav = useNavigate();
  useEffect(() => {
    const s = getSession();
    if (s?.role === "parent") {
      nav("/parent/dashboard", { replace: true });
      return;
    } else if (s?.role === "doctor") {
      nav("/doctor/dashboard", { replace: true });
      return;
    }
    
    // If no session, show splash screen for 1.5 seconds then go to role selection
    const t = setTimeout(() => {
      nav("/select-role", { replace: true });
    }, 1500);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center px-6">
      <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mx-auto flex justify-center">
          <LeafLogo size={128} />
        </div>
      </div>
    </div>
  );
}
