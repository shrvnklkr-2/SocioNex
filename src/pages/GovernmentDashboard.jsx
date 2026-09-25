import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ListeningCard, MomentumChart } from "../components/Charts"
import { DashboardFrame } from "../components/DashboardFrame"
import { ProblemRow } from "../components/ProblemRow"
import { StatGrid } from "../components/StatGrid"
import { Button, useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { STATUS_LABEL } from "../data/logic"

const NAV = [
  { id: "overview", label: "Overview & Analytics" },
  { id: "universities", label: "Accept University" },
  { id: "problems", label: "Problems & Routing" },
]

export default function GovernmentDashboard() {
  useTitle("Government")
  const {
    problems,
    institutions,
    overview,
    routeToUniversity,
    acceptUniversityRequest,
    returnProblem,
    rejectProblem,
    acceptInstitution,
    declineInstitution,
  } = useStore()
  const [view, setView] = useState("overview")
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [choice, setChoice] = useState({})

  const waiting = institutions.filter((item) => !item.accepted && !item.declined)
  const approved = institutions.filter((item) => item.accepted)

  const visible = useMemo(() => {
    return problems.filter((problem) => {
      const hay = `${problem.title} ${problem.district} ${problem.domain}`.toLowerCase()
      const matchesQuery = hay.includes(query.trim().toLowerCase())
      const matchesStatus = filter === "all" || problem.status === filter
      return matchesQuery && matchesStatus
    })
  }, [problems, query, filter])

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
          Desk Actions
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
      eyebrow="Department desk"
      title="Government"
      subtitle="Validate what citizens file, approve a campus, and route a brief to the institution that can carry it."
      sidebar={sidebar}
    >
      {view === "overview" && (
        <div className="space-y-6 w-full">
          <StatGrid problems={problems} overview={overview} />
          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr] w-full">
            <article className="rounded-[28px] border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-5 shadow-[0_0_20px_-3px_rgba(16,185,129,0.18)] hover:shadow-[0_0_25px_0px_rgba(16,185,129,0.25)] hover:border-emerald-400 transition-all duration-300">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-3xl font-normal text-slate-900 dark:text-white">Challenge momentum</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Submission and resolution velocity · last 6 months</p>
                </div>
                <Link to="/impact" className="rounded-full border border-emerald-300 dark:border-emerald-700 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50">View analytics</Link>
              </div>
              <MomentumChart />
            </article>
            <ListeningCard />
          </div>
        </div>
      )}

      {view === "universities" && (
        <section className="w-full space-y-4">
          <div>
            <h2 className="font-display text-3xl font-normal text-slate-900 dark:text-white">Accept university</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Campuses cannot take a brief until this desk approves them.</p>
          </div>
          {waiting.length === 0 ? (
            <p className="rounded-3xl border border-emerald-200/90 bg-white dark:bg-slate-900 dark:border-slate-800 px-5 py-6 text-sm text-slate-500 shadow-[0_0_20px_-3px_rgba(16,185,129,0.15)]">No institution is waiting for approval.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 w-full">
              {waiting.map((item) => (
                <article key={item.id} className="rounded-[24px] border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-5 shadow-[0_0_20px_-3px_rgba(16,185,129,0.18)] hover:shadow-[0_0_25px_0px_rgba(16,185,129,0.25)] transition-all duration-300">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.type} · {item.location} · {item.licence || "Licence not added"}</p>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => acceptInstitution(item.id)}>Accept</Button>
                    <Button variant="ghost" onClick={() => declineInstitution(item.id)}>Decline</Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {view === "problems" && (
        <section className="w-full space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-normal text-slate-900 dark:text-white">Problems & Routing</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{visible.length} showing in this workspace</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title or district"
                className="rounded-full border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm outline-none shadow-sm focus:border-emerald-500"
              />
              <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-full border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none shadow-sm focus:border-emerald-500">
                <option value="all">All statuses</option>
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-3 w-full">
            {visible.map((problem, index) => (
              <ProblemRow key={problem.id} problem={problem} defaultOpen={index === 0}>
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Filed by {problem.ownerName}
                    {problem.universityName
                      ? ` · Routed: ${problem.universityName}`
                      : problem.suggestedUniversityName
                        ? ` · Suggested: ${problem.suggestedUniversityName}`
                        : ""}
                    {problem.suggestedDepartment ? ` · ${problem.suggestedDepartment}` : ""}
                    {problem.suggestedFaculty ? ` · ${problem.suggestedFaculty}` : ""}
                  </p>
                  {problem.status === "requested" ? (
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => acceptUniversityRequest(problem.id)}>Accept campus request</Button>
                      <Button variant="ghost" onClick={() => returnProblem(problem.id, "Department asked for another match.")}>Send back</Button>
                    </div>
                  ) : null}
                  {["submitted", "in_validation", "assigned"].includes(problem.status) ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <select
                        className="rounded-full border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                        value={choice[problem.id] || problem.suggestedUniversityId || approved[0]?.id || ""}
                        onChange={(event) => setChoice((current) => ({ ...current, [problem.id]: event.target.value }))}
                      >
                        {approved.map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </select>
                      <Button
                        onClick={() =>
                          routeToUniversity(
                            problem.id,
                            choice[problem.id] || problem.suggestedUniversityId || approved[0]?.id,
                          )
                        }
                      >
                        Route to university
                      </Button>
                      {problem.status !== "assigned" ? (
                        <Button variant="ghost" onClick={() => rejectProblem(problem.id, "Outside the scope of this queue.")}>
                          Return to citizen
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </ProblemRow>
            ))}
          </div>
        </section>
      )}
    </DashboardFrame>
  )
}
