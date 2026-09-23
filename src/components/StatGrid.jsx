import { FolderKanban, Lightbulb, ShieldCheck, Users } from "lucide-react"
import { compactNumber, liveStats } from "../data/logic"

export function StatGrid({ problems }) {
  const stats = liveStats(problems)
  const cards = [
    { label: "Challenges submitted", value: stats.submitted, delta: "+12.4%", icon: Lightbulb, tone: "bg-amber-500/15 text-amber-800 dark:text-amber-200" },
    { label: "In validation", value: stats.validation, delta: "+6.1%", icon: ShieldCheck, tone: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200" },
    { label: "Projects active", value: stats.active, delta: "+8.0%", icon: FolderKanban, tone: "bg-orange-500/15 text-orange-800 dark:text-orange-200" },
    { label: "Citizens impacted", value: compactNumber(stats.impacted), delta: "+21.7%", icon: Users, tone: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-200" },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <article key={card.label} className="rounded-[22px] border border-line bg-card p-4 shadow-[0_12px_30px_-24px_rgba(16,24,40,0.8)] dark:shadow-none">
            <div className="flex items-center justify-between">
              <span className={`grid h-9 w-9 place-items-center rounded-full ${card.tone}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-200">{card.delta}</span>
            </div>
            <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{card.label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{card.value}</p>
          </article>
        )
      })}
    </div>
  )
}
