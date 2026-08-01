import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { api, getSession } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Baby, Calendar, User2, ArrowRight } from "lucide-react";
import { ageString, completionPercent, maskAadhaar } from "@/lib/vaccineStatus";

export default function ParentDashboard() {
  const nav = useNavigate();
  const session = getSession();
  const [children, setChildren] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    if (!session || session.role !== "parent") {
      nav("/parent/login", { replace: true });
      return;
    }
    (async () => {
      try {
        const [k, n] = await Promise.all([
          api.get("/parent/children"),
          api.get("/parent/notifications"),
        ]);
        setChildren(k.data);
        setUnread(n.data.filter((x) => !x.read).length);
      } finally {
        setLoading(false);
      }
    })();
     
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const firstName = session?.user?.full_name?.split(" ")[0] || "there";

  return (
    <AppShell showNotifications unreadCount={unread} settingsPath="/parent/settings">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back</p>
          <h1 className="text-4xl font-display tracking-tight text-slate-900 dark:text-slate-100 mt-1">Hi, {firstName}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Aadhaar: <span className="font-medium text-slate-700 dark:text-slate-300">{maskAadhaar(session?.user?.aadhaar)}</span></p>
        </div>
        <Button
          data-testid="add-child-btn"
          onClick={() => nav("/parent/add-child")}
          className="rounded-full h-12 px-6 bg-teal-700 hover:bg-teal-800 text-white gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Child
        </Button>
      </div>

      {session?.user?.access_code && (
        <div className="card-soft p-4 mb-6 border-sky-200 dark:border-sky-900/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Your access code</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Share this six-digit code with doctors when they need to update your child’s vaccine record.</p>
            </div>
            <div className="rounded-2xl bg-sky-50 dark:bg-sky-900/40 px-4 py-3 text-2xl font-semibold tracking-[0.3em] text-sky-700 dark:text-sky-300">
              {session.user.access_code}
            </div>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-lg font-display tracking-tight text-slate-800 dark:text-slate-200 mb-4">My Children</h2>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
          </div>
        ) : children.length === 0 ? (
          <div className="card-soft p-10 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-900/40 grid place-items-center text-teal-700 dark:text-teal-300">
              <Baby className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h3 className="mt-4 font-display text-xl text-slate-900 dark:text-slate-100">Add your first child</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm mx-auto">
              Start their vaccination record. We'll auto-generate India's UIP schedule based on their date of birth.
            </p>
            <Button data-testid="empty-add-child-btn" onClick={() => nav("/parent/add-child")} className="mt-6 rounded-full bg-teal-700 hover:bg-teal-800 h-11 px-6 text-white gap-2">
              <Plus className="w-4 h-4" /> Add Child
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((c) => {
              const pct = completionPercent(c.dob, c.vaccinations || []);
              return (
                <Link
                  key={c.id}
                  to={`/parent/child/${c.id}`}
                  data-testid={`child-card-${c.id}`}
                  className="card-soft hover-lift p-6 block"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-sky-100 grid place-items-center text-teal-700 dark:text-teal-300">
                      <User2 className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg text-slate-900 dark:text-slate-100 truncate">{c.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{c.gender} • {ageString(c.dob)}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Born {new Date(c.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Vaccination progress</span>
                      <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
