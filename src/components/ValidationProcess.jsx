import { useEffect, useState } from "react"
import { Check, Clock, TrendingUp } from "lucide-react"
import { Button, TextArea } from "./ui"

function StepIcon({ tone, active }) {
  if (tone === "warn" && active) {
    return (
      <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-100 text-amber-700">
        <Clock className="h-4 w-4" />
      </span>
    )
  }
  if (active) {
    return (
      <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700">
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </span>
    )
  }
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-mist text-muted">
      <TrendingUp className="h-4 w-4" />
    </span>
  )
}

function StepRow({ step, revealed, animating }) {
  const pct = revealed ? step.score : 0
  const bar =
    animating && revealed
      ? "bg-amber-500"
      : step.tone === "warn"
        ? "bg-amber-500"
        : "bg-[color:var(--mint)]"

  return (
    <li
      className={`rounded-2xl border px-4 py-3 transition ${
        revealed ? "border-line bg-card" : "border-transparent bg-mist/60 opacity-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <StepIcon tone={step.tone} active={revealed} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">{step.title}</p>
              <p className="mt-0.5 text-sm text-muted">{revealed ? step.detail : "Running…"}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">
              {revealed ? `${pct}%` : "—"}
            </p>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-mist">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </li>
  )
}

export function ValidationProcess({ report, problem, user, onDone, onFileAnother }) {
  const [visible, setVisible] = useState(0)
  const [done, setDone] = useState(false)
  const total = report.steps.length

  useEffect(() => {
    if (visible >= total) {
      const timer = setTimeout(() => setDone(true), 400)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(() => setVisible((n) => n + 1), 520)
    return () => clearTimeout(timer)
  }, [visible, total])

  const place = [problem.location, problem.district].filter(Boolean).join(", ")

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
            {report.challengeId}
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">{problem.title}</h1>
          <p className="mt-2 text-sm text-muted">
            Submitted by {user?.name || problem.ownerName}
            {place ? ` · ${place}` : ""}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          {done ? "AI reviewed" : "Reviewing"}
        </span>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_0.95fr]">
        <section className="rounded-[28px] border border-line bg-card p-5 sm:p-6">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
            Validation process
          </p>
          <ul className="mt-4 space-y-3">
            {report.steps.map((step, index) => (
              <StepRow
                key={step.id}
                step={step}
                revealed={index < visible}
                animating={index === visible - 1 && !done}
              />
            ))}
          </ul>
        </section>

        <div className="space-y-5">
          <section className="rounded-[28px] bg-navy p-5 text-white sm:p-6">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">
              Composite priority
            </p>
            <p className="mt-3 font-display text-5xl tabular-nums">
              {done ? report.composite.score : "··"}
              <span className="text-2xl text-white/50"> / 100</span>
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400 transition-all duration-700"
                style={{ width: done ? `${report.composite.score}%` : "12%" }}
              />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-white/50">Urgency</p>
                <p className="mt-1 font-medium">{report.composite.urgency}</p>
              </div>
              <div>
                <p className="text-white/50">Reach</p>
                <p className="mt-1 font-medium">{report.composite.reach}</p>
              </div>
              <div>
                <p className="text-white/50">Confidence</p>
                <p className="mt-1 font-medium">{report.composite.confidence}%</p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-line bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
                Shortlisted matches
              </p>
              {report.needsHumanReview ? (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                  Review pending
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">{report.reviewNote}</p>
            {done && report.matches.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {report.matches.map((match) => (
                  <li
                    key={match.universityId}
                    className="rounded-2xl bg-mist px-3 py-2.5 text-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-ink">{match.universityName}</p>
                      <span className="tabular-nums text-muted">{match.score}%</span>
                    </div>
                    <p className="mt-1 text-muted">
                      {match.department}
                      {match.facultyName ? ` · ${match.facultyName}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">
                {done ? "Waiting on campus shortlist…" : "Matching campus, department, and faculty…"}
              </p>
            )}
            {done ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
                <p className="font-medium">Reviewer note requested</p>
                <p className="mt-1 leading-6">{report.reviewerPrompt}</p>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      {done ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={onDone}>Open your desk</Button>
          <Button variant="ghost" onClick={onFileAnother}>
            File another
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export function SolutionFeedback({ problem, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [sent, setSent] = useState(Boolean(problem.feedback))

  if (sent && problem.feedback) {
    return (
      <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        Thanks — you rated this solution {problem.feedback.rating}/5
        {problem.feedback.comment ? `: “${problem.feedback.comment}”` : "."}
      </div>
    )
  }

  if (sent) {
    return (
      <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        Feedback saved. Thank you.
      </div>
    )
  }

  return (
    <div className="rounded-[22px] border border-line bg-card p-4">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
        Solution feedback
      </p>
      <p className="mt-2 text-sm text-ink">
        This challenge is marked completed. How did the solution work for you?
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className={`h-9 w-9 rounded-full text-sm font-semibold transition ${
              rating >= value
                ? "bg-navy text-white"
                : "border border-line bg-mist text-muted hover:bg-card"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="mt-3">
        <TextArea
          label="What should stay or change"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={400}
          placeholder="Optional — what helped, what is still missing."
        />
      </div>
      <Button
        className="mt-3"
        disabled={rating < 1}
        onClick={() => {
          onSubmit({ rating, comment: comment.trim() })
          setSent(true)
        }}
      >
        Send feedback
      </Button>
    </div>
  )
}
