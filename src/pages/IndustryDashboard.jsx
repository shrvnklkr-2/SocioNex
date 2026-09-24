import { DashboardFrame } from "../components/DashboardFrame"
import { Button, useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { solverLine } from "../data/logic"

export default function IndustryDashboard() {
  useTitle("Industry")
  const { user, problems, respondAsIndustry, openBoard } = useStore()
  const incoming = problems.filter((item) => item.industryId === user.industryId && item.industryStatus === "pending")
  const history = problems.filter((item) => item.industryId === user.industryId && item.industryStatus === "accepted")
  const opportunities = (openBoard?.length ? openBoard : problems).slice(0, 3)

  return (
    <DashboardFrame
      eyebrow={user.org || "Industry partner"}
      title="Industry"
      subtitle="Mentorship, funding, and prototyping start when you accept a campus invitation."
    >
      <article className="max-w-xl rounded-[28px] bg-navy p-6 text-white sm:p-8">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-white/50">PARTNER SPOTLIGHT</p>
        <h2 className="mt-3 font-display text-4xl leading-tight">What could your team unlock for Jharkhand?</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
          17 open challenges are ready for industry expertise. A single mentor can change a project’s path from promising to deployable.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-2xl font-semibold">{openBoard?.length || 17}</p>
            <p className="text-white/60">open needs</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">42</p>
            <p className="text-white/60">active partners</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">₹2.8Cr</p>
            <p className="text-white/60">unlocked</p>
          </div>
        </div>
      </article>

      <section className="mt-8 max-w-xl">
        <h2 className="font-display text-3xl">Collaboration request</h2>
        {incoming.length === 0 ? (
          <p className="mt-3 rounded-[24px] border border-dashed border-line bg-card px-4 py-6 text-sm text-muted">
            No request is waiting. When a campus invites {user.org || "your team"}, it will land here.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {incoming.map((problem) => (
              <article key={problem.id} className="rounded-[24px] border border-line bg-card p-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Problem</p>
                <h3 className="mt-2 text-lg font-semibold">{problem.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{problem.description}</p>
                <p className="mt-3 text-sm">University: {problem.universityName}</p>
                <p className="text-sm text-muted">{problem.district} · {problem.domain}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => respondAsIndustry(problem.id, "accept")}>Accept</Button>
                  <Button variant="ghost" onClick={() => respondAsIndustry(problem.id, "reject")}>Reject</Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {opportunities.length > 0 ? (
        <section className="mt-8 max-w-xl">
          <h2 className="text-sm font-semibold tracking-[0.14em] text-muted uppercase">Open board</h2>
          <ul className="mt-3 space-y-2">
            {opportunities.map((problem) => (
              <li key={problem.id} className="rounded-2xl border border-line bg-card px-4 py-3 text-sm">
                <span className="font-medium">{problem.title}</span>
                <span className="mt-1 block text-muted">
                  {problem.district} · {problem.domain || problem.category} ·{" "}
                  {problem.universityName
                    || (problem.suggestedUniversityName
                      ? `Suggested: ${problem.suggestedUniversityName}`
                      : "Unassigned")}
                  {problem.suggestedDepartment ? ` · ${problem.suggestedDepartment}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {history.length > 0 ? (
        <section className="mt-8 max-w-xl">
          <h2 className="text-sm font-semibold tracking-[0.14em] text-muted uppercase">Already with you</h2>
          <ul className="mt-3 space-y-2">
            {history.map((problem) => (
              <li key={problem.id} className="rounded-2xl border border-line bg-card px-4 py-3 text-sm">
                <span className="font-medium">{problem.title}</span>
                <span className="mt-1 block text-muted">{solverLine(problem)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </DashboardFrame>
  )
}
