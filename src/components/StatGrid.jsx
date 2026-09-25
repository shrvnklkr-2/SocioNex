import { FolderKanban, Lightbulb, ShieldCheck, Users } from "lucide-react"
import { liveStats } from "../data/logic"

export function StatGrid({ problems }) {
  const stats = liveStats(problems || [])
  const cards = [
    {
      label: "Challenges submitted",
      value: stats.submitted,
      icon: Lightbulb,
      tone: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
    },
    {
      label: "Assigned",
      value: stats.assigned,
      icon: ShieldCheck,
      tone: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
    },
    {
      label: "In progress",
      value: stats.inProgress,
      icon: FolderKanban,
      tone: "bg-orange-500/15 text-orange-800 dark:text-orange-200",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: Users,
      tone: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-200",
    },
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
            </div>
            <p className="mt-4 text-[11px] font-bold tracking-[0.14em] text-emerald-800 dark:text-emerald-400 uppercase">{card.label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{card.value}</p>
          </article>
        )
      })}
    </div>
  )
}
