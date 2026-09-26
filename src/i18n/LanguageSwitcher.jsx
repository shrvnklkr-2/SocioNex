import { useLanguage } from "../i18n/LanguageContext"

export function LanguageSwitcher({ className = "", size = "sm" }) {
  const { lang, setLang, langs, t } = useLanguage()
  const compact = size === "sm"

  return (
    <div
      className={`inline-flex max-w-full items-center rounded-full border border-emerald-300/80 bg-white/90 p-0.5 shadow-sm dark:border-emerald-700 dark:bg-slate-900/90 ${className}`}
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
            title={item.label}
            className={`rounded-full px-1.5 py-1 text-[10px] font-semibold transition-all xs:px-2 sm:px-3 sm:text-[11px] ${
              compact ? "" : "sm:text-xs"
            } ${
              active
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-900 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-950/50"
            }`}
            aria-pressed={active}
          >
            <span className="sm:hidden">{item.short || item.label}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
