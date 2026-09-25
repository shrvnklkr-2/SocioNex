import { useEffect, useState, useCallback } from "react"
import {
  User,
  Brain,
  GraduationCap,
  Landmark,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export const FEATURE_CARDS = [
  {
    index: "01",
    tag: "CITIZEN DESK",
    title: "Citizen Reporting",
    body: "Report local challenges with location and evidence from any device.",
    icon: User,
    color: "from-emerald-500 to-teal-600",
  },
  {
    index: "02",
    tag: "AI ENGINE",
    title: "AI Validation",
    body: "Auto-score urgency, detect duplicates, and classify domains instantly.",
    icon: Brain,
    color: "from-teal-500 to-emerald-700",
  },
  {
    index: "03",
    tag: "ACADEMIC LABS",
    title: "University Matching",
    body: "Route challenges to the right departments, faculty, and students.",
    icon: GraduationCap,
    color: "from-emerald-600 to-teal-800",
  },
  {
    index: "04",
    tag: "STATE DESK",
    title: "Industry Collaboration",
    body: "Connect with partners for funding, mentorship, and prototyping.",
    icon: Landmark,
    color: "from-teal-600 to-emerald-600",
  },
  {
    index: "05",
    tag: "FIELD IMPACT",
    title: "Government Oversight",
    body: "Enable approvals, resource allocation, and progress tracking.",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
  },
]

export function SpotlightCarousel() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const prevCard = useCallback(() => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : FEATURE_CARDS.length - 1))
  }, [])

  const nextCard = useCallback(() => {
    setActiveIdx((prev) => (prev < FEATURE_CARDS.length - 1 ? prev + 1 : 0))
  }, [])

  // Auto-play: move the highlight every 3 seconds unless hovered
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(nextCard, 3000)
    return () => clearInterval(timer)
  }, [isHovered, nextCard])

  return (
    <div
      className="space-y-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-emerald-800 uppercase dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span>FEATURES</span>
            <span className="h-0.5 w-8 bg-emerald-500/40" />
          </div>
          <h2 className="mt-1 font-display text-3xl font-normal text-slate-900 sm:text-4xl dark:text-white">
            Powering collaboration at every step.
          </h2>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <p className="max-w-md text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            From local reports to real-world impact, connecting every stakeholder.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevCard}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 hover:scale-110 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextCard}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 hover:scale-110 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Next card"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* All 5 cards visible in a grid — active highlight moves across them */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {FEATURE_CARDS.map((card, idx) => {
          const Icon = card.icon
          const isActive = activeIdx === idx

          return (
            <div
              key={card.index}
              onClick={() => setActiveIdx(idx)}
              className={`group relative flex flex-col justify-between rounded-3xl p-5 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.03] ${
                isActive
                  ? "border-2 border-emerald-500 bg-gradient-to-b from-emerald-50/90 via-white to-emerald-50/30 shadow-xl shadow-emerald-500/15 scale-[1.02] -translate-y-1 dark:border-emerald-400 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40"
                  : "border border-emerald-100 bg-white/95 shadow-sm hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-emerald-400/60"
              }`}
            >
              {/* Active top glow bar */}
              <div
                className={`absolute top-0 inset-x-6 h-1 rounded-b-full transition-all duration-500 ${
                  isActive ? "bg-emerald-500 opacity-100 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-transparent opacity-0 group-hover:bg-emerald-400/50 group-hover:opacity-100"
                }`}
              />

              <div>
                {/* Header: Index & Icon */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold transition-colors duration-300 ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-400 group-hover:text-emerald-600"}`}>
                    {card.index}
                  </span>

                  <div className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md transition-all duration-500 ${isActive ? "scale-110 rotate-6 shadow-lg shadow-emerald-500/30" : "group-hover:scale-110 group-hover:rotate-3"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <span className={`mt-3 block text-[9px] font-black tracking-wider uppercase transition-colors duration-300 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 group-hover:text-emerald-600"}`}>
                  {card.tag}
                </span>

                {/* Title */}
                <h3 className={`mt-1.5 text-base font-bold transition-colors duration-300 ${isActive ? "text-emerald-950 dark:text-white" : "text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300"}`}>
                  {card.title}
                </h3>

                {/* Body */}
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {card.body}
                </p>
              </div>

              {/* Explore arrow */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Explore</span>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 translate-x-1"
                      : "bg-emerald-100 text-emerald-700 group-hover:translate-x-1.5 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950 dark:text-emerald-300"
                  }`}>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress dots with auto-play fill animation */}
      <div className="flex justify-center gap-2 pt-1">
        {FEATURE_CARDS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: activeIdx === idx ? "2rem" : "0.5rem" }}
            aria-label={`Go to feature card ${idx + 1}`}
          >
            <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${
              activeIdx === idx ? "bg-emerald-600 dark:bg-emerald-400" : "bg-slate-300 dark:bg-slate-700"
            }`} />
            {activeIdx === idx && !isHovered && (
              <div
                className="absolute inset-0 rounded-full bg-emerald-400/50 dark:bg-emerald-300/50 origin-left"
                style={{ animation: "progressFill 3s linear" }}
              />
            )}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes progressFill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  )
}
