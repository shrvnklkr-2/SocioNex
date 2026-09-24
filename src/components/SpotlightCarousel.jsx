import { useState } from "react"
import { Link } from "react-router-dom"
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
  CheckCircle2,
} from "lucide-react"

export const FEATURE_CARDS = [
  {
    index: "01",
    tag: "CITIZEN DESK",
    title: "Citizen Problem Reporting",
    body: "Report a local challenge with location, description and evidence directly from any device.",
    points: ["GPS photo tagging", "Offline submission", "Trackable case ID"],
    icon: User,
    color: "from-emerald-500 to-teal-600",
  },
  {
    index: "02",
    tag: "AI QUEUE ENGINE",
    title: "AI Challenge Validation",
    body: "Validate submissions, identify urgency score and filter duplicates automatically before routing.",
    points: ["Urgency scoring", "Duplicate detection", "Domain auto-tagging"],
    icon: Brain,
    color: "from-teal-500 to-emerald-700",
  },
  {
    index: "03",
    tag: "ACADEMIC LABS",
    title: "University Matching",
    body: "Match validated challenges with relevant university departments, students and faculty.",
    points: ["Expertise index", "Faculty assignment", "Student lifecycle"],
    icon: GraduationCap,
    color: "from-emerald-600 to-teal-800",
  },
  {
    index: "04",
    tag: "STATE DESK",
    title: "Industry Collaboration",
    body: "Connect with industry partners, startups, and CSR organizations to provide funding, mentorship, prototyping support, and technology expertise for solution development",
    points: ["Industry mentorship", "Prototyping support", "Technology expertise"],
    icon: Landmark,
    color: "from-teal-600 to-emerald-600",
  },
  {
    index: "05",
    tag: "FIELD IMPACT",
    title: "Government Engagement",
    body: "Connect with the appropriate authority or department to enable quick approvals, resource allocation, and progress monitoring.",
    points: ["Multi-dept oversight", "Resource dashboard", "Panchayat escalation"],
    icon: Users,
    color: "from-emerald-500 to-teal-600",
  },
]

export function SpotlightCarousel() {
  const [activeIdx, setActiveIdx] = useState(2) // Card 03 active by default

  const prevCard = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : FEATURE_CARDS.length - 1))
  }

  const nextCard = () => {
    setActiveIdx((prev) => (prev < FEATURE_CARDS.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="space-y-6">
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
            From local reports to real-world impact, our platform brings every stakeholder into one connected ecosystem.
          </p>

          {/* Controls with Sliding Animation Triggers */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevCard}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextCard}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Next card"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of ALL Cards Visible Simultaneously with Sliding Highlight & Hover Effect */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {FEATURE_CARDS.map((card, idx) => {
          const Icon = card.icon
          const isActive = activeIdx === idx

          return (
            <div
              key={card.index}
              onClick={() => setActiveIdx(idx)}
              className={`group relative flex flex-col justify-between rounded-3xl p-5 cursor-pointer transition-all duration-300 ease-out transform hover:-translate-y-2 hover:scale-[1.03] ${
                isActive
                  ? "border-2 border-emerald-500 bg-gradient-to-b from-emerald-50/90 via-white to-emerald-50/30 shadow-xl shadow-emerald-500/15 dark:border-emerald-400 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40"
                  : "border border-emerald-100 bg-white/95 shadow-sm hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-emerald-400/60"
              }`}
            >
              {/* Active Sliding Glow Bar */}
              <div
                className={`absolute top-0 inset-x-6 h-1 rounded-b-full transition-all duration-500 ${
                  isActive ? "bg-emerald-500 opacity-100" : "bg-transparent opacity-0 group-hover:bg-emerald-400/50 group-hover:opacity-100"
                }`}
              />

              <div>
                {/* Header: Index, Tag & Icon */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold transition-colors ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-400 group-hover:text-emerald-600"}`}>
                    {card.index}
                  </span>

                  <div className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <span className="mt-3 block text-[9px] font-black tracking-wider text-slate-400 uppercase group-hover:text-emerald-600">
                  {card.tag}
                </span>

                {/* Title */}
                <h3 className={`mt-1.5 text-base font-bold transition-colors ${isActive ? "text-emerald-950 dark:text-white" : "text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300"}`}>
                  {card.title}
                </h3>

                {/* Body Description */}
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {card.body}
                </p>
              </div>

              {/* Feature Points & Arrow Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <ul className="space-y-1 mb-3">
                  {card.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Explore</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950 dark:text-emerald-300">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sliding Dots Indicator */}
      <div className="flex justify-center gap-2 pt-1">
        {FEATURE_CARDS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIdx === idx ? "w-8 bg-emerald-600 dark:bg-emerald-400" : "w-2 bg-slate-300 dark:bg-slate-700"
            }`}
            aria-label={`Go to feature card ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
