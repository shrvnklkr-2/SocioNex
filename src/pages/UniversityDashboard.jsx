import { useState } from "react"
import { Link } from "react-router-dom"
import { ListeningCard, MomentumChart } from "../components/Charts"
import { DashboardFrame } from "../components/DashboardFrame"
import { ProblemRow } from "../components/ProblemRow"
import { StatGrid } from "../components/StatGrid"
import { Button, Input, TextArea, useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { helloName, STATUS_LABEL } from "../data/logic"
import { DOMAINS } from "../data/seed"

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "details", label: "Add details" },
  { id: "depts", label: "Add dept / research" },
  { id: "faculty", label: "Add faculty" },
  { id: "all", label: "All problems" },
  { id: "inbox", label: "Accept or reject" },
  { id: "tracking", label: "Tracking" },
  { id: "partners", label: "University collaboration" },
]

function PartnerCard({ partner, onJoin }) {
  return (
    <article className="rounded-[24px] border border-line bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-mist text-sm font-semibold">
            {partner.name.slice(0, 1)}
          </span>
          <div>
            <h3 className="font-semibold">{partner.name}</h3>
            <p className="text-sm text-muted">{partner.blurb}</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-200">{partner.kind}</span>
      </div>
      <p className="mt-3 text-xs text-muted">{partner.place} · {partner.fit}</p>
      <button type="button" onClick={onJoin} className="mt-4 w-full rounded-full border border-line py-2.5 text-sm font-medium hover:bg-mist">
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
    <aside className="lg:w-60 lg:shrink-0">
      <label className="mb-3 block text-sm lg:hidden">
        <span className="mb-1 block text-xs font-semibold tracking-[0.14em] text-muted uppercase">Section</span>
        <select value={view} onChange={(event) => setView(event.target.value)} className="w-full rounded-2xl border border-line bg-card px-3 py-2">
          {NAV.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </label>
      <nav className="hidden rounded-[28px] border border-line bg-card p-3 lg:block">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            className={`block w-full rounded-2xl px-3 py-2.5 text-left text-sm ${view === item.id ? "bg-navy text-white" : "hover:bg-mist"}`}
          >
            {item.label}
          </button>
        ))}
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
        <div className="space-y-4">
          <StatGrid problems={problems} overview={overview} />
          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[28px] border border-line bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-3xl">Challenge momentum</h2>
                  <p className="text-sm text-muted">Submission and resolution velocity · last 6 months</p>
                </div>
                <Link to="/impact" className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">View analytics</Link>
              </div>
              <MomentumChart />
            </article>
            <ListeningCard />
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {partners.slice(0, 3).map((partner) => (
              <PartnerCard key={partner.id} partner={partner} onJoin={() => invite(partner.id)} />
            ))}
          </div>
        </div>
      ) : null}

      {view === "details" && institution ? (
        <form
          className="max-w-2xl space-y-4 rounded-[28px] border border-line bg-card p-5"
          onSubmit={(event) => {
            event.preventDefault()
            store.updateInstitution(institution.id, { about })
          }}
        >
          <h2 className="font-display text-3xl">Campus details</h2>
          <TextArea label="About the institution" value={about} onChange={(event) => setAbout(event.target.value)} />
          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Expertise</legend>
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
                    className={`rounded-full px-3 py-1.5 text-sm ${on ? "bg-navy text-white" : "border border-line bg-card"}`}
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
        <section className="max-w-xl rounded-[28px] border border-line bg-card p-5">
          <h2 className="font-display text-3xl">Departments and research</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {institution.depts.map((item) => (
              <li key={item} className="rounded-2xl bg-mist px-3 py-2">{item}</li>
            ))}
          </ul>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              store.addDepartment(institution.id, dept)
              setDept("")
            }}
          >
            <Input label="Add a department or centre" value={dept} onChange={(event) => setDept(event.target.value)} />
          </form>
          <Button className="mt-3" onClick={() => { store.addDepartment(institution.id, dept); setDept("") }}>Add</Button>
        </section>
      ) : null}

      {view === "faculty" && institution ? (
        <section className="max-w-xl rounded-[28px] border border-line bg-card p-5">
          <h2 className="font-display text-3xl">Faculty mentors</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {institution.faculty.map((item) => {
              const name = typeof item === "string" ? item : item.name
              const meta =
                typeof item === "string"
                  ? null
                  : [item.title, item.department].filter(Boolean).join(" · ")
              return (
                <li key={name} className="rounded-2xl bg-mist px-3 py-2">
                  <p className="font-medium">{name}</p>
                  {meta ? <p className="mt-0.5 text-muted">{meta}</p> : null}
                </li>
              )
            })}
          </ul>
          <div className="mt-4">
            <Input label="Add faculty" value={faculty} onChange={(event) => setFaculty(event.target.value)} />
            <Button className="mt-3" onClick={() => { store.addFaculty(institution.id, faculty); setFaculty("") }}>Add</Button>
          </div>
        </section>
      ) : null}

      {view === "all" ? (
        <div className="space-y-3">
          <h2 className="font-display text-3xl">All problems</h2>
          <p className="text-sm text-muted">Request an open brief. The department confirms it before work starts.</p>
          {suggestedForUs.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Suggested for your campus</p>
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
          {problems.filter((item) => item.universityId && item.universityId !== user.universityId).slice(0, 4).map((problem) => (
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
          {tracking.length === 0 ? <p className="text-sm text-muted">Accepted work will show its milestones here.</p> : null}
          {tracking.map((problem) => (
            <ProblemRow key={problem.id} problem={problem} defaultOpen>
              {problem.status !== "completed" && problem.status !== "rejected" ? (
                <Button onClick={() => store.advance(problem.id)}>
                  {problem.progress >= 1 ? "Mark deployed" : "Mark pilot checkpoint"}
                </Button>
              ) : null}
            </ProblemRow>
          ))}
        </div>
      ) : null}

      {view === "partners" ? (
        <div className="space-y-4">
          <h2 className="font-display text-3xl">University collaboration</h2>
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
