import { useState } from "react"
import { Link } from "react-router-dom"
import { DashboardFrame } from "../components/DashboardFrame"
import { ProblemRow } from "../components/ProblemRow"
import { useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { helloName } from "../data/logic"

const NAV = [
  { id: "my-reports", label: "My Submissions" },
  { id: "new-report", label: "File New Problem" },
]

export default function CitizenDashboard() {
  const { user, problems, submitFeedback } = useStore()
  const [view, setView] = useState("my-reports")
  const name = helloName(user)
  useTitle(`Hello ${name}`)
  const mine = problems.filter((item) =>
    item.ownerId === user.id
    || item.ownerName === user.name
    || (user.email && item.ownerEmail === user.email),
  )
  const needsFeedback = mine.find((item) => item.status === "completed" && !item.feedback)

  const sidebar = (
    <aside className="flex flex-col h-full w-full">
      <label className="mb-3 block text-sm lg:hidden">
        <span className="mb-1 block text-xs font-bold tracking-[0.14em] text-emerald-700 uppercase dark:text-emerald-400">Section</span>
        <select value={view} onChange={(event) => setView(event.target.value)} className="w-full rounded-2xl border-2 border-emerald-500 bg-white dark:bg-slate-900 dark:border-emerald-600 px-3.5 py-2.5 font-bold text-slate-900 dark:text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] outline-none focus:border-emerald-500">
          {NAV.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
          <option value="settings">Settings</option>
        </select>
      </label>
      <nav className="hidden lg:flex lg:flex-col flex-1">
        {/* Top: Section header + nav items */}
        <div className="flex-1 space-y-1.5">
          <div className="px-3 py-1.5 text-xs font-bold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase border-b border-emerald-200 dark:border-emerald-800/80 mb-2 pb-2">
            Citizen Desk
          </div>
          {NAV.map((item) => {
            const active = view === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-bold transition-all duration-200 ${
                  active && view !== "settings"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border-2 border-emerald-400 translate-x-1"
                    : "text-slate-700 dark:text-slate-200 border border-transparent hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-800 dark:hover:text-emerald-300 hover:translate-x-1"
                }`}
              >
                <span>{item.label}</span>
                <span className={`text-xs transition-transform duration-200 ${active && view !== "settings" ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"}`}>
                  →
                </span>
              </button>
            )
          })}
        </div>

        {/* Bottom: Settings / Profile */}
        <div className="mt-auto pt-4">
          <div className="border-t border-emerald-200 dark:border-emerald-800/80 pt-3">
            <button
              type="button"
              onClick={() => setView("settings")}
              className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-all duration-200 ${
                view === "settings"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border-2 border-emerald-400"
                  : "text-slate-700 dark:text-slate-200 border border-transparent hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-800 dark:hover:text-emerald-300"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </button>
          </div>

          {/* Mini profile card */}
          <div className="mt-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold shadow-md shadow-emerald-600/25">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || "User"}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                {user?.role === "community" ? user?.roleLabel || "Community" : user?.role || "Citizen"}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )


  return (
    <DashboardFrame
      eyebrow={user.role === "community" ? user.roleLabel || "Community" : "Citizen"}
      title={`Hello ${name}`}
      subtitle={user.role === "community" ? "Reports filed by your organisation." : "Reports you have placed in the queue."}
      sidebar={sidebar}
    >
      {view === "my-reports" ? (
        mine.length === 0 ? (
          <div className="w-full rounded-[28px] border border-dashed border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 px-6 py-16 text-center shadow-[0_0_20px_-3px_rgba(16,185,129,0.15)]">
            <p className="font-display text-3xl font-normal text-slate-900 dark:text-white sm:text-4xl">No problem reported yet</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
              When you file a challenge it will sit here with the campus, the partner, and whether it is still pending.
            </p>
            <Link to="/report" className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition-colors">
              Report a problem →
            </Link>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{mine.length} in your name</p>
              <Link to="/report" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">Report another →</Link>
            </div>
            {mine.map((problem) => (
              <ProblemRow
                key={problem.id}
                problem={problem}
                defaultOpen={needsFeedback ? problem.id === needsFeedback.id : problem.id === mine[0].id}
                onFeedback={submitFeedback}
              />
            ))}
          </div>
        )
      ) : view === "settings" ? (
        <div className="w-full space-y-6">
          {/* Profile Header Card */}
          <div className="w-full rounded-[28px] border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-8 shadow-[0_0_20px_-3px_rgba(16,185,129,0.18)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-3xl font-bold shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-100 dark:ring-emerald-900/60">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-normal text-slate-900 dark:text-white sm:text-3xl">{user?.name || "User"}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || "No email provided"}</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    {user?.role === "community" ? user?.roleLabel || "Community" : user?.role || "Citizen"}
                  </span>
                  {user?.org && (
                    <span className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {user.org}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Full Name</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || "—"}</p>
            </div>

            <div className="rounded-2xl border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Email</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.email || "—"}</p>
            </div>

            <div className="rounded-2xl border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Role</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{user?.role === "community" ? user?.roleLabel || "Community" : user?.role || "Citizen"}</p>
            </div>

            <div className="rounded-2xl border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Reports Filed</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{mine.length}</p>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="rounded-[28px] border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-sm font-bold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase mb-4">Activity Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{mine.filter((p) => ["submitted", "in_validation", "assigned", "requested"].includes(p.status)).length}</p>
                <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 mt-1">In Progress</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{mine.filter((p) => p.status === "completed").length}</p>
                <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mt-1">Completed</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{mine.filter((p) => p.feedback).length}</p>
                <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 mt-1">Feedback Given</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-[28px] border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-8 shadow-[0_0_20px_-3px_rgba(16,185,129,0.18)] text-center space-y-4">
          <h2 className="font-display text-3xl font-normal text-slate-900 dark:text-white">Ready to file a new challenge?</h2>
          <p className="mx-auto max-w-lg text-sm text-slate-600 dark:text-slate-400">
            Submit local issues directly to Jharkhand societal innovation workspace and get tracked solutions from university partners.
          </p>
          <div className="pt-2">
            <Link to="/report" className="inline-flex rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-all hover:scale-105">
              Launch Problem Reporter →
            </Link>
          </div>
        </div>
      )}
    </DashboardFrame>
  )
}
