import { Link } from "react-router-dom";
import {
  HeartPulse,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Languages,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function SelectRole() {
  const { i18n, t } = useTranslation();

  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRef = useRef(null); 

  const changeLanguage = async (language) => {
    await i18n.changeLanguage(language);
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (languageRef.current && !languageRef.current.contains(event.target)) {
      setLanguageOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div className="min-h-screen aurora-bg px-6 sm:px-8 py-10 sm:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-end gap-4">


          <div className="flex items-center gap-2 shrink-0">
            {/* Language selector */}
            <div ref={languageRef} className="relative">
              <Button
                variant="ghost"
                onClick={() => setLanguageOpen((open) => !open)}
                
                className="rounded-full h-11 px-4 gap-2 border border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={t("language")}
              >
                <Languages className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {t("language")}
                </span>
              </Button>

              {languageOpen && (
  <div className="absolute right-0 top-12 z-50">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-1 min-w-[130px]">
                  <button
                    type="button"
                    onClick={() => {
  changeLanguage("en");
  setLanguageOpen(false);
}}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {t("english")}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
  changeLanguage("hi");
  setLanguageOpen(false);
}}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {t("hindi")}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
  changeLanguage("mr");
  setLanguageOpen(false);
}}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {t("marathi")}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
  changeLanguage("gu");
  setLanguageOpen(false);
}}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {t("gujarati")}
                  </button>
                </div> 
              </div>
            )}
            </div>

            <ThemeToggle />
          </div>
        </div>

        {/* Main heading */}
        <h1 className="mt-7 sm:mt-8 text-4xl sm:text-5xl font-display tracking-tight leading-[1.15] text-slate-900 dark:text-slate-100 max-w-2xl">
          {t("selectRole.title")}
        </h1>

        <p className="mt-5 text-slate-600 dark:text-slate-400 max-w-2xl leading-7">
          {t("selectRole.description")}
        </p>

        {/* Role cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mt-12">
          {/* Parent */}
          <Link
            to="/parent/login"
            data-testid="role-parent-card"
            className="group card-soft hover-lift tap-scale p-8 sm:p-9 block relative overflow-hidden"
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-teal-100/60 blur-2xl" />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white grid place-items-center">
                <HeartPulse className="w-7 h-7" strokeWidth={1.5} />
              </div>

              <h2 className="mt-7 text-2xl font-display tracking-tight leading-snug text-slate-900 dark:text-slate-100">
                {t("selectRole.parentTitle")}
              </h2>

              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-7 max-w-md">
                {t("selectRole.parentDescription")}
              </p>

              <div className="mt-7 inline-flex items-center gap-2 text-teal-700 dark:text-teal-300 font-medium">
                {t("selectRole.getStarted")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
              </div>
            </div>
          </Link>

          {/* Doctor */}
          <Link
            to="/doctor/login"
            data-testid="role-doctor-card"
            className="group card-soft hover-lift tap-scale p-8 sm:p-9 block relative overflow-hidden"
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-sky-100/60 blur-2xl" />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white grid place-items-center">
                <Stethoscope className="w-7 h-7" strokeWidth={1.5} />
              </div>

              <h2 className="mt-7 text-2xl font-display tracking-tight leading-snug text-slate-900 dark:text-slate-100">
                {t("selectRole.doctorTitle")}
              </h2>

              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-7 max-w-md">
                {t("selectRole.doctorDescription")}
              </p>

              <div className="mt-7 inline-flex items-center gap-2 text-sky-700 dark:text-sky-300 font-medium">
                {t("selectRole.getStarted")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-12 text-center text-slate-400 dark:text-slate-500 text-xs leading-relaxed">
          {t("selectRole.internetRequired")}
        </p>
      </div>
    </div>
  );
}