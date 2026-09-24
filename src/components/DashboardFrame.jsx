import { Link } from "react-router-dom"
import { LogOut } from "lucide-react"
import { Logo } from "./Logo"
import { Notifications } from "./Notifications"
import { ThemeToggle } from "./Theme"
import { useStore } from "../context/Store"

export function DashboardFrame({ eyebrow, title, subtitle, children, sidebar }) {
  const { user, signOut, apiOnline } = useStore()

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b-2 border-emerald-500 bg-white/95 backdrop-blur-md dark:border-emerald-600 dark:bg-slate-950/95 shadow-[0_4px_20px_rgba(16,185,129,0.15)]">
        <div className="mx-auto flex h-16 max-w-[1536px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Back to Sahyog home">
            <Logo />
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-bold text-emerald-950 dark:text-emerald-200 md:inline">
              {user?.org || user?.name}
            </span>

            <span className={`hidden rounded-full px-3 py-1 text-[11px] font-bold border sm:inline ${apiOnline ? "bg-emerald-100 border-emerald-400 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-600 dark:text-emerald-300" : "bg-amber-100 border-amber-400 text-amber-900"}`}>
              {apiOnline ? "API live" : "Local demo"}
            </span>

            <ThemeToggle />
            <Notifications />

            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-emerald-500 bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-900 shadow-sm transition-all hover:bg-emerald-600 hover:text-white dark:bg-slate-900 dark:text-emerald-200 dark:hover:bg-emerald-600 dark:hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - Full Width Ratio Grid */}
      <div className="mx-auto max-w-[1536px] px-4 py-6 sm:px-6 lg:px-8 w-full">
        {sidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 lg:gap-8 items-start w-full">
            {sidebar}
            <div className="min-w-0 flex-1 w-full space-y-4">
              {eyebrow && (
                <p className="text-[11px] font-extrabold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
                  {eyebrow}
                </p>
              )}

              {title && (
                <h1 className="font-display text-3xl font-normal text-slate-900 sm:text-4xl dark:text-white">
                  {title}
                </h1>
              )}

              {subtitle && (
                <p className="max-w-3xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {subtitle}
                </p>
              )}

              <div className="pt-2 w-full space-y-6">{children}</div>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {eyebrow && (
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
                {eyebrow}
              </p>
            )}

            {title && (
              <h1 className="font-display text-3xl font-normal text-slate-900 sm:text-4xl dark:text-white">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="max-w-3xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            )}

            <div className="pt-2 w-full space-y-6">{children}</div>
          </div>
        )}
      </div>

      <footer className="mt-12 border-t border-emerald-200/80 bg-white py-6 text-center text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-950">
        SAHYOG · Jharkhand societal innovation workspace
      </footer>
    </div>
  )
}
