import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ListeningCard, MomentumChart } from "../components/Charts"
import { DashboardFrame } from "../components/DashboardFrame"
import { ProblemRow } from "../components/ProblemRow"
import { StatGrid } from "../components/StatGrid"
import { Button, Input, TextArea, useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { helloName, STATUS_LABEL, momentumFromProblems, networkFromProblems } from "../data/logic"
import { DOMAINS } from "../data/seed"

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "details", label: "Add details" },
  { id: "depts", label: "Add dept / research" },
  { id: "faculty", label: "Add faculty" },
  { id: "all", label: "All problems" },
  { id: "inbox", label: "Accept or reject" },
  { id: "tracking", label: "Tracking" },
  { id: "partners", label: "Industry collaboration" },
]

function PartnerCard({ partner, onJoin }) {
  return (
    <article className="rounded-[24px] border-2 border-emerald-500 bg-white dark:bg-slate-900 p-5 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 text-sm font-bold shadow-sm border border-emerald-300">
              {partner.name.slice(0, 1)}
            </span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{partner.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{partner.blurb}</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-500/20 border border-emerald-400 px-2.5 py-1 text-xs font-bold text-emerald-900 dark:text-emerald-200">{partner.kind}</span>
        </div>
        <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">{partner.place} · {partner.fit}</p>
      </div>
      <button type="button" onClick={onJoin} className="mt-4 w-full rounded-full border-2 border-emerald-500 bg-white dark:bg-slate-800 py-2.5 text-sm font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-600 hover:text-white transition-all duration-200 shadow-sm">
        Join this team →
      </button>
    </article>
  )
}

export default function UniversityDashboard() {
  const store = useStore()
  const { user, problems, institutions, partners, overview, openBoard } = store
  const institution = institutions.find((item) => item.id === user.universityId)
    || institutions.find((item) => item.name === user.org)
    || {
    id: user.org || "campus",
    name: user.org || user.name,
    type: "Campus",
    location: "",
    about: "",
    expertise: [],
    depts: [],
    faculty: [],
    accepted: true,
    declined: false,
  }
  const [view, setView] = useState("overview")
  const [about, setAbout] = useState(institution?.about || "")
  const [dept, setDept] = useState("")
  const [faculty, setFaculty] = useState("")
  const [reason, setReason] = useState({})
  const name = helloName(user)
  useTitle(`Hello ${name}`)

  const mine = problems.filter((item) =>
    item.universityName === institution.name
    || item.universityId === user.universityId
    || item.universityId === institution.id
    || item.universityId === institution.name,
  )
  const inbox = mine.filter((item) => item.status === "assigned")
  const tracking = mine.filter((item) => !["assigned", "requested"].includes(item.status))
  const momentum = useMemo(() => momentumFromProblems(problems), [problems])
  const network = useMemo(() => networkFromProblems(problems, overview), [problems, overview])
  const suggestedForUs = problems.filter(
    (item) =>
      ["submitted", "in_validation"].includes(item.status)
      && (item.suggestedUniversityId === institution.id || item.suggestedUniversityName === institution.name),
  )
  const openPool = openBoard?.length
    ? openBoard
    : problems.filter((item) => ["submitted", "in_validation"].includes(item.status))
  const active = mine.find((item) => ["in_progress", "collaborating"].includes(item.status))

  const invite = (partnerId) => {
    if (!active) {
      store.flash("Accept a challenge before inviting a partner")
      setView("inbox")
      return
    }
    store.inviteIndustry(active.id, partnerId)
  }

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
          Menu Navigation
        </div>
        {NAV.map((item) => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-bold transition-all duration-200 ${active
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
      eyebrow={institution?.name || "University"}
      title={`Hello ${name}`}
      subtitle={institution ? `${institution.type} · ${institution.location}` : "Campus profile missing"}
      sidebar={sidebar}
    >
      {!institution ? (
        <p className="text-sm text-muted">This account is not linked to a campus profile.</p>
      ) : null}

      {institution && !institution.accepted ? (
        <p className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Pending government approval. You can complete the profile. Taking a brief unlocks after the department accepts the campus.
        </p>
      ) : null}

      {view === "overview" && institution ? (
        <div className="space-y-4 w-full">
          <StatGrid problems={problems} overview={overview} />
          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr] w-full">
            <article className="rounded-[28px] border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-5 shadow-[0_0_20px_-3px_rgba(16,185,129,0.18)] hover:shadow-[0_0_25px_0px_rgba(16,185,129,0.25)] hover:border-emerald-400 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-3xl font-normal text-slate-900 dark:text-white">Challenge momentum</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Submission and resolution velocity · last 6 months</p>
                </div>
                <Link to="/impact" className="rounded-full border border-emerald-300 dark:border-emerald-700 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50">View analytics</Link>
              </div>
              <MomentumChart
                months={momentum.map((item) => item.label)}
                submitted={momentum.map((item) => item.submitted)}
                resolved={momentum.map((item) => item.resolved)}
              />
            </article>
            <ListeningCard contributors={network.contributors} districts={network.districts} />
          </div>

        </div>
      ) : null}

      {view === "details" && institution ? (
        <form
          className="w-full space-y-4 rounded-[28px] border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-6 shadow-[0_0_20px_-3px_rgba(16,185,129,0.18)]"
          onSubmit={(event) => {
            event.preventDefault()
            store.updateInstitution(institution.id, { about })
          }}
        >
          <h2 className="font-display text-3xl font-normal text-slate-900 dark:text-white">Campus details</h2>
          <TextArea label="About the institution" value={about} onChange={(event) => setAbout(event.target.value)} />
          <fieldset>
            <legend className="mb-2 text-[11px] font-bold tracking-[0.14em] text-emerald-700 dark:text-emerald-400 uppercase">Expertise</legend>
            <div className="flex flex-wrap gap-2">
              {DOMAINS.map((domain) => {
                const on = institution.expertise.includes(domain)
                return (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => {
                      const expertise = on
                        ? institution.expertise.filter((item) => item !== domain)
                        : [...institution.expertise, domain]
                      store.updateInstitution(institution.id, { expertise }, { quiet: true })
                    }}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${on ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50"}`}
                  >
                    {domain}
                  </button>
                )
              })}
            </div>
          </fieldset>
          <Button type="submit">Save details</Button>
        </form>
      ) : null}

      {view === "depts" && institution ? (
        <section className="w-full rounded-[28px] border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-6 shadow-[0_0_20px_-3px_rgba(16,185,129,0.18)]">
          <h2 className="font-display text-3xl font-normal text-slate-900 dark:text-white">Departments and research</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm">
            {institution.depts.map((item) => (
              <li key={item} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 dark:bg-emerald-950/30 dark:border-emerald-900 px-4 py-3 font-medium text-emerald-950 dark:text-emerald-200">{item}</li>
            ))}
          </ul>
          <form
            className="mt-6 flex flex-col sm:flex-row gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              store.addDepartment(institution.id, dept)
              setDept("")
            }}
          >
            <div className="flex-1">
              <Input label="Add a department or centre" value={dept} onChange={(event) => setDept(event.target.value)} />
            </div>
          </form>
          <Button className="mt-3" onClick={() => { store.addDepartment(institution.id, dept); setDept("") }}>Add Department</Button>
        </section>
      ) : null}

      {view === "faculty" && institution ? (
        <section className="w-full rounded-[28px] border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-slate-900 p-6 shadow-[0_0_20px_-3px_rgba(16,185,129,0.18)]">
          <h2 className="font-display text-3xl font-normal text-slate-900 dark:text-white">Faculty mentors</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            {institution.faculty.map((item) => {
              const name = typeof item === "string" ? item : item.name
              const meta =
                typeof item === "string"
                  ? null
                  : [item.title, item.department].filter(Boolean).join(" · ")
              return (
                <li key={name} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 dark:bg-emerald-950/30 dark:border-emerald-900 px-4 py-3">
                  <p className="font-semibold text-emerald-950 dark:text-emerald-200">{name}</p>
                  {meta ? <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{meta}</p> : null}
                </li>
              )
            })}
          </ul>
          <div className="mt-6">
            <Input label="Add faculty mentor" value={faculty} onChange={(event) => setFaculty(event.target.value)} />
            <Button className="mt-3" onClick={() => { store.addFaculty(institution.id, faculty); setFaculty("") }}>Add Faculty</Button>
          </div>
        </section>
      ) : null}

      {view === "all" ? (
        <div className="space-y-3">
          <h2 className="font-display text-3xl">All problems</h2>
          <p className="text-sm text-muted">Request an open brief. The department confirms it before work starts.</p>
          {suggestedForUs.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Matched challenges to other campus</p>
              {suggestedForUs.map((problem) => (
                <ProblemRow key={`sug-${problem.id}`} problem={problem}>
                  <p className="mb-2 text-sm text-muted">
                    {[problem.suggestedDepartment, problem.suggestedFaculty].filter(Boolean).join(" · ")}
                  </p>
                  <Button onClick={() => store.requestProblem(problem.id)}>Request this problem</Button>
                </ProblemRow>
              ))}
            </div>
          ) : null}
          {openPool.length === 0 ? <p className="text-sm text-muted">Nothing is waiting without a campus.</p> : null}
          {openPool.map((problem) => (
            <ProblemRow key={problem.id} problem={problem}>
              <Button onClick={() => store.requestProblem(problem.id)}>Request this problem</Button>
            </ProblemRow>
          ))}
          {problems.filter((item) => item.universityId && item.universityId !== user.universityId).map((problem) => (
            <article key={problem.id} className="rounded-[24px] border border-line bg-card px-4 py-4 text-sm">
              <p className="font-medium">{problem.title}</p>
              <p className="mt-1 text-muted">{problem.district} · {STATUS_LABEL[problem.status]} · {problem.universityName}</p>
            </article>
          ))}
        </div>
      ) : null}

      {view === "inbox" ? (
        <div className="space-y-3">
          <h2 className="font-display text-3xl">Accept or reject</h2>
          {inbox.length === 0 ? <p className="text-sm text-muted">No brief is waiting for your decision.</p> : null}
          {inbox.map((problem) => (
            <ProblemRow key={problem.id} problem={problem} defaultOpen>
              <p className="mb-3 text-sm text-muted">
                Matched to {[problem.suggestedDepartment, problem.suggestedFaculty].filter(Boolean).join(" · ") || "your campus"}
              </p>
              <TextArea
                label="Note"
                value={reason[problem.id] || ""}
                onChange={(event) => setReason((current) => ({ ...current, [problem.id]: event.target.value }))}
              />
              <div className="mt-3 flex gap-2">
                <Button onClick={() => store.respondAsUniversity(problem.id, "accept", reason[problem.id])}>Accept problem</Button>
                <Button variant="ghost" onClick={() => store.respondAsUniversity(problem.id, "reject", reason[problem.id])}>Reject</Button>
              </div>
            </ProblemRow>
          ))}
          {mine.filter((item) => item.status === "requested").map((problem) => (
            <article key={problem.id} className="rounded-[24px] border border-line bg-card p-4 text-sm">
              <p className="font-medium">{problem.title}</p>
              <p className="mt-1 text-muted">Waiting for the department to confirm your request.</p>
            </article>
          ))}
        </div>
      ) : null}

      {view === "tracking" ? (
        <div className="space-y-3">
          <h2 className="font-display text-3xl">Tracking</h2>
          <p className="text-sm text-muted">Update the current stage of your accepted challenges.</p>
          {tracking.length === 0 ? <p className="text-sm text-muted">Accepted work will show its milestones here.</p> : null}
          {tracking.map((problem) => (
            <ProblemRow key={problem.id} problem={problem} defaultOpen>
              {problem.status !== "completed" && problem.status !== "rejected" ? (
                <div className="space-y-3">
                  {/* Stage update dropdown */}
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-4">
                    <label className="block text-[11px] font-bold tracking-[0.14em] text-emerald-700 dark:text-emerald-400 uppercase mb-2">
                      Update Current Stage
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        value={problem.status}
                        onChange={(event) => {
                          const next = event.target.value
                          if (next === "completed") {
                            // Advance until completed
                            let steps = 2 - (problem.progress || 0)
                            for (let i = 0; i < steps; i++) store.advance(problem.id)
                          } else if (next === "collaborating" && problem.status === "in_progress") {
                            store.advance(problem.id)
                          }
                        }}
                        className="flex-1 rounded-xl border-2 border-emerald-400 dark:border-emerald-600 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500 shadow-sm"
                      >
                        <option value="in_progress">🔄 In Progress</option>
                        <option value="collaborating">🤝 Collaborating (Pilot)</option>
                        <option value="completed">✅ Completed (Deployed)</option>
                      </select>
                      <Button onClick={() => store.advance(problem.id)}>
                        {problem.progress >= 1 ? "Mark deployed →" : "Advance to next stage →"}
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2.5 w-2.5 rounded-full ${["in_progress", "collaborating", "completed"].includes(problem.status) ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">In Progress</span>
                      </div>
                      <div className="h-px flex-1 bg-emerald-200 dark:bg-emerald-800" />
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2.5 w-2.5 rounded-full ${["collaborating", "completed"].includes(problem.status) ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Pilot</span>
                      </div>
                      <div className="h-px flex-1 bg-emerald-200 dark:bg-emerald-800" />
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2.5 w-2.5 rounded-full ${problem.status === "completed" ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Deployed</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-3 flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">✅</span>
                  <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    {problem.status === "completed" ? "This challenge has been deployed" : "This challenge was returned"}
                  </span>
                </div>
              )}
            </ProblemRow>
          ))}
        </div>
      ) : null}

      {view === "partners" ? (
        <div className="space-y-4">
          <h2 className="font-display text-3xl">Industry collaboration</h2>
          <p className="text-sm text-muted">
            {active
              ? `An invite attaches to “${active.title}”.`
              : "Accept a challenge first. The invite needs a live campus brief."}
          </p>
          <div className="grid gap-3 lg:grid-cols-3">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} onJoin={() => invite(partner.id)} />
            ))}
          </div>
        </div>
      ) : null}
    </DashboardFrame>
  )
}
