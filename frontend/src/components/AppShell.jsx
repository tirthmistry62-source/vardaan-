import { Link, useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, Settings } from "lucide-react";
import { api, clearSession, getSession } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import LeafLogo from "@/components/LeafLogo";

export default function AppShell({ children, showNotifications = false, unreadCount = 0, showBack = false, backTo = null, settingsPath = null }) {
  const nav = useNavigate();
  const session = getSession();
  const { t } = useTranslation();



  const logout = () => {
    clearSession();
    nav("/select-role");
  };

  return (
    <div className="min-h-screen aurora-bg">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                data-testid="header-back-btn"
                onClick={() => (backTo ? nav(backTo) : nav(-1))}
                className="rounded-full shrink-0"
                aria-label={t("back")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <Link to="/" data-testid="brand-logo" className="flex items-center gap-2 min-w-0">
              <LeafLogo size={56} />
              <span className="font-display text-lg tracking-tight truncate">Vardaan+</span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
 

  <ThemeToggle />
            {settingsPath && (
              <Button
                variant="ghost"
                size="icon"
                data-testid="nav-settings-btn"
                onClick={() => nav(settingsPath)}
                className="rounded-full"
                aria-label={t("settings")}
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
                aria-label={t("notifications")}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold grid place-items-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            )}
           
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
