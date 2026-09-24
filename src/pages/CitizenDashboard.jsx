import { Link } from "react-router-dom"
import { DashboardFrame } from "../components/DashboardFrame"
import { ProblemRow } from "../components/ProblemRow"
import { useTitle } from "../components/ui"
import { useStore } from "../context/Store"
import { helloName } from "../data/logic"

export default function CitizenDashboard() {
  const { user, problems, submitFeedback } = useStore()
  const name = helloName(user)
  useTitle(`Hello ${name}`)
  const mine = problems.filter((item) =>
    item.ownerId === user.id
    || item.ownerName === user.name
    || (user.email && item.ownerEmail === user.email),
  )
  const needsFeedback = mine.find((item) => item.status === "completed" && !item.feedback)

  return (
    <DashboardFrame
      eyebrow={user.role === "community" ? user.roleLabel || "Community" : "Citizen"}
      title={`Hello ${name}`}
      subtitle={user.role === "community" ? "Reports filed by your organisation." : "Reports you have placed in the queue."}
    >
      {mine.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-line bg-card px-6 py-16 text-center">
          <p className="font-display text-4xl">No problem reported</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
            When you file a challenge it will sit here with the campus, the partner, and whether it is still pending.
          </p>
          <Link to="/report" className="mt-6 inline-flex rounded-full bg-navy px-5 py-3 text-sm text-white">
            Report a problem
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{mine.length} in your name</p>
            <Link to="/report" className="text-sm font-medium text-accent">Report another</Link>
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
      )}
    </DashboardFrame>
  )
}
