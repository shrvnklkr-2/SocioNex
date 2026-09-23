import { createContext, useContext, useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

const KEY = "socionex-theme"
const ThemeContext = createContext(null)

function preferredTheme() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === "light" || saved === "dark") return saved
  } catch {
    /* private mode */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(preferredTheme)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.style.colorScheme = theme
    localStorage.setItem(KEY, theme)
  }, [theme])

  const toggle = () => setTheme((current) => (current === "dark" ? "light" : "dark"))

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error("useTheme must be used inside ThemeProvider")
  return value
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center gap-1 rounded-full border border-line bg-mist p-1"
    >
      <span className={`grid h-7 w-7 place-items-center rounded-full transition ${dark ? "text-muted" : "bg-card text-ink shadow-sm"}`}>
        <Sun className="h-3.5 w-3.5" />
      </span>
      <span className={`grid h-7 w-7 place-items-center rounded-full transition ${dark ? "bg-card text-ink shadow-sm" : "text-muted"}`}>
        <Moon className="h-3.5 w-3.5" />
      </span>
    </button>
  )
}
