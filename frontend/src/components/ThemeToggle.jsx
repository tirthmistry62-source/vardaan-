import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";

export default function ThemeToggle({ className = "", floating = false }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const base = floating
    ? "fixed top-4 right-4 z-50 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-md"
    : "rounded-full";
  return (
    <Button
      variant="ghost"
      size="icon"
      data-testid="theme-toggle"
      onClick={toggle}
      className={`${base} relative overflow-hidden ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className={`w-5 h-5 transition-all duration-300 ${
          isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`w-5 h-5 absolute transition-all duration-300 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
        }`}
      />
    </Button>
  );
}
