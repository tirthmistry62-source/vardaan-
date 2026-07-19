import { Link, useNavigate } from "react-router-dom";
import { Syringe, LogOut, Bell, ArrowLeft, Settings } from "lucide-react";
import { clearSession, getSession } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AppShell({ children, showNotifications = false, unreadCount = 0, showBack = false, backTo = null, showSettings = false }) {
  const nav = useNavigate();
  const session = getSession();

  const logout = () => {
    clearSession();
    nav("/select-role");
  };

  return (
    <div className="min-h-screen aurora-bg">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                data-testid="header-back-btn"
                onClick={() => (backTo ? nav(backTo) : nav(-1))}
                className="rounded-full shrink-0"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <Link to="/" data-testid="brand-logo" className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white grid place-items-center shrink-0">
                <Syringe className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <span className="font-display text-lg tracking-tight truncate">VaxLedger</span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            {showSettings && (
              <Button
                variant="ghost"
                size="icon"
                data-testid="nav-settings-btn"
                onClick={() => nav("/parent/settings")}
                className="rounded-full"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
            {showNotifications && (
              <Button
                variant="ghost"
                size="icon"
                data-testid="nav-notifications-btn"
                onClick={() => nav("/parent/notifications")}
                className="rounded-full relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold grid place-items-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            )}
            {session && (
              <Button
                variant="ghost"
                data-testid="nav-logout-btn"
                onClick={logout}
                className="rounded-full gap-2"
              >
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
