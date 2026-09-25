import { Link } from "react-router-dom"
import { LogOut } from "lucide-react"
import { Logo } from "./Logo"
import { Notifications } from "./Notifications"
import { ThemeToggle } from "./Theme"
import { useStore } from "../context/Store"

export function DashboardFrame({ eyebrow, title, subtitle, children, sidebar }) {
  const { user, signOut, apiOnline } = useStore()

  return (
    <div className="flex flex-col h-screen bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
      {/* Top Header — fixed height */}
      <header className="shrink-0 z-40 border-b-2 border-emerald-500 bg-white/95 backdrop-blur-md dark:border-emerald-600 dark:bg-slate-950/95 shadow-[0_4px_20px_rgba(16,185,129,0.15)]">
        <div className="mx-auto flex h-16 max-w-[1536px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Back to Socionex home">
            <Logo />
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-bold text-emerald-950 dark:text-emerald-200 md:inline">
              {user?.org || user?.name}
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

      {/* Body — fills remaining height */}
      {sidebar ? (
        <div className="flex flex-1 min-h-0 w-full">
          {/* Sidebar: fixed column, full remaining height, scrolls independently */}
          <div className="hidden lg:flex lg:w-[260px] lg:shrink-0 border-r border-emerald-200/80 dark:border-emerald-900/60 bg-white/60 dark:bg-slate-950/60 overflow-y-auto scrollbar-hide">
            <div className="flex flex-col w-full p-4">
              {sidebar}
            </div>
          </div>

          {/* Main content: scrolls independently */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 py-6 w-full space-y-4">
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

              <footer className="mt-12 border-t border-emerald-200/80 py-6 text-center text-xs font-medium text-slate-500 dark:border-slate-800">
                SOCIONEX · Jharkhand societal innovation workspace
              </footer>
            </div>
          </div>

          {/* Mobile sidebar dropdown */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-950/95 border-t-2 border-emerald-500 px-4 py-3 backdrop-blur-md">
            {sidebar}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1536px] px-4 py-6 sm:px-6 lg:px-8 w-full space-y-4">
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

            <footer className="mt-12 border-t border-emerald-200/80 py-6 text-center text-xs font-medium text-slate-500 dark:border-slate-800">
              SOCIONEX · Jharkhand societal innovation workspace
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}
