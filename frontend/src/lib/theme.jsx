import { createContext, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext(null);

function getInitial() {
  try {
    const saved = localStorage.getItem("vax_theme");
    if (saved === "light" || saved === "dark") return saved;
if (typeof window !== "undefined") {
  return "light";
}
  } catch (_e) {
    // ignore storage errors
  }
  return "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("vax_theme", theme);
    const t = setTimeout(() => root.classList.remove("theme-transition"), 260);
    return () => clearTimeout(t);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
