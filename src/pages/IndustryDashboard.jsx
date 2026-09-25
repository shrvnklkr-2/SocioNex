import { useState } from "react"
import { DashboardFrame } from "../components/DashboardFrame"
import { Button, useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { solverLine } from "../data/logic"

const NAV = [
  { id: "overview", label: "Spotlight & Overview" },
  { id: "requests", label: "Collaboration Requests" },
  { id: "open", label: "Open Board" },
  { id: "active", label: "Active Partnerships" },
]

export default function IndustryDashboard() {
  useTitle("Industry")
  const { user, problems, respondAsIndustry, openBoard } = useStore()
  const [view, setView] = useState("overview")
  const incoming = problems.filter((item) => item.industryId === user.industryId && item.industryStatus === "pending")
  const history = problems.filter((item) => item.industryId === user.industryId && item.industryStatus === "accepted")
  const opportunities = (openBoard?.length ? openBoard : problems).slice(0, 4)

  const sidebar = (
    <aside className="flex flex-col h-full w-full">
      <label className="mb-3 block text-sm lg:hidden">
        <span className="mb-1 block text-xs font-bold tracking-[0.14em] text-emerald-700 uppercase dark:text-emerald-400">Section</span>
        <select value={view} onChange={(event) => setView(event.target.value)} className="w-full rounded-2xl border-2 border-emerald-500 bg-white dark:bg-slate-900 dark:border-emerald-600 px-3.5 py-2.5 font-bold text-slate-900 dark:text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] outline-none focus:border-emerald-500">
          {NAV.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </label>
      <nav className="hidden lg:flex lg:flex-col flex-1 space-y-1.5">
        <div className="px-3 py-1.5 text-xs font-bold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase border-b border-emerald-200 dark:border-emerald-800/80 mb-2 pb-2">
          Industry Desk
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
      eyebrow={user.org || "Industry partner"}
      title="Industry"
      subtitle="Mentorship, funding, and prototyping start when you accept a campus invitation."
      sidebar={sidebar}
    >
      {view === "overview" && (
        <div className="w-full space-y-6">
          <article className="w-full rounded-[28px] bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-6 sm:p-8 text-white shadow-[0_0_25px_-2px_rgba(16,185,129,0.3)] border border-emerald-500/30">
            <p className="text-[11px] font-bold tracking-[0.18em] text-emerald-300 uppercase">PARTNER SPOTLIGHT</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight font-normal">What could your team unlock for Jharkhand?</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100/80">
              17 open challenges are ready for industry expertise. A single mentor can change a project’s path from promising to deployable.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-4 border-t border-emerald-700/50">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-3xl font-bold text-emerald-200">{openBoard?.length || 17}</p>
                <p className="text-emerald-100/70 text-xs font-medium mt-1">open needs</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-3xl font-bold text-emerald-200">42</p>
                <p className="text-emerald-100/70 text-xs font-medium mt-1">active partners</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-3xl font-bold text-emerald-200">₹2.8Cr</p>
                <p className="text-emerald-100/70 text-xs font-medium mt-1">unlocked</p>
              </div>
            </div>
          </article>
        </div>
      )}

      {(view === "requests" || view === "overview") && (
        <section className={`${view === "overview" ? "mt-6" : ""} w-full space-y-4`}>
          <h2 className="font-display text-3xl font-normal text-slate-900 dark:text-white">Collaboration requests</h2>
          {incoming.length === 0 ? (
            <p className="rounded-[24px] border border-dashed border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 p-6 text-sm text-slate-500 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]">
              No request is waiting. When a campus invites {user.org || "your team"}, it will land here.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 w-full">
              {incoming.map((problem) => (
                <article key={problem.id} className="rounded-[24px] border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-5 shadow-[0_0_20px_-3px_rgba(16,185,129,0.18)] hover:shadow-[0_0_25px_0px_rgba(16,185,129,0.25)] transition-all duration-300">
                  <p className="text-xs font-bold tracking-[0.14em] text-emerald-700 dark:text-emerald-400 uppercase">Problem</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{problem.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{problem.description}</p>
                  <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-200">University: {problem.universityName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{problem.district} · {problem.domain}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button onClick={() => respondAsIndustry(problem.id, "accept")}>Accept</Button>
                    <Button variant="ghost" onClick={() => respondAsIndustry(problem.id, "reject")}>Reject</Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {(view === "open" || view === "overview") && opportunities.length > 0 && (
        <section className={`${view === "overview" ? "mt-6" : ""} w-full space-y-4`}>
          <h2 className="text-xs font-bold tracking-[0.14em] text-emerald-700 dark:text-emerald-400 uppercase">Open board opportunities</h2>
          <div className="grid gap-3 sm:grid-cols-2 w-full">
            {opportunities.map((problem) => (
              <div key={problem.id} className="rounded-2xl border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-4 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_0px_rgba(16,185,129,0.22)] transition-all">
                <span className="font-semibold text-slate-900 dark:text-white text-base block">{problem.title}</span>
                <span className="mt-2 block text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {problem.district} · {problem.domain || problem.category} ·{" "}
                  {problem.universityName
                    || (problem.suggestedUniversityName
                      ? `Suggested: ${problem.suggestedUniversityName}`
                      : "Unassigned")}
                  {problem.suggestedDepartment ? ` · ${problem.suggestedDepartment}` : ""}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {(view === "active" || view === "overview") && history.length > 0 && (
        <section className={`${view === "overview" ? "mt-6" : ""} w-full space-y-4`}>
          <h2 className="text-xs font-bold tracking-[0.14em] text-emerald-700 dark:text-emerald-400 uppercase">Already with your team</h2>
          <div className="grid gap-3 sm:grid-cols-2 w-full">
            {history.map((problem) => (
              <div key={problem.id} className="rounded-2xl border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-4 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]">
                <span className="font-semibold text-slate-900 dark:text-white block">{problem.title}</span>
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{solverLine(problem)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </DashboardFrame>
  )
}
