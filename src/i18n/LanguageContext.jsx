import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { LANGS, dictionaries } from "./translations"

const KEY = "socionex-lang"
const LanguageContext = createContext(null)

function format(template, vars = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => (vars[key] == null ? "" : String(vars[key])))
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY)
      return dictionaries[saved] ? saved : "en"
    } catch {
      return "en"
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, lang)
    document.documentElement.lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "sat"
  }, [lang])

  const value = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.en
    const t = (key, vars) => {
      const raw = dict[key] ?? dictionaries.en[key] ?? key
      return vars ? format(raw, vars) : raw
    }
    const setLang = (next) => {
      if (dictionaries[next]) setLangState(next)
    }
    return { lang, setLang, t, langs: LANGS }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider")
  return value
}
