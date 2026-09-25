import { useLocation, useNavigate, Link, Outlet } from "react-router-dom"
import { Menu, X, User } from "lucide-react"
import { useState, useEffect } from "react"
import { Logo } from "./Logo"
import { ThemeToggle } from "./Theme"
import { pathForRole } from "../data/logic"
import { useStore } from "../context/Store"
import { useLanguage } from "../i18n/LanguageContext"
import { LanguageSwitcher } from "../i18n/LanguageSwitcher"

export function Navbar() {
  const { user } = useStore()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const LINKS = [
    { id: "home", label: t("nav.home") },
    { id: "how-it-works", label: t("nav.how") },
    { id: "features", label: t("nav.features") },
    { id: "impact", label: t("nav.impact") },
  ]

  useEffect(() => {
    if (location.pathname !== "/") return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160

      for (let i = LINKS.length - 1; i >= 0; i--) {
        const link = LINKS[i]
        const el = document.getElementById(link.id)
        if (el) {
          const top = el.offsetTop
          if (scrollPosition >= top) {
            setActiveSection(link.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [location.pathname, t])

  const handleNavClick = (id, e) => {
    e.preventDefault()
    setOpen(false)
    setActiveSection(id)

    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 150)
    } else {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  const goWorkspace = () => {
    setOpen(false)
    navigate(user ? pathForRole(user.role) : "/sign-in")
  }

  const goRegister = () => {
    setOpen(false)
    navigate("/register")
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" onClick={(e) => handleNavClick("home", e)} aria-label="Socionex home">
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => {
            const isActive = location.pathname === "/" && activeSection === link.id
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(link.id, e)}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-0.5 dark:text-emerald-400 dark:border-emerald-400"
                    : "text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {link.label}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <ThemeToggle />

          <button
            type="button"
            onClick={goWorkspace}
            className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-slate-800 md:flex"
            aria-label="User account"
          >
            <User className="h-4 w-4" />
          </button>

          {user ? null : (
            <button
              type="button"
              onClick={goRegister}
              className="hidden rounded-full border border-emerald-300 px-4 py-1.5 text-xs font-semibold text-emerald-800 hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-200 md:inline-flex"
            >
              {t("nav.register")}
            </button>
          )}

          <button
            type="button"
            onClick={goWorkspace}
            className="hidden rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 md:inline-flex"
          >
            {user ? t("nav.workspace") : t("nav.signIn")}
          </button>

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 md:hidden dark:border-slate-800"
            aria-label="Menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-200 px-4 py-4 md:hidden dark:border-slate-800">
          <div className="mb-3">
            <LanguageSwitcher />
          </div>
          <div className="flex flex-col gap-3">
            {LINKS.map((link) => {
              const isActive = location.pathname === "/" && activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(link.id, e)}
                  className={`text-sm font-medium ${
                    isActive ? "text-emerald-600 font-bold dark:text-emerald-400" : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {link.label}
                </a>
              )
            })}
            {user ? null : (
              <button type="button" onClick={goRegister} className="text-left text-sm text-slate-600 dark:text-slate-400">
                {t("nav.register")}
              </button>
            )}
            <button
              type="button"
              onClick={goWorkspace}
              className="mt-2 rounded-full bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white"
            >
              {user ? t("nav.workspace") : t("nav.signIn")}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-xs leading-6 text-slate-600 dark:text-slate-400">
            {t("footer.tagline")}
          </p>
        </div>
        <p className="text-xs text-slate-400">{t("footer.nep")}</p>
      </div>
    </footer>
  )
}

export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Navbar />
      <main>{children ?? <Outlet />}</main>
      <Footer />
    </div>
  )
}
