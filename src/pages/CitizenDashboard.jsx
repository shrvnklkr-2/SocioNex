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
    <aside className="lg:w-60 lg:shrink-0 sticky top-20 z-20">
      <label className="mb-3 block text-sm lg:hidden">
        <span className="mb-1 block text-xs font-bold tracking-[0.14em] text-emerald-700 uppercase dark:text-emerald-400">Section</span>
        <select value={view} onChange={(event) => setView(event.target.value)} className="w-full rounded-2xl border-2 border-emerald-500 bg-white dark:bg-slate-900 dark:border-emerald-600 px-3.5 py-2.5 font-bold text-slate-900 dark:text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] outline-none focus:border-emerald-500">
          {NAV.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </label>
      <nav className="hidden rounded-[24px] border-2 border-emerald-500 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-[0_0_20px_rgba(16,185,129,0.25)] lg:block space-y-1.5">
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
                active
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border-2 border-emerald-400 translate-x-1"
                  : "text-slate-700 dark:text-slate-200 border border-transparent hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-800 dark:hover:text-emerald-300 hover:translate-x-1"
              }`}
            >
              <span>{item.label}</span>
              <span className={`text-xs transition-transform duration-200 ${active ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"}`}>
                →
              </span>
            </button>
          )
        })}
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
