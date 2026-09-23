import { useState } from "react"
import { formatDate, milestonesFor, outcomeLabel, solverLine, STATUS_LABEL } from "../data/logic"
import { StatusPill } from "./ui"

export function ProblemRow({ problem, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const milestones = milestonesFor(problem)

  return (
    <article className="rounded-[24px] border border-line bg-card">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-ink">{problem.title}</h3>
            <StatusPill status={problem.status} label={STATUS_LABEL[problem.status]} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {problem.district}
            {problem.location ? ` · ${problem.location}` : ""} · {problem.domain} · {formatDate(problem.createdAt)}
          </p>
        </div>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${open ? "border-navy bg-navy text-white" : "border-line bg-card text-ink hover:bg-mist"}`}
        >
          {open ? "Hide status" : "Check status"}
        </button>
      </div>
      {open ? (
        <div className="border-t border-line px-4 py-4 sm:px-5">
          <div className="rounded-[22px] bg-mist p-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">Problem</p>
            <p className="mt-2 text-sm leading-6 text-ink">{problem.description}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted">Who is solving</p>
                <p className="mt-1 text-sm font-medium">{solverLine(problem)}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Outcome</p>
                <p className="mt-1 text-sm font-medium">{outcomeLabel(problem)}</p>
              </div>
            </div>
            {problem.note ? <p className="mt-3 text-sm text-muted">{problem.note}</p> : null}
            {problem.duplicateTitle ? (
              <p className="mt-3 text-sm text-amber-800">Possible duplicate of “{problem.duplicateTitle}”.</p>
            ) : null}
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {milestones.map((step) => (
                <li key={step.label} className="flex items-center gap-2 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${step.done ? "bg-mint" : "bg-slate-300"}`} />
                  <span className={step.done ? "text-ink" : "text-muted"}>{step.label}</span>
                </li>
              ))}
            </ol>
          </div>
          {children ? <div className="mt-4">{children}</div> : null}
        </div>
      ) : null}
    </article>
  )
}
