import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Syringe } from "lucide-react";

export default function ParentNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/parent/notifications");
        setItems(data);
        // mark all as read
        await Promise.all(data.filter(x => !x.read).map(x => api.post(`/parent/notifications/${x.id}/read`)));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AppShell showBack backTo="/parent/dashboard">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 grid place-items-center">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-display tracking-tight text-slate-900">Notifications</h1>
          <p className="text-slate-500 text-sm">Vaccination updates for your children.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[0,1,2].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="card-soft p-10 text-center text-slate-500">No notifications yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map(n => (
            <div key={n.id} data-testid={`notif-${n.id}`} className={`card-soft p-4 flex items-start gap-4 ${n.read ? "" : "border-teal-300"}`}>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 grid place-items-center shrink-0">
                <Syringe className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900">{n.title}</div>
                <div className="text-sm text-slate-600 mt-0.5">{n.body}</div>
                <div className="text-xs text-slate-400 mt-1">{new Date(n.created_at).toLocaleString("en-IN")}</div>
              </div>
              {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-teal-500 mt-2" />}
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
