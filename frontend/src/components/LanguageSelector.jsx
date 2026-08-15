import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const changeLanguage = async (language) => {
    await i18n.changeLanguage(language);
  };

  return (
    <div className="relative group">
     <Button
  variant="ghost"
  className="rounded-full h-10 px-4 gap-2 border border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
  aria-label={t("language")}
>
  <Languages className="w-5 h-5" />
  <span className="text-sm font-medium">{t("language")}</span>
</Button>

      <div className="absolute right-0 top-10 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-1 min-w-[130px]">
          <button
            type="button"
            onClick={() => changeLanguage("en")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {t("english")}
          </button>

          <button
            type="button"
            onClick={() => changeLanguage("hi")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {t("hindi")}
          </button>

          <button
            type="button"
            onClick={() => changeLanguage("mr")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {t("marathi")}
          </button>

          <button
            type="button"
            onClick={() => changeLanguage("gu")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {t("gujarati")}
          </button>
        </div>
      </div>
    </div>
  );
}