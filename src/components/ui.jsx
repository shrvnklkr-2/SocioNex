import { useEffect } from "react"

const control =
  "w-full rounded-2xl border border-line bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/15"

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Socionex` : "Socionex"
  }, [title])
}

export function Button({ variant = "solid", className = "", type = "button", ...props }) {
  const styles = {
    solid: "bg-navy text-white",
    light: "bg-card text-[#0c1733] hover:bg-slate-100",
    ghost: "border border-line bg-card text-ink hover:bg-mist",
    ink: "border border-line bg-card text-accent hover:bg-mist",
    good: "bg-mint text-white hover:brightness-110",
    quiet: "text-accent hover:bg-card",
  }
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  )
}

function Wrap({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs text-muted">{hint}</span> : null}
      {error ? <span className="mt-1.5 block text-xs text-rose-600">{error}</span> : null}
    </label>
  )
}

export function Input({ label, hint, error, className = "", ...props }) {
  return (
    <Wrap label={label} hint={hint} error={error}>
      <input className={`${control} ${className}`} {...props} />
    </Wrap>
  )
}

export function TextArea({ label, hint, error, className = "", ...props }) {
  return (
    <Wrap label={label} hint={hint} error={error}>
      <textarea className={`${control} min-h-28 resize-y ${className}`} {...props} />
    </Wrap>
  )
}

export function Select({ label, hint, error, children, className = "", ...props }) {
  return (
    <Wrap label={label} hint={hint} error={error}>
      <select className={`${control} ${className}`} {...props}>
        {children}
      </select>
    </Wrap>
  )
}

const STATUS_TONE = {
  submitted: "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200",
  in_validation: "bg-amber-50 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200",
  requested: "bg-violet-50 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200",
  assigned: "bg-indigo-50 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-200",
  in_progress: "bg-sky-50 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200",
  pending_industry: "bg-fuchsia-50 text-fuchsia-800 dark:bg-fuchsia-400/15 dark:text-fuchsia-200",
  collaborating: "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200",
  completed: "bg-emerald-600 text-white",
  rejected: "bg-rose-50 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
}

export function StatusPill({ status, label }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${STATUS_TONE[status] || STATUS_TONE.submitted}`}>
      {label}
    </span>
  )
}

export function Panel({ className = "", children }) {
  return (
    <section className={`rounded-[28px] border border-line bg-card shadow-[0_16px_40px_-28px_rgba(16,24,40,0.6)] dark:shadow-none ${className}`}>
      {children}
    </section>
  )
}
