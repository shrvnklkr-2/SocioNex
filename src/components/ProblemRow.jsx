import { useEffect, useMemo, useState } from "react"
import { api } from "../api"
import { useStore } from "../context/Store"
import {
  formatDate,
  matchRecommendations,
  milestonesFor,
  outcomeLabel,
  solverLine,
  STATUS_LABEL,
} from "../data/logic"
import { StatusPill } from "./ui"
import { SolutionFeedback } from "./ValidationProcess"

function MatchCard({ problem }) {
  const campus = problem.universityName || problem.suggestedUniversityName
  if (!campus && !problem.suggestedDepartment && !problem.suggestedFaculty) return null

  const assigned = Boolean(problem.universityName)
  const label =
    problem.status === "assigned"
      ? "Awaiting university"
      : assigned
        ? "Assigned campus"
        : "Suggested match"

  return (
    <div className="mt-3 rounded-2xl bg-card px-3 py-2.5 text-sm">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-medium">
        {campus || "Campus pending"}
        {problem.suggestedDepartment ? ` · ${problem.suggestedDepartment}` : ""}
      </p>
      {problem.suggestedFaculty ? (
        <p className="mt-0.5 text-muted">
          {problem.suggestedFaculty}
          {problem.suggestedFacultyTitle ? ` · ${problem.suggestedFacultyTitle}` : ""}
        </p>
      ) : null}
    </div>
  )
}

export function ProblemRow({ problem, defaultOpen = false, children, onFeedback }) {
  const { institutions } = useStore()
  const [open, setOpen] = useState(defaultOpen)
  const [detail, setDetail] = useState(problem)
  const [milestones, setMilestones] = useState(milestonesFor(problem))
  const [matches, setMatches] = useState([])

  const localMatches = useMemo(() => {
    if (!detail.domain || !institutions?.length) return []
    return matchRecommendations(detail.domain, institutions, 4)
  }, [detail.domain, institutions])

  useEffect(() => {
    setDetail(problem)
    setMilestones(milestonesFor(problem))
  }, [problem])

  useEffect(() => {
    if (!open) return undefined
    const id = problem.id
    if (!/^\d+$/.test(String(id))) {
      setMatches(localMatches)
      return undefined
    }
    let cancelled = false
    Promise.all([
      api.challenge(id).catch(() => null),
      api.milestones(id).catch(() => []),
      api.universityMatches(id).catch(() => []),
    ]).then(([next, steps, ranked]) => {
      if (cancelled) return
      if (next) {
        const early = ["submitted", "in_validation", "rejected"].includes(problem.status)
        setDetail({
          ...problem,
          description: next.description || problem.description,
          universityName: early
            ? problem.universityName
            : next.assigned_university || problem.universityName,
          progress: next.progress_percentage ?? problem.progress,
          note: problem.note || (next.confidence ? `Mock classifier confidence ${next.confidence}` : ""),
          suggestedUniversityName:
            problem.suggestedUniversityName || next.assigned_university || null,
          suggestedDepartment: problem.suggestedDepartment,
          suggestedFaculty: problem.suggestedFaculty,
          suggestedFacultyTitle: problem.suggestedFacultyTitle,
        })
      }
      if (Array.isArray(steps) && steps.length) {
        setMilestones(steps.map((step) => ({
          label: step.title,
          done: String(step.status).toLowerCase() === "completed",
        })))
      }
      setMatches(Array.isArray(ranked) && ranked.length ? ranked : localMatches)
    })
    return () => {
      cancelled = true
    }
  }, [open, problem, localMatches])

  return (
    <article className="rounded-[24px] border border-line bg-card">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-ink">{detail.title}</h3>
            <StatusPill status={detail.status} label={STATUS_LABEL[detail.status] || detail.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {detail.district}
            {detail.location ? ` · ${detail.location}` : ""} · {detail.domain} · {formatDate(detail.createdAt)}
          </p>
          <p className="mt-1 text-sm text-ink/80">{solverLine(detail)}</p>
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
            <p className="mt-2 text-sm leading-6 text-ink">{detail.description}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted">Who is solving</p>
                <p className="mt-1 text-sm font-medium">{solverLine(detail)}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Outcome</p>
                <p className="mt-1 text-sm font-medium">{outcomeLabel(detail)}</p>
              </div>
            </div>
            {detail.note ? <p className="mt-3 text-sm text-muted">{detail.note}</p> : null}
            <MatchCard problem={detail} />
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {milestones.map((step) => (
                <li key={step.label} className="flex items-center gap-2 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${step.done ? "bg-mint" : "bg-slate-300"}`} />
                  <span className={step.done ? "text-ink" : "text-muted"}>{step.label}</span>
                </li>
              ))}
            </ol>
            {(matches.length > 0 || localMatches.length > 0) &&
            ["submitted", "in_validation", "assigned", "requested"].includes(detail.status) ? (
              <div className="mt-4">
                <p className="text-xs text-muted">Campus · department · faculty shortlist</p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {(matches.length ? matches : localMatches).slice(0, 4).map((item) => {
                    const name = item.name || item.universityName
                    const dept = item.department
                    const faculty = item.facultyName
                    const score = item.score
                    const reason = item.reason
                    return (
                      <li key={name} className="rounded-xl bg-card px-3 py-2">
                        <span className="font-medium">{name}</span>
                        {score != null ? <span className="text-muted"> · {score}%</span> : null}
                        {dept || faculty ? (
                          <span className="mt-0.5 block text-muted">
                            {[dept, faculty].filter(Boolean).join(" · ")}
                          </span>
                        ) : reason ? (
                          <span className="text-muted"> · {reason}</span>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}
            {detail.status === "completed" ? (
              <div className="mt-4">
                {onFeedback && !detail.feedback ? (
                  <SolutionFeedback
                    problem={detail}
                    onSubmit={(payload) => onFeedback(detail.id, payload)}
                  />
                ) : detail.feedback ? (
                  <SolutionFeedback problem={detail} onSubmit={() => {}} />
                ) : null}
              </div>
            ) : null}
          </div>
          {children ? <div className="mt-4">{children}</div> : null}
        </div>
      ) : null}
    </article>
  )
}
