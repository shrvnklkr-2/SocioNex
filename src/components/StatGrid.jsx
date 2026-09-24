import { FolderKanban, Lightbulb, ShieldCheck, Users } from "lucide-react"
import { compactNumber, liveStats } from "../data/logic"

export function StatGrid({ problems, overview }) {
  const local = liveStats(problems || [])
  const cards = overview
    ? [
        { label: "Challenges submitted", value: overview.totalChallenges, delta: "API", icon: Lightbulb, tone: "bg-amber-500/15 text-amber-800 dark:text-amber-200" },
        { label: "Assigned", value: overview.assigned, delta: "API", icon: ShieldCheck, tone: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200" },
        { label: "In progress", value: overview.inProgress, delta: "API", icon: FolderKanban, tone: "bg-orange-500/15 text-orange-800 dark:text-orange-200" },
        { label: "Completed", value: overview.completed, delta: "API", icon: Users, tone: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-200" },
      ]
    : [
        { label: "Challenges submitted", value: local.submitted, delta: "+12.4%", icon: Lightbulb, tone: "bg-amber-500/15 text-amber-800 dark:text-amber-200" },
        { label: "In validation", value: local.validation, delta: "+6.1%", icon: ShieldCheck, tone: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200" },
        { label: "Projects active", value: local.active, delta: "+8.0%", icon: FolderKanban, tone: "bg-orange-500/15 text-orange-800 dark:text-orange-200" },
        { label: "Citizens impacted", value: compactNumber(local.impacted), delta: "+21.7%", icon: Users, tone: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-200" },
      ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 w-full">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <article key={card.label} className="rounded-[22px] border-2 border-emerald-500 bg-white dark:bg-slate-900 p-4 shadow-[0_0_18px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className={`grid h-9 w-9 place-items-center rounded-full ${card.tone}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400 px-2.5 py-0.5 text-xs font-bold text-emerald-900 dark:text-emerald-200">{card.delta}</span>
            </div>
            <p className="mt-4 text-[11px] font-bold tracking-[0.14em] text-emerald-800 dark:text-emerald-400 uppercase">{card.label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{card.value}</p>
          </article>
        )
      })}
    </div>
  )
}
