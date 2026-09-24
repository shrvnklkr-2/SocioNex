import { Link } from "react-router-dom"
import { LogOut } from "lucide-react"
import { Logo } from "./Logo"
import { Notifications } from "./Notifications"
import { ThemeToggle } from "./Theme"
import { useStore } from "../context/Store"

export function DashboardFrame({ eyebrow, title, subtitle, children, sidebar }) {
  const { user, signOut, apiOnline } = useStore()

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Back to Socionex home">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted md:inline">{user?.org || user?.name}</span>
            <span className={`hidden rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline ${apiOnline ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200" : "bg-amber-500/15 text-amber-800"}`}>
              {apiOnline ? "API live" : "Local demo"}
            </span>
            <ThemeToggle />
            <Notifications />
            <button type="button" onClick={signOut} className="inline-flex items-center gap-1 rounded-full border border-line bg-card px-3 py-2 text-sm">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row">
        {sidebar}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">{eyebrow}</p>
          <h1 className="mt-1 font-display text-4xl text-ink sm:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
      </div>
      <footer className="border-t border-line py-6 text-center text-sm text-muted">Socionex · Jharkhand societal innovation workspace</footer>
    </div>
  )
}
