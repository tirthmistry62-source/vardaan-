import { useEffect, useState } from "react";

export default function LeafLogo({ className = "", size = 24 }) {
  const [isDark, setIsDark] = useState(false);
  const wrapperClass = `rounded-[1.25rem] overflow-hidden border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 shadow-sm ${className}`.trim();

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    // Check initial state
    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const logoSrc = isDark ? "/logo-dark.png" : "/logo-light.png";

  return (
    <div className={wrapperClass} style={{ width: `${size}px`, height: `${size}px` }}>
      <img
        src={logoSrc}
        alt="Vardaan+"
        width={size}
        height={size}
        className="block w-full h-full object-contain"
      />
    </div>
  );
}
