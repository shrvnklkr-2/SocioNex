import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ListeningCard, MomentumChart } from "../components/Charts"
import { DashboardFrame } from "../components/DashboardFrame"
import { ProblemRow } from "../components/ProblemRow"
import { StatGrid } from "../components/StatGrid"
import { Button, useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { STATUS_LABEL } from "../data/logic"

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

  return (
    <DashboardFrame
      eyebrow="Department desk"
      title="Government"
      subtitle="Validate what citizens file, approve a campus, and route a brief to the institution that can carry it."
    >
      <StatGrid problems={problems} overview={overview} />
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[28px] border border-line bg-card p-5">
          <div className="flex items-start justify-between gap-3">
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

      <section className="mt-6">
        <h2 className="font-display text-3xl">Accept university</h2>
        <p className="mt-1 text-sm text-muted">Campuses cannot take a brief until this desk approves them.</p>
        {waiting.length === 0 ? (
          <p className="mt-3 rounded-3xl border border-line bg-card px-4 py-4 text-sm text-muted">No institution is waiting.</p>
        ) : (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {waiting.map((item) => (
              <article key={item.id} className="rounded-[24px] border border-line bg-card p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="mt-1 text-sm text-muted">{item.type} · {item.location} · {item.licence || "Licence not added"}</p>
                <div className="mt-3 flex gap-2">
                  <Button onClick={() => acceptInstitution(item.id)}>Accept</Button>
                  <Button variant="ghost" onClick={() => declineInstitution(item.id)}>Decline</Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl">Problems</h2>
            <p className="text-sm text-muted">{visible.length} showing in this workspace</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or district"
              className="rounded-full border border-line bg-card px-4 py-2 text-sm outline-none"
            />
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-full border border-line bg-card px-3 py-2 text-sm">
              <option value="all">All statuses</option>
              {Object.entries(STATUS_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {visible.map((problem, index) => (
            <ProblemRow key={problem.id} problem={problem} defaultOpen={index === 0}>
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted">
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
                      className="rounded-full border border-line bg-card px-3 py-2 text-sm"
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
    </DashboardFrame>
  )
}
