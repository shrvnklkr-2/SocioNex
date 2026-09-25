import { useLanguage } from "../i18n/LanguageContext"

export function LanguageSwitcher({ className = "", size = "sm" }) {
  const { lang, setLang, langs, t } = useLanguage()
  const compact = size === "sm"

  return (
    <div
      className={`inline-flex items-center rounded-full border border-emerald-300/80 bg-white/90 p-0.5 shadow-sm dark:border-emerald-700 dark:bg-slate-900/90 ${className}`}
      role="group"
      aria-label={t("nav.language")}
    >
      {langs.map((item) => {
        const active = lang === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLang(item.id)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all sm:px-3 ${
              compact ? "" : "sm:text-xs"
            } ${
              active
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-900 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-950/50"
            }`}
            aria-pressed={active}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
